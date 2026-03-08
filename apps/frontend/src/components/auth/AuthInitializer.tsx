'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../../store/auth/store.auth';
import { logDebug } from '../../utils/logger';

export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    logDebug('Initializing auth on app startup...');
    initializeAuth();
  }, [initializeAuth]);

  return null;
}
