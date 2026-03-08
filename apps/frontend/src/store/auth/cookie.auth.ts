// ==============================================
// 📁 store/auth/cookie.auth.ts - OPTIMIZED VERSION
// ==============================================

import { CookieOptions } from '@/types';
import { logDebug } from '../../utils/logger';

export const CookieManager = {
  /**
   * Set a cookie with options
   */
  set(name: string, value: string, options: CookieOptions = {}) {
    // Check if we're on client side
    if (typeof document === 'undefined') {
      logDebug('Skipping cookie set in SSR');
      return;
    }

    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (options.expires) {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    }

    cookieString += '; path=/';

    const isSecure =
      options.secure !== false &&
      process.env.NODE_ENV === 'production' &&
      window.location.protocol === 'https:';
    if (isSecure) {
      cookieString += '; Secure';
    }

    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }

    try {
      document.cookie = cookieString;
    } catch (error) {
      console.error('Failed to set cookie:', error);
    }
  },

  /**
   * Delete a cookie
   */
  delete(name: string) {
    if (typeof document === 'undefined') {
      return;
    }

    try {
      const isSecure =
        process.env.NODE_ENV === 'production' &&
        window.location.protocol === 'https:';
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${isSecure ? 'Secure;' : ''
        } SameSite=Lax;`;
    } catch (error) {
      console.error('Failed to delete cookie:', error);
    }
  },

  /**
   * Check if a cookie exists and has the expected value
   */
  check(name: string): boolean {
    if (typeof document === 'undefined') {
      return false;
    }

    try {
      const value = this.get(name);
      const isTrue = value === 'true';
      return isTrue;
    } catch (error) {
      console.error('Failed to check cookie:', error);
      return false;
    }
  },

  /**
   * Get cookie value by name
   */
  get(name: string): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = decodeURIComponent(
          parts.pop()?.split(';').shift() || ''
        );
        return cookieValue;
      }
      return null;
    } catch (error) {
      console.error('Failed to get cookie:', error);
      return null;
    }
  },
};
