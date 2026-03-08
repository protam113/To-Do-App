// ==============================================
// 📁 store/auth/api.auth.ts - OPTIMIZED VERSION
// ==============================================

import { AuthResponse } from '@/types';
import { baseURL, endpoints } from '../../apis';
import { logDebug, logError } from '../../utils/logger';

export const AuthAPI = {
  getHeaders(): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // Add Authorization header if token exists
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          if (state?.accessToken) {
            headers.append('Authorization', `Bearer ${state.accessToken}`);
          }
        } catch (e) {
          console.error('Error parsing auth storage:', e);
        }
      }
    }

    return headers;
  },

  // Simple headers without Authorization - for refresh endpoint
  getSimpleHeaders(): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const fullUrl = `${baseURL}${endpoints.login}`;
      console.log('🔐 Login attempt:', { fullUrl, username });

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      console.log('📡 Login response status:', response.status);
      console.log('📡 Login response headers:', Object.fromEntries(response.headers.entries()));

      // Kiểm tra nếu response không phải JSON
      const contentType = response.headers.get('content-type');

      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('✅ Login JSON response:', data);
      } else {
        const textData = await response.text();
        console.log('❌ Login non-JSON response:', textData);
        data = { error: 'Invalid response format', rawResponse: textData };
      }

      return { response, data };
    } catch (error) {
      console.error('💥 Login API error:', error);
      throw new Error('Network error during login');
    }
  },

  async logout(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${baseURL}${endpoints.logout}`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      const data = await response.json();
      return { response, data };
    } catch (error) {
      console.error('Logout API error:', error);
      throw new Error('Network error during logout');
    }
  },

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${baseURL}${endpoints.profile}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      logDebug('getCurrentUser HTTP status:', response.status);
      const data = await response.json();

      logDebug('getCurrentUser response data:', data);
      return { response, data };
    } catch (error) {
      console.error('GetCurrentUser API error:', error);
      logError('GetCurrentUser API error:', error);
      throw new Error('Network error while fetching user data');
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    try {
      const fullUrl = `${baseURL}${endpoints.refresh}`;
      console.log('🔄 Refresh token attempt:', fullUrl);

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: this.getSimpleHeaders(),
        credentials: 'include', // This sends the refresh_token cookie
      });

      console.log('📡 Refresh response status:', response.status);
      console.log('📡 Refresh response headers:', Object.fromEntries(response.headers.entries()));

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('✅ Refresh JSON response:', data);
      } else {
        const textData = await response.text();
        console.log('❌ Refresh non-JSON response:', textData);
        data = { error: 'Invalid response format', rawResponse: textData };
      }

      logDebug('refreshToken HTTP status:', response.status);
      logDebug('refreshToken response data:', data);

      return { response, data };
    } catch (error) {
      console.error('💥 RefreshToken API error:', error);
      logError('RefreshToken API error:', error);
      throw new Error('Network error while refreshing token');
    }
  },

  // ========== 2FA APIs ==========

  async setup2FA(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${baseURL}${endpoints.setup_2fa}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      const data = await response.json();
      return { response, data };
    } catch (error) {
      console.error('Setup 2FA API error:', error);
      throw new Error('Network error during 2FA setup');
    }
  },

  async enable2FA(otpCode: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${baseURL}${endpoints.enble_2fa}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ otpCode }),
        credentials: 'include',
      });

      const data = await response.json();
      return { response, data };
    } catch (error) {
      console.error('Enable 2FA API error:', error);
      throw new Error('Network error during 2FA enable');
    }
  },

  async disable2FA(otpCode: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${baseURL}${endpoints.disable_2fa}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ otpCode }),
        credentials: 'include',
      });

      const data = await response.json();
      return { response, data };
    } catch (error) {
      console.error('Disable 2FA API error:', error);
      throw new Error('Network error during 2FA disable');
    }
  },

  async get2FAStatus(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${baseURL}${endpoints.status_2fa}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      const data = await response.json();
      return { response, data };
    } catch (error) {
      console.error('Get 2FA status API error:', error);
      throw new Error('Network error while fetching 2FA status');
    }
  },

  async verify2FA(otpCode: string, tempToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${baseURL}${endpoints.verify_2fa}`, {
        method: 'POST',
        headers: this.getSimpleHeaders(),
        body: JSON.stringify({ tempToken, otpCode }),
        credentials: 'include',
      });

      const data = await response.json();
      return { response, data };
    } catch (error) {
      console.error('Verify 2FA API error:', error);
      throw new Error('Network error during 2FA verification');
    }
  },
};
