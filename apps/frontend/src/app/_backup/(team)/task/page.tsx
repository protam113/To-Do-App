'use client';

import { Container } from '@/components';
import { Heading } from '@/components/design';
import { MyTaskList } from '@/libs/responses/taskLib';
import { useState } from 'react';
import { CustomPagination } from '@/components/design';
import { RefreshButton } from '@/components/button/refresh.button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import { MyTaskTable } from '@/components/pages/task/my-task.table';
import PageSizeSelect from '@/components/select/page_size-select';

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');

  const taskFilters = {
    search: actualSearchQuery || undefined,
    page_size: 10,
  };

  // TASK
  const {
    tasks,
    isLoading: isTaskLoading,
    isError: isTaskError,
    pagination,
  } = MyTaskList(currentPage, taskFilters, refreshKey);

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

  // Clear search function
  const handleClearSearch = () => {
    setSearchQuery('');
    setActualSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <>
      <Container className="min-h-screen p-6">
        <Heading name="My Task" />

        {/* Task Section */}
        <section className="mt-8 space-y-4">
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
                <PageSizeSelect
                  handlePageSizeChange={handlePageSizeChange}
                  pageSize={pageSize}
                />
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <MyTaskTable
              tasks={tasks}
              isLoading={isTaskLoading}
              isError={isTaskError}
            />
          </div>
          <CustomPagination
            currentPage={currentPage}
            totalPage={pagination.total_page}
            onPageChange={handlePageChange}
          />
        </section>
      </Container>
    </>
  );
}
