import React from 'react';
import type { HeaderProps } from '@/types';

export const Header: React.FC<HeaderProps> = ({ title, className }) => {
  return (
    <div
      className={`mb-6 bg-linear-to-r from-secondary-100 via-secondary-200 to-secondary-600 text-main text-md font-bold px-6 py-4 ${className}`}
    >
      {title}
    </div>
  );
};
