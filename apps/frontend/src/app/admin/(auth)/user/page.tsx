'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  UserPlus,
  Eye,
  EyeOff,
  Plus,
} from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { Container } from '@/components';
import { CustomPagination } from '@/components/design';
import { UserList } from '@/libs/responses/userLib';
import { RefreshButton } from '@/components/button/refresh.button';
import { UserTable } from '@/components/table/admin-user.table';
import { Heading } from '@/components/design';
import PageSizeSelect from '@/components/select/page_size-select';
import RoleSelect from '@/components/select/role-select';
import { UserDetailPanel } from '@/components/panel/user-detail.panel';
import { MemberCard } from '@/components/card/member.card';
import { ErrorLoading } from '@/components/loading/error';
import { LoadingSpin } from '@/components/loading/spin';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { registerFormSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/hooks/auth/useRegister';
import { toast } from 'sonner';
import {
  UserOverviewProvider,
  UserSummaryCards,
} from '@/components/statistics/user/user-overview';
import { cn } from '@/utils';
import { QuestionButton } from '@/components/button/question.button';

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRole, setSelectedRole] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Create member dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: registerAccount, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      password: '',
      email: '',
      lastName: '',
      firstName: '',
      phone_number: '',
    },
  });

  const params = {
    ...(selectedRole !== 'all' && { role: selectedRole }),
    search: actualSearchQuery || undefined,
    page_size: pageSize,
  };

  const { users, isLoading, isError, pagination } = UserList(
    currentPage,
    params,
    refreshKey
  );

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setRefreshKey((prev) => prev + 1);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.total_page) {
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setActualSearchQuery(searchQuery.trim());
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActualSearchQuery('');
    setCurrentPage(1);
  };

  const onSubmitCreateUser = (values: z.infer<typeof registerFormSchema>) => {
    registerAccount(values, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        reset();
        handleRefresh();
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create user');
      },
    });
  };

  const handleOpenCreateDialog = () => {
    reset();
    setShowPassword(false);
    setIsCreateDialogOpen(true);
  };

  return (
    <>
      <Container>
        <div className="flex items-center justify-between mt-8">
          <Heading name="User List" desc="Manage Users and Roles" />
          <div className="space-x-2 flex">
            <Button
              onClick={handleOpenCreateDialog}
              className="bg-main text-white flex"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
            <QuestionButton description="View and manage all users in the system. You can search, filter by role, create new members, and switch between table or grid view. Click on a user to see their details." />
          </div>
        </div>
        <div className="mt-8">
          <UserOverviewProvider>
            <UserSummaryCards />
          </UserOverviewProvider>
        </div>

        <div className="md:flex col flex-col-2 bg-white md:flex-row justify-between items-center mb-2 mt-8 p-2 border border-secondary-200">
          <div className="flex items-center  gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search title (Press Enter)"
                className="pl-10 text-xs pr-8 rounded-md h-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <RefreshButton onClick={handleRefresh} />
            <div className="flex items-center gap-4">
              <span className="text-xs text-main font-semibold">Show:</span>
              <PageSizeSelect
                handlePageSizeChange={handlePageSizeChange}
                pageSize={pageSize}
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-main font-semibold">Role :</span>
              <RoleSelect handleRoleChange={handleRoleChange} />
            </div>

            <div className="flex items-center gap-1 border rounded">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${
                  viewMode === 'table' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                title="Table view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'table' ? (
          <UserTable users={users} isLoading={isLoading} isError={isError} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isError ? (
              <ErrorLoading />
            ) : isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <LoadingSpin key={index} />
              ))
            ) : (
              users?.map((user: any) => (
                <MemberCard
                  key={user.id}
                  userId={user.id}
                  name={
                    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                    user.username ||
                    'Unknown'
                  }
                  username={user.username}
                  role={user.role || 'member'}
                  avatarUrl={user.avatarUrl || '/imgs/logo_c.jpg'}
                  initials={user.firstName?.[0] || user.username?.[0] || 'U'}
                />
              ))
            )}
          </div>
        )}
        <CustomPagination
          currentPage={currentPage}
          totalPage={pagination.total_page}
          onPageChange={handlePageChange}
        />
      </Container>
      <UserDetailPanel users={users} />

      {/* Create Member Dialog */}
      <AlertDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <AlertDialogContent className="sm:max-w-lg bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Member</AlertDialogTitle>
          </AlertDialogHeader>
          <form
            onSubmit={handleSubmit(onSubmitCreateUser)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  placeholder="First name"
                  className="w-full bg-white"
                  disabled={isPending}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  placeholder="Last name"
                  className="w-full bg-white"
                  disabled={isPending}
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Username *
              </label>
              <Input
                placeholder="Enter username"
                className="w-full bg-white"
                disabled={isPending}
                {...register('username')}
              />
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email *
              </label>
              <Input
                type="email"
                placeholder="Enter email address"
                className="w-full bg-white"
                disabled={isPending}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </label>
              <Input
                type="tel"
                placeholder="Enter phone number"
                className="w-full bg-white"
                disabled={isPending}
                {...register('phone_number')}
              />
              {errors.phone_number && (
                <p className="text-xs text-red-500">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="w-full bg-white pr-10"
                  disabled={isPending}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <AlertDialogCancel className="flex-1" type="button">
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                className="flex-1 bg-main hover:bg-main-700"
                disabled={isPending}
              >
                {isPending ? 'Creating...' : 'Create Member'}
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
