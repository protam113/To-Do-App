'use client';

import { UserListData } from '@/types';
import { useSelectedUserContext } from '../../context/use-selected-user.context';
import { UserAvatar } from '../design/avatar.design';
import { Sheet,  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription } from '../ui';


interface UserDetailPanelProps {
  users: UserListData[];
}

export const UserDetailPanel = ({ users }: UserDetailPanelProps) => {
  const { userId, clearSelectedUser } = useSelectedUserContext();

  const user = userId ? users.find((u) => u.id === userId) : null;
  const isOpen = !!userId;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      clearSelectedUser();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="bg-white w-120 p-4">
        <SheetHeader>
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription className="sr-only">
            View user information
          </SheetDescription>
        </SheetHeader>

        {user ? (
          <div className="py-4">
            <div className="flex flex-col items-center mb-6">
              <UserAvatar
                url={user.avatarUrl || '/imgs/logo_c.jpg'}
                username={user.username}
              />
              <h4 className="font-bold mt-3">
                {user.firstName} {user.lastName}
              </h4>
              <span className="text-gray-500 text-sm">@{user.username}</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Role</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-medium ${
                    user.isActive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Blocked</span>
                <span
                  className={`font-medium ${
                    user.isBlocked ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {user.isBlocked ? 'Yes' : 'No'}
                </span>
              </div>
              {user.phone_number && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{user.phone_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Provider</span>
                <span className="font-medium capitalize">{user.provider}</span>
              </div>
              {user.lastLogin && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Login</span>
                  <span className="font-medium">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">User not found</div>
        )}
      </SheetContent>
    </Sheet>
  );
};
