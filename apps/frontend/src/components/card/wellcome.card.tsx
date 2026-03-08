'use client';

import { useAuthStore } from '@/store';
import { Badge } from '../ui';

export default function WelcomeBanner() {
  const userInfo = useAuthStore((state) => state.userInfo);

  return (
    <div className="flex flex-col items-center justify-center text-center h-[400px] bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary">
      <h1 className="text-4xl font-bold text-white mb-2">
        Welcome to OpPortal
      </h1>
      <p className="text-xl text-gray-200 mb-4">
        Your operations command center
      </p>
      <Badge className="bg-red-100 text-red-800 text-sm px-3 py-1">
        {userInfo?.role
          ? userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)
          : 'Guest'}{' '}
        Access
      </Badge>
    </div>
  );
}
