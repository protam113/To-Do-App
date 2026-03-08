'use client';

import { Card } from '@/components/ui';
import { LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useAuthStore } from '../../store';
import { Icons } from '../../assets/icons';

interface BlockItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface BlockCardProps {
  items: BlockItem[];
}

export const BlockCard = ({ items }: BlockCardProps) => {
  const { userInfo, logout } = useAuthStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 justify-items-center gap-6 p-6 max-w-3xl">
      {items.map((item) => (
        <Link key={item.title} href={item.url}>
          <Card className="group flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 cursor-pointer bg-transparent border-none shadow-none  hover:scale-105">
            <div
              className="p-4 rounded-2xl text-white mb"
              style={{ backgroundColor: item.color }}
            >
              <item.icon className="w-8 h-8" />
            </div>
            <span className="text-lg text-white font-medium  text-center">
              {item.title}
            </span>
          </Card>
        </Link>
      ))}

      <Link href={`/profile`}>
        <Card className="group flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 cursor-pointer bg-transparent border-none shadow-none  hover:scale-105">
          <div
            className="p-4 rounded-2xl text-white mb"
            style={{ backgroundColor: '#E8C511' }}
          >
            <User className="w-8 h-8" />
          </div>
          <span className="text-lg text-white font-medium  text-center">
            Profile
          </span>
        </Card>
      </Link>

      {['admin', 'manager'].includes(userInfo?.role || '') && (
        <Link href={`/admin`}>
          <Card className="group flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 cursor-pointer bg-transparent border-none shadow-none  hover:scale-105">
            <div
              className="p-4 rounded-2xl text-white mb"
              style={{ backgroundColor: '#1F2937' }}
            >
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <span className="text-lg text-white font-medium  text-center">
              Admin Dashbord
            </span>
          </Card>
        </Link>
      )}

      <div onClick={logout}>
        <Card className="group flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 cursor-pointer bg-transparent border-none shadow-none  hover:scale-105">
          <div
            className="p-4 rounded-2xl text-white mb"
            style={{ backgroundColor: '#000000' }}
          >
            <Icons.LogOut className="w-8 h-8" />
          </div>
          <span className="text-lg text-white font-medium  text-center">
            Log Out
          </span>
        </Card>
      </div>
    </div>
  );
};
