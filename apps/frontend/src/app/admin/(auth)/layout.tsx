'use client';

import { Loader } from '@/components/loading/loader';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AuthProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = useAuthStore((state) => state.userInfo);
  const loading = useAuthStore((state) => state.loading);
  const isAuthenticated = !!userInfo;
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        if (isMounted) setAuthChecked(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        if (isMounted) setAuthChecked(true);
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (authChecked) {
      if (!isAuthenticated || userInfo?.role !== 'admin') {
        toast.error('You do not have permission to access this page!');
        router.replace('/admin');
      }
    }
  }, [authChecked, isAuthenticated, userInfo, router]);

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen  bg-main flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return isAuthenticated && userInfo?.role === 'admin' ? <>{children}</> : null;
}
