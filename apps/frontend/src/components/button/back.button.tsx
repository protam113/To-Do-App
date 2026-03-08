'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { PushButtonProps } from '@/types';
import { ArrowLeftFromLine } from 'lucide-react';

export const BackButton: React.FC<PushButtonProps> = ({ href }) => {
  const router = useRouter();
  const handlePush = () => {
    router.push(href);
  };

  return (
    <button
      onClick={handlePush}
      className="
    flex items-center text-xs justify-center
     h-10 space-x-2 p-2
    bg-white  text-main font-medium
    hover:bg-main-800 hover:text-white

    transition duration-300
  "
    >
      <ArrowLeftFromLine size={26} />
    </button>
  );
};
