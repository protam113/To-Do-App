'use client';

import type React from 'react';
import { useState } from 'react';

//Components
import { Button } from '@/components/ui';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import { Container } from '@/components';
import { CustomPagination, Heading } from '@/components/design';
import { RefreshButton } from '@/components/button/refresh.button';
import PageSizeSelect from '@/components/select/page_size-select';
import { ErrorList } from '@/libs/responses/errorLib';
import { ErrorTable } from '@/components/table/error.table';
import CreateError from '@/components/pages/error/error.create';

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const params = {
    search: actualSearchQuery || undefined,
    page_size: pageSize,
  };

  const { errors, isLoading, isError, pagination } = ErrorList(
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

  return (
    <>
      <Container className="min-h-screen p-6  ">
        <Heading name="Error Management Page" />

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search title (Press Enter)"
                className="pl-10 pr-8 text-xs rounded-md h-10 bg-white"
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

          <Button
            onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
            className={` text-xs bg-main border-b-2 text-white border-b-main-200 ${
              isCreateDialogOpen ? '  ' : ' hover:bg-main-600 hover:text-white'
            }`}
          >
            {isCreateDialogOpen ? 'Cancel' : 'Create Error'}
          </Button>
        </div>

        {isCreateDialogOpen && (
          <div className="border-2 bg-white border-main   p-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
            <CreateError onSuccess={() => setIsCreateDialogOpen(false)} />
          </div>
        )}
        {!isCreateDialogOpen && (
          <>
            <div className="min-w-0">
              <ErrorTable
                errors={errors}
                isLoading={isLoading}
                isError={isError}
                onRefresh={handleRefresh}
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
