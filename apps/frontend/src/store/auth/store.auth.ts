import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { AuthAPI } from './api.auth';
import { CookieManager } from './cookie.auth';
import { handleAuthError } from './utils.auth';
import { toast } from 'sonner';
import { logDebug, logError, logWarn } from '../../utils/logger';
import { AppError, ERROR_MESSAGE, LogCode } from '@/types';
import { AuthState } from '@/types';
import { baseURL, endpoints } from '@/apis';

const isProd = process.env.NODE_ENV === 'production';
const isClient = typeof window !== 'undefined';

const REFRESH_BUFFER = 300;
const MAX_REFRESH_RETRIES = 3;
const RETRY_DELAY = 2000;

let refreshTimer: NodeJS.Timeout | null = null;

class RefreshMutex {
  private promise: Promise<boolean> | null = null;
  private resolvers: Array<(value: boolean) => void> = [];

  async acquire(refreshFn: () => Promise<boolean>): Promise<boolean> {
    if (this.promise) {
      logDebug('Refresh in progress, waiting for result...');
      return this.promise;
    }

    this.promise = new Promise<boolean>(async (resolve) => {
      try {
        const result = await refreshFn();
        // Resolve tất cả các waiters
        this.resolvers.forEach((r) => r(result));
        resolve(result);
      } catch (error) {
        this.resolvers.forEach((r) => r(false));
        resolve(false);
      } finally {
        this.promise = null;
        this.resolvers = [];
      }
    });

    return this.promise;
  }

  isRefreshing(): boolean {
    return this.promise !== null;
  }
}

const refreshMutex = new RefreshMutex();

const setupVisibilityListener = (onVisible: () => void) => {
  if (!isClient) return;

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      onVisible();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () =>
    document.removeEventListener('visibilitychange', handleVisibilityChange);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      loading: false,
      error: null,
      userInfo: null,
      accessToken: null,
      tokenExpiresAt: null,
      isRefreshing: false,

      clearError: () => set({ error: null }),

      setAccessToken: (token: string | null) => {
        if (token) {
          const expiresAt = get().getTokenExpiryFromJWT(token);
          set({ accessToken: token, tokenExpiresAt: expiresAt });
        } else {
          set({ accessToken: null, tokenExpiresAt: null });
        }
      },

      getTokenExpiryFromJWT: (token: string): number | null => {
        try {
          if (!token || typeof token !== 'string') return null;
          const parts = token.split('.');
          if (parts.length !== 3) return null;
          const payload = JSON.parse(atob(parts[1]));
          return payload.exp ? payload.exp * 1000 : null;
        } catch {
          logWarn('Failed to decode JWT token');
          return null;
        }
      },

      isTokenNearExpiry: (): boolean => {
        const { tokenExpiresAt, accessToken } = get();
        if (!accessToken || !tokenExpiresAt) return true;
        const now = Date.now();
        const bufferMs = REFRESH_BUFFER * 1000;
        // Near expiry = within buffer period but not yet expired
        return tokenExpiresAt - now <= bufferMs && tokenExpiresAt > now;
      },

      isTokenExpired: (): boolean => {
        const { tokenExpiresAt, accessToken } = get();
        if (!accessToken || !tokenExpiresAt) return true;
        return Date.now() >= tokenExpiresAt;
      },

      shouldRefreshToken: (): boolean => {
        const { isTokenExpired, isTokenNearExpiry, accessToken } = get();
        if (!accessToken) return true;
        return isTokenExpired() || isTokenNearExpiry();
      },

      handleAuthFailure: () => {
        if (refreshTimer) {
          clearTimeout(refreshTimer);
          refreshTimer = null;
        }
        CookieManager.delete('isAuthenticated');
        if (isClient) {
          localStorage.removeItem('auth-storage');
        }
        set({
          isAuthenticated: false,
          userInfo: null,
          accessToken: null,
          tokenExpiresAt: null,
          loading: false,
          error: null,
          isRefreshing: false,
        });
      },

      refreshTokenIfNeeded: async (retryCount = 0): Promise<boolean> => {
        const { shouldRefreshToken, getTokenExpiryFromJWT } = get();

        // If token is still valid, no refresh needed
        if (!shouldRefreshToken()) {
          logDebug('Token still valid, no refresh needed');
          return true;
        }

        // Use mutex to handle concurrent refresh requests
        return refreshMutex.acquire(async () => {
          // Double-check after acquiring mutex
          if (!get().shouldRefreshToken()) {
            logDebug('Token refreshed by another request');
            return true;
          }

          set({ isRefreshing: true });

          const doRefresh = async (attempt: number): Promise<boolean> => {
            try {
              logDebug(
                `Attempting token refresh... (attempt ${
                  attempt + 1
                }/${MAX_REFRESH_RETRIES})`
              );
              const { response, data } = await AuthAPI.refreshToken();

              // Auth error - refresh token invalid/expired
              if (response.status === 401 || response.status === 403) {
                logWarn(
                  'Refresh token invalid or expired (HTTP ' +
                    response.status +
                    ')'
                );
                return false;
              }

              // Success
              if (response.ok && data?.success && data?.data?.accessToken) {
                const newAccessToken = data.data.accessToken;
                const newExpiresAt = getTokenExpiryFromJWT(newAccessToken);

                set({
                  accessToken: newAccessToken,
                  tokenExpiresAt: newExpiresAt,
                  isRefreshing: false,
                });

                logDebug('Token refreshed successfully');
                return true;
              }

              // Server error - có thể retry
              if (response.status >= 500 || !response.ok) {
                throw new Error(`Server error: ${response.status}`);
              }

              throw new Error(
                'Invalid refresh response: ' + JSON.stringify(data)
              );
            } catch (error) {
              // Retry với delay
              if (attempt < MAX_REFRESH_RETRIES - 1) {
                logWarn(
                  `Refresh failed, retrying in ${RETRY_DELAY}ms... (attempt ${
                    attempt + 1
                  }/${MAX_REFRESH_RETRIES})`,
                  error
                );
                await new Promise((resolve) =>
                  setTimeout(resolve, RETRY_DELAY)
                );
                return doRefresh(attempt + 1);
              }

              logError(
                `Token refresh failed after ${MAX_REFRESH_RETRIES} attempts:`,
                error
              );
              return false;
            }
          };

          try {
            return await doRefresh(retryCount);
          } finally {
            set({ isRefreshing: false });
          }
        });
      },

      verifyAndRefreshAuth: async (requiredRole?: string): Promise<boolean> => {
        const {
          refreshTokenIfNeeded,
          handleAuthFailure,
          scheduleTokenRefresh,
        } = get();

        try {
          set({ loading: true });

          const refreshSuccess = await refreshTokenIfNeeded();

          if (!refreshSuccess) {
            // Kiểm tra xem có phải auth error thực sự không
            // Nếu là network error, có thể vẫn tiếp tục với token cũ nếu chưa expired
            const currentState = get();

            if (!currentState.accessToken) {
              // Không có token - cần login lại
              logWarn('No access token available');
              handleAuthFailure();
              return false;
            }

            // Kiểm tra token có còn valid không
            if (
              currentState.tokenExpiresAt &&
              Date.now() < currentState.tokenExpiresAt
            ) {
              // Token vẫn còn valid, có thể tiếp tục
              logWarn('Refresh failed but token still valid, continuing...');
            } else {
              // Token đã expired và refresh failed
              logWarn('Token expired and refresh failed');
              handleAuthFailure();
              return false;
            }
          }

          const { response, data } = await AuthAPI.getCurrentUser();

          if (response.status === 401 || response.status === 403) {
            logWarn('User info request unauthorized');
            handleAuthFailure();
            return false;
          }

          if (response.status !== 200 || !data?.data) {
            logWarn('Failed to fetch user info');
            // Không logout ngay nếu chỉ là network error
            if (response.status >= 500) {
              toast.error('Server error. Please try again.');
              return false;
            }
            handleAuthFailure();
            return false;
          }

          const userInfo = data.data;
          const userRole = userInfo.role;

          if (requiredRole) {
            const allowedRoles =
              requiredRole === 'admin'
                ? ['admin', 'manager'] // Manager cũng được vào admin area
                : ['admin', 'manager', 'user'];

            if (!allowedRoles.includes(userRole)) {
              logWarn(
                'Unauthorized role: ' + userRole + '. Required: ' + requiredRole
              );
              // KHÔNG gọi handleAuthFailure() ở đây - user vẫn đăng nhập, chỉ không có quyền
              // Vẫn set isAuthenticated = true để layout biết user đã login
              set({
                isAuthenticated: true,
                userInfo: userInfo,
                loading: false,
              });
              return false;
            }
          }

          CookieManager.set('isAuthenticated', 'true', {
            expires: 30, // Match với refresh token 30 ngày
            secure: isProd,
            sameSite: 'Lax',
          });

          set({
            isAuthenticated: true,
            userInfo: userInfo,
            loading: false,
          });

          scheduleTokenRefresh();
          return true;
        } catch (error) {
          logError('Auth verification failed:', error);
          // Không logout ngay nếu là network error
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          if (
            errorMessage.includes('Network') ||
            errorMessage.includes('fetch')
          ) {
            toast.error('Network error. Please check your connection.');
            return false;
          }
          handleAuthFailure();
          return false;
        } finally {
          set({ loading: false });
        }
      },

      scheduleTokenRefresh: () => {
        if (refreshTimer) {
          clearTimeout(refreshTimer);
          refreshTimer = null;
        }

        const { tokenExpiresAt, refreshTokenIfNeeded, handleAuthFailure } =
          get();

        if (!tokenExpiresAt) {
          logWarn('Cannot schedule refresh: no token expiry time');
          return;
        }

        const now = Date.now();
        const bufferMs = REFRESH_BUFFER * 1000;
        const refreshAt = tokenExpiresAt - bufferMs;
        let refreshIn = Math.max(refreshAt - now, 0);

        // If token is already near expiry or expired, refresh immediately
        if (refreshIn === 0) {
          logDebug('Token already near expiry, refreshing immediately');
          refreshTokenIfNeeded().then((success) => {
            if (success) {
              // Re-schedule sau khi refresh thành công
              get().scheduleTokenRefresh();
            }
          });
          return;
        }

        logDebug(
          'Scheduling token refresh in ' +
            Math.round(refreshIn / 1000 / 60) +
            ' minutes'
        );

        refreshTimer = setTimeout(async () => {
          try {
            const success = await refreshTokenIfNeeded();
            if (success) {
              logDebug('Auto-refresh successful');
              get().scheduleTokenRefresh();
            } else {
              // Check if we still have a token (network error vs auth error)
              const currentState = get();

              // Nếu không còn token hoặc refresh token thực sự hết hạn (401/403)
              // thì mới logout
              if (!currentState.accessToken) {
                logWarn('No access token after refresh failure, logging out');
                handleAuthFailure();
                toast.error('Session expired. Please login again.');
                window.location.href = '/sign-in';
              } else {
                // Network error - token vẫn còn, retry sau 1 phút
                logWarn(
                  'Auto-refresh failed (possibly network), will retry in 1 minute'
                );
                toast.warning('Connection issue. Retrying...');
                setTimeout(() => get().scheduleTokenRefresh(), 60000);
              }
            }
          } catch (error) {
            logError('Auto-refresh error:', error);
            // Retry sau 1 phút thay vì logout ngay
            setTimeout(() => get().scheduleTokenRefresh(), 60000);
          }
        }, refreshIn);
      },

      clearTokenRefresh: () => {
        if (refreshTimer) {
          clearTimeout(refreshTimer);
          refreshTimer = null;
        }
      },

      initializeAuth: async () => {
        const {
          refreshTokenIfNeeded,
          getTokenExpiryFromJWT,
          scheduleTokenRefresh,
          handleAuthFailure,
          shouldRefreshToken,
        } = get();

        try {
          const authStorage = isClient
            ? localStorage.getItem('auth-storage')
            : null;

          if (!authStorage) {
            logDebug('No auth storage found, user needs to login');
            return;
          }

          const { state } = JSON.parse(authStorage);

          if (state?.accessToken) {
            const expiresAt =
              state.tokenExpiresAt || getTokenExpiryFromJWT(state.accessToken);
            set({
              accessToken: state.accessToken,
              tokenExpiresAt: expiresAt,
              // Restore isAuthenticated và userInfo từ storage
              isAuthenticated: state.isAuthenticated || false,
              userInfo: state.userInfo || null,
            });
          }

          // Setup visibility listener - refresh khi user quay lại tab
          setupVisibilityListener(() => {
            if (shouldRefreshToken()) {
              logDebug('Tab became visible, checking token...');
              refreshTokenIfNeeded();
            }
          });

          // Luôn thử refresh token khi khởi tạo
          const refreshSuccess = await refreshTokenIfNeeded();

          if (!refreshSuccess) {
            const currentState = get();

            // Nếu vẫn còn token và chưa expired, có thể tiếp tục
            if (currentState.accessToken && currentState.tokenExpiresAt) {
              if (Date.now() < currentState.tokenExpiresAt) {
                logWarn(
                  'Refresh failed but token still valid, continuing with existing token'
                );
              } else {
                logWarn('Token expired and refresh failed');
                handleAuthFailure();
                return;
              }
            } else {
              logWarn('No valid token available');
              handleAuthFailure();
              return;
            }
          }

          const userResponse = await AuthAPI.getCurrentUser();

          if (
            userResponse.response.status === 401 ||
            userResponse.response.status === 403
          ) {
            logWarn('User info request unauthorized during init');
            handleAuthFailure();
            return;
          }

          if (userResponse.response.status === 200 && userResponse.data?.data) {
            set({
              isAuthenticated: true,
              userInfo: userResponse.data.data,
            });

            CookieManager.set('isAuthenticated', 'true', {
              expires: 30,
              secure: isProd,
              sameSite: 'Lax',
            });

            scheduleTokenRefresh();
            logDebug('Session restored successfully');
          } else if (userResponse.response.status >= 500) {
            // Server error - không logout, để user thử lại
            logWarn('Server error during init, keeping session');
          } else {
            throw new Error('Failed to fetch user info');
          }
        } catch (error) {
          logWarn('Failed to restore session:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          if (
            !errorMessage.includes('Network') &&
            !errorMessage.includes('fetch')
          ) {
            handleAuthFailure();
          }
        }
      },

      login: async (username: string, password: string): Promise<boolean> => {
        const {
          getTokenExpiryFromJWT,
          scheduleTokenRefresh,
          handleAuthFailure,
        } = get();

        try {
          set({ loading: true, error: null });

          const { response, data } = await AuthAPI.login(username, password);

          if (response.ok && data?.success && data?.data?.accessToken) {
            const accessToken = data?.data?.accessToken;

            if (!accessToken) {
              console.error('No access token in response:', data);
              throw new Error('No access token received from server');
            }

            const tokenExpiresAt = getTokenExpiryFromJWT(accessToken);
            set({ accessToken, tokenExpiresAt });

            const userResponse = await AuthAPI.getCurrentUser();

            if (
              userResponse.response.status === 200 &&
              userResponse.data?.data
            ) {
              CookieManager.set('isAuthenticated', 'true', {
                expires: 30,
                secure: isProd,
                sameSite: 'Lax',
              });

              set({
                isAuthenticated: true,
                userInfo: userResponse.data.data,
                loading: false,
              });

              scheduleTokenRefresh();
              toast.success('Login successful! Redirecting to home page..');
              return true;
            } else {
              throw new Error('Failed to fetch user info after login');
            }
          }

          if (response.status === 401 || response.status === 400) {
            throw new AppError(
              LogCode.INVALID_CREDENTIALS,
              ERROR_MESSAGE.INCORRECT_INFORMATION
            );
          }

          throw new Error(data?.message || 'Login failed');
        } catch (error) {
          const errorMessage = handleAuthError(error);
          handleAuthFailure();
          set({ error: errorMessage });
          toast.error(errorMessage);
          return false;
        }
      },

      fetchUserInfo: async () => {
        if (!get().isAuthenticated) return;

        try {
          set({ loading: true });
          const { response, data } = await AuthAPI.getCurrentUser();

          if (response.status === 200 && data?.data) {
            set({ userInfo: data.data, loading: false });
          } else {
            throw new Error('Failed to fetch user info');
          }
        } catch (error) {
          const errorMessage = handleAuthError(error);
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
        }
      },

      updateProfile: async (profileData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone_number?: string;
      }): Promise<boolean> => {
        try {
          set({ loading: true });

          const response = await fetch(`${baseURL}${endpoints.profile}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${get().accessToken}`,
            },
            credentials: 'include',
            body: JSON.stringify(profileData),
          });

          const data = await response.json();

          if (response.ok && data?.success) {
            // Refresh user info sau khi update
            await get().fetchUserInfo();
            toast.success('Profile updated successfully!');
            return true;
          }

          throw new Error(data?.message || 'Failed to update profile');
        } catch (error) {
          const errorMessage = handleAuthError(error);
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        const { clearTokenRefresh, handleAuthFailure } = get();

        try {
          set({ loading: true });
          clearTokenRefresh();

          try {
            const { response } = await AuthAPI.logout();
            if (!response.ok) {
              console.warn(
                'Server logout failed, continuing with local logout'
              );
            }
          } catch (error) {
            logWarn('Server logout error:', error);
          }

          handleAuthFailure();
          toast.success('Log out successfully!');
          window.location.href = '/sign-in';
        } catch (error) {
          logError('Catastrophic error during logout:', error);
          handleAuthFailure();
          window.location.href = '/sign-in';
        }
      },

      checkAuth: async (shouldRedirect = true) => {
        const success = await get().verifyAndRefreshAuth();
        if (!success && shouldRedirect) {
          window.location.href = '/sign-in';
        }
      },

      checkAdmin: async (shouldRedirect = true) => {
        const success = await get().verifyAndRefreshAuth('admin');
        if (!success && shouldRedirect) {
          window.location.href = '/sign-in';
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: isClient ? createJSONStorage(() => localStorage) : undefined,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userInfo: state.userInfo,
        accessToken: state.accessToken,
        tokenExpiresAt: state.tokenExpiresAt,
      }),
    }
  )
);
