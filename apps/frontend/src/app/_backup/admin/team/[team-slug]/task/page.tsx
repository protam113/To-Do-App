'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpin } from '@/components/loading/spin';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.back();
  }, [router]);

  return <LoadingSpin />;
};
export default Page;
