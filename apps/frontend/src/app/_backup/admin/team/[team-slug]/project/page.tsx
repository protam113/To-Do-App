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
  Button,
} from '@/components/ui';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import { Container } from '@/components';
import { CustomPagination } from '@/components/design';
import { Header } from '@/components/design/header.design';
import { RefreshButton } from '@/components/button/refresh.button';
import { TeamProjectList } from '@/libs/responses/projectLib';
import { useParams } from 'next/navigation';
import { AdminProjectTable } from '@/components/pages/project/ admin-project.table';
import CreateProject from '@/components/pages/project/create-project';

export default function Page() {
  const params = useParams();
  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : params['team-slug'] || '';

  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filters = {
    search: actualSearchQuery || undefined,
    page_size: pageSize,
  };

  const { projects, isLoading, isError, pagination } = TeamProjectList(
    currentPage,
    teamSlug,
    filters,
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

  // Handle search on Enter key press
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
        <Header title="Project Management Page" />

        <div className="md:flex col flex-col-2 md:flex-row justify-between items-center mb-6">
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
              <Select
                onValueChange={handlePageSizeChange}
                defaultValue={String(pageSize)}
              >
                <SelectTrigger className="w-[80px] h-10 rounded-md bg-white px-4">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent
                  className="rounded-md bg-white min-w-[80px]"
                  align="start"
                >
                  <SelectItem value="5" className="rounded-md">
                    5
                  </SelectItem>
                  <SelectItem value="10" className="rounded-md">
                    10
                  </SelectItem>
                  <SelectItem value="20" className="rounded-md">
                    20
                  </SelectItem>
                  <SelectItem value="50" className="rounded-md">
                    50
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button
                onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
                className={
                  isCreateDialogOpen
                    ? 'border-b-2 border-b-main text-main'
                    : 'border-b-2 border-b-main hover:bg-main-800 hover:text-white'
                }
              >
                {isCreateDialogOpen ? 'Cancel' : 'Create Project'}
              </Button>
            </div>
          </div>
        </div>

        {isCreateDialogOpen && (
          <div className="bg-white border-2 border-main   p-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
            <CreateProject
              teamSlug={teamSlug}
              onSuccess={() => setIsCreateDialogOpen(false)}
            />
          </div>
        )}
        {!isCreateDialogOpen && (
          <>
            <div className=" min-w-0">
              <AdminProjectTable
                projects={projects}
                isLoading={isLoading}
                isError={isError}
              />
            </div>
            <CustomPagination
              currentPage={currentPage}
              totalPage={pagination.total_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Container>
    </>
  );
}
