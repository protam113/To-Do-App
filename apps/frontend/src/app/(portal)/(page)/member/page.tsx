'use client';

import { Container } from '@/components';
import { Heading } from '@/components/design/heading.design';
import { AuthUserList } from '@/libs';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import { RefreshButton } from '@/components/button/refresh.button';
import PageSizeSelect from '@/components/select/page_size-select';
import { CustomPagination } from '@/components/design/pagination.design';
import { ErrorLoading } from '@/components/loading/error';
import { LoadingSpin } from '@/components/loading/spin';
import { ProfileCard } from '@/components/card/profile.card';

const Page = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const params = {
    title: actualSearchQuery || undefined,
    page_size: pageSize,
  };
  const { users, isLoading, isError, pagination } = AuthUserList(
    currentPage,
    params,
    refreshKey
  );

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.total_page) {
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setRefreshKey((prev) => prev + 1); // Refresh data manually
  };

  // Handle search on Enter key press
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setActualSearchQuery(searchQuery.trim());
      setCurrentPage(1); // Reset to first page when searching
    }
  };

  // Clear search function
  const handleClearSearch = () => {
    setSearchQuery('');
    setActualSearchQuery('');
    setCurrentPage(1);
  };
  return (
    <Container>
      <Heading name="Members" />

      <div className="md:flex col flex-col-2 md:flex-row justify-between mt-4 items-center mb-6">
        <div className="flex items-center gap-4">
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
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isError ? (
          <ErrorLoading />
        ) : isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <LoadingSpin key={index} />
          ))
        ) : (
          users?.map((user: any) => (
            <ProfileCard
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

      <CustomPagination
        currentPage={currentPage}
        totalPage={pagination.total_page}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default Page;
