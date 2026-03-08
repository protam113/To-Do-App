'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';
import { Loader } from '../../components/loading/loader';

export default function CustomerLayoutDefault({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading, verifyAndRefreshAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const success = await verifyAndRefreshAuth();
        if (isMounted) {
          setAuthChecked(true);
          if (!success) {
            // Preserve original destination in redirect URL
            const redirectUrl = `/sign-in?from=${encodeURIComponent(pathname)}`;
            router.replace(redirectUrl);
          }
        }
      } catch (error) {
        if (isMounted) {
          setAuthChecked(true);
          router.replace(`/sign-in?from=${encodeURIComponent(pathname)}`);
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [verifyAndRefreshAuth, router, pathname]);

  if (loading || !authChecked) {
    return;
    <div>
      <Loader />
    </div>;
  }

  return isAuthenticated ? <main>{children}</main> : null;
}
