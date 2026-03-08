'use client';

import type React from 'react';
import { useState } from 'react';

//Components
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import { Container } from '@/components';
import { CustomPagination } from '@/components/design';
import { RefreshButton } from '@/components/button/refresh.button';
import { UserTeamList } from '@/libs/responses/teamLib';
import { Heading } from '@/components/design';
import { TeamTable } from '@/components/pages/team/team.table';
import PageSizeSelect from '@/components/select/page_size-select';

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>();

  const params = {
    ...(selectedRole !== 'all' && { role: selectedRole }),
    search: actualSearchQuery || undefined,
    page_size: pageSize,
  };

  const { teams, isLoading, isError, pagination } = UserTeamList(
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
    setRefreshKey((prev) => prev + 1);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setRefreshKey((prev) => prev + 1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setActualSearchQuery(searchQuery.trim());
      setCurrentPage(1);
    }
  };

  // Clear search function
  const handleClearSearch = () => {
    setSearchQuery('');
    setActualSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <>
      <Container>
        <Heading name="My Team List" />

        <div className="md:flex col flex-col-2 md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search title (Press Enter)"
                className="pl-10 pr-8 rounded-md h-10 bg-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {/* Clear search button */}
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
              <span className="text-xs text-main font-semibold">Role:</span>
              <Select onValueChange={handleRoleChange}>
                <SelectTrigger className="w-[80px] h-10 rounded-md bg-white px-4">
                  <SelectValue placeholder="all" />
                </SelectTrigger>
                <SelectContent
                  className="rounded-md bg-white min-w-[80px]"
                  align="start"
                >
                  <SelectItem value="all" className="rounded-md">
                    All
                  </SelectItem>
                  <SelectItem value="owner" className="rounded-md">
                    Owner
                  </SelectItem>
                  <SelectItem value="manager" className="rounded-md">
                    Manager
                  </SelectItem>
                  <SelectItem value="member" className="rounded-md">
                    Member
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <TeamTable teams={teams} isLoading={isLoading} isError={isError} />
        </div>
        <CustomPagination
          currentPage={currentPage}
          totalPage={pagination.total_page}
          onPageChange={handlePageChange}
        />
      </Container>
    </>
  );
}
