'use client';

import { Search, User, ChevronDown } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui';
import { ComponentsIcons, Icons } from '@/assets';
import SearchAdminNavigation from './search-admin-navigation';
import { UserAvatar } from '@/components/design';

export default function TopNavAdmin() {
  const { logout, userInfo } = useAuthStore();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between h-full px-4 lg:px-6">
      {/* Left side - Menu toggle and Breadcrumbs */}
      <div className="flex items-center space-x-4 w-full max-w-md">
        <SearchAdminNavigation />
      </div>

      <div className="flex items-center space-x-2">
        {/* Mobile Search */}
        <Button variant="ghost" size="sm" className="md:hidden p-2">
          <Search className="h-4 w-4" />
        </Button>

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
              className="w-56 rounded-md border-none space-y-2 p-4 z-[9999]"
            >
              <DropdownMenuLabel className="text-black">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="h bg-gray-400 " />
              <DropdownMenuItem
                onClick={() => router.push('/admin/profile')}
                className="hover:text-main h-8 text-gray-800"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator className="h bg-gray-400" />
              <DropdownMenuItem
                onClick={() => router.push('/')}
                className="hover:text-main h-8 text-gray-800"
              >
                <ComponentsIcons.Home className="mr-2 h-4 w-4" />
                Portal
              </DropdownMenuItem>

              {['admin'].includes(userInfo?.role || '') && (
                <>
                  <DropdownMenuSeparator className="h bg-gray-400" />
                  <DropdownMenuItem
                    onClick={() => router.push('/admin/health')}
                    className="hover:text-main h-8 text-gray-800"
                  >
                    <Icons.HeartPulseIcon className="mr-2 h-4 w-4" />
                    Health
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/admin/monitor')}
                    className="hover:text-main h-8 text-gray-800"
                  >
                    <Icons.Monitor className="mr-2 h-4 w-4" />
                    Monitor
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator className="h bg-gray-400" />
              <DropdownMenuItem
                className="hover:bg-main-100 hover:text-main   h-8 text-center text-gray-800"
                onClick={logout}
              >
                <Icons.LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
