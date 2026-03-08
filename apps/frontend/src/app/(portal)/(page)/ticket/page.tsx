'use client';

import type React from 'react';
import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import { Container } from '@/components';
import { CustomPagination } from '@/components/design';
import { RefreshButton } from '@/components/button/refresh.button';

import { MyTicketList } from '@/libs/responses/ticketLib';
import { MyTicketTable } from '@/components/table/my-ticket.table';
import { Heading } from '@/components/design';
import AuthTicketForm from '@/components/form/auth-report.form';
import PageSizeSelect from '@/components/select/page_size-select';

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');

  const params = {
    search: actualSearchQuery || undefined,
    page_size: pageSize,
  };

  const { tickets, isLoading, isError, pagination } = MyTicketList(
    currentPage,
    params,
    refreshKey
  );
  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // State  the form

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.total_page) {
      setCurrentPage(page);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage support tickets
          </p>
        </div>

        {/* Create Ticket Form */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Create New Ticket
          </h3>
          <AuthTicketForm onSuccess={handleRefresh} />
        </div>

        {/* Tickets History */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900">
            Tickets History
          </h3>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search title (Press Enter)"
                  className="pl-10 pr-8 text-sm h-10 bg-white border-gray-200"
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <PageSizeSelect
                  handlePageSizeChange={handlePageSizeChange}
                  pageSize={pageSize}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <MyTicketTable
              tickets={tickets}
              isLoading={isLoading}
              isError={isError}
            />
          </div>

          {/* Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPage={pagination.total_page}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
