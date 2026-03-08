'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from '@/components/loading/loader';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard immediately
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>
  );
}
