'use client';

import Head from 'next/head';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/admin_layout/layout';
import { useAuthStore } from '../../store';
import { Loader } from '../../components/loading/loader';
import { ScrollToTopButton } from '../../components/button/scroll.button';
import { toast } from 'sonner';

type AuthStatus = 'checking' | 'authorized' | 'unauthorized';

export default function AuthProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { verifyAndRefreshAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const success = await verifyAndRefreshAuth('admin');

        if (!isMounted) return;

        if (success) {
          setAuthStatus('authorized');
        } else {
          setAuthStatus('unauthorized');

          const currentAuth = useAuthStore.getState().isAuthenticated;

          if (currentAuth) {
            toast.error('You do not have permission to access this page.');
            router.back();
          } else {
            // Chưa đăng nhập -> về trang login
            const redirectUrl = `/sign-in?from=${encodeURIComponent(pathname)}`;
            router.replace(redirectUrl);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        if (isMounted) {
          setAuthStatus('unauthorized');
          router.replace(`/sign-in?from=${encodeURIComponent(pathname)}`);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [verifyAndRefreshAuth, router, pathname]);

  if (authStatus !== 'authorized') {
    return (
      <div className="min-h-screen  bg-main flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        {children}
        <ScrollToTopButton />
      </AdminLayout>
    </>
  );
}
