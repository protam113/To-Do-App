'use client';

import SearchNavigation from './search-navigation';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import { ComponentsIcons, Icons } from '@/assets/icons';
import { ChevronDown, User } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { UserAvatar } from '@/components/design';

export default function TopNav() {
  const { logout, userInfo } = useAuthStore();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between h-full px-4 lg:px-6 relative z-50">
      {/* Left side - Menu toggle and Breadcrumbs */}
      <div className="flex items-center space-x-4 w-full max-w-md">
        <SearchNavigation />
      </div>

      <div className="flex items-center space-x-2 relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
            >
              <div className="relative">
                <UserAvatar url={userInfo?.avatarUrl || '/icons/logo.svg'} />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <span className="font-semibold text-sm text-gray-900">
                  {userInfo?.fullName}
                </span>
                <span className="text-xs text-blue-600 font-medium">
                  {userInfo?.role}
                </span>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white space-y-2 p-4 rounded-md z-[9999]"
          >
            <DropdownMenuLabel className="text-black">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="h bg-gray-400 " />
            <DropdownMenuItem
              onClick={() => router.push('/profile')}
              className="hover:bg-gray-100 h-8 text-gray-800 cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            {['admin', 'manager'].includes(userInfo?.role || '') && (
              <>
                <DropdownMenuSeparator className="h bg-gray-400" />
                <DropdownMenuItem
                  onClick={() => router.push('/admin')}
                  className="hover:bg-gray-100 h-8 text-gray-800 cursor-pointer"
                >
                  <Icons.BrickWallShield className="mr-2 h-4 w-4" />
                  Admin
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator className="h bg-gray-400 " />

            <DropdownMenuItem
              onClick={() => router.push('/ticket')}
              className="hover:bg-gray-100 text-gray-800 cursor-pointer"
            >
              <ComponentsIcons.MessageSquareWarning />
              Ticket
            </DropdownMenuItem>
            <DropdownMenuSeparator className="h bg-gray-400" />
            <DropdownMenuItem
              className="hover:bg-gray-100 text-gray-800 h-8 text-center cursor-pointer"
              onClick={logout}
            >
              <Icons.LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
