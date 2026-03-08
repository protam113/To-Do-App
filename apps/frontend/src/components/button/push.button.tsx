'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { PushButtonProps } from '@/types';
import { Plus } from 'lucide-react';
import { cn } from '@/utils';

export const PushButton: React.FC<PushButtonProps> = ({
  href,
  label,
  className,
  ...props
}) => {
  const router = useRouter();
  const handlePush = () => {
    router.push(href);
  };

  return (
    <button
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium transition-all hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 shadow-sm hover:shadow-md',
        className
      )}
      onClick={handlePush}
      {...props}
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      <span>{label}</span>
    </button>
  );
};
