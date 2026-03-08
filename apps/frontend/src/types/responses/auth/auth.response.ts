import { Provider } from '../../enum/provider.enum';
import { BaseResponse } from '../../types/base/base.type';

export interface UserDetail {
  id: string;
  fullName: string;
  phone_number?: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: string;
  isActive: boolean;
  isBlocked: boolean;
  provider: Provider;
  lastLogin: Date | string;
}

export type UserDetailData = BaseResponse<UserDetail>;

export interface AuthResponse<T = any> {
  response: Response;
  data: T;
}

export interface CookieOptions {
  expires?: number;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userInfo: UserDetail | null;
  accessToken: string | null;
  tokenExpiresAt: number | null;
  isRefreshing: boolean;

  clearError: () => void;
  initializeAuth: () => Promise<void>;
  scheduleTokenRefresh: () => void;
  clearTokenRefresh: () => void;
  login: (username: string, password: string) => Promise<boolean>;
  fetchUserInfo: () => Promise<void>;
  updateProfile: (profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone_number?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: (shouldRedirect?: boolean) => Promise<void>;
  checkAdmin: (shouldRedirect?: boolean) => Promise<void>;
  setAccessToken: (token: string | null) => void;

  // Methods for proactive token refresh
  getTokenExpiryFromJWT: (token: string) => number | null;
  isTokenNearExpiry: () => boolean;
  isTokenExpired: () => boolean;
  shouldRefreshToken: () => boolean;
  refreshTokenIfNeeded: (retryCount?: number) => Promise<boolean>;
  verifyAndRefreshAuth: (requiredRole?: string) => Promise<boolean>;
  handleAuthFailure: () => void;
}
