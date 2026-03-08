'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui';
import { ReportList } from '@/libs';
import { RefreshButton } from '@/components/button/refresh.button';
import PageSizeSelect from '@/components/select/page_size-select';
import { CustomPagination } from '@/components/design';
import { ReportListTable } from '@/components/pages/report/report.list';
import { PushButton } from '@/components/button/push.button';
import { ErrorSelect } from '@/components/select/error_report.select';
import ReportStatusSelect from '@/components/select/status_report.select';
import ReportSeveritySelect from '@/components/select/severity_report.select';
import { QuestionButton } from '@/components/button/question.button';

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [selectError, setSelectError] = useState('');
  const [selectStatus, setSelectStatus] = useState('');
  const [selectSeverity, setSelectSeverity] = useState('');

  const filters = {
    ...(actualSearchQuery && { search: actualSearchQuery }),
    ...(selectError && { error: selectError }),
    ...(selectStatus && { status: selectStatus }),
    ...(selectSeverity && { severity: selectSeverity }),
    page_size: pageSize,
  };

  const { reports, isLoading, isError, pagination } = ReportList(
    currentPage,
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

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleStatusChange = (value: string) => {
    setSelectStatus(value === 'all' ? '' : value);
    setRefreshKey((prev) => prev + 1);
  };

  const handleSeverityChange = (value: string) => {
    setSelectSeverity(value === 'all' ? '' : value);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Report Page</h1>
          </div>
          <div className="flex items-center gap-3">
            <QuestionButton description="View and manage all reports in the system. Filter by status, severity, or error. Search by title and click on a report to see details." />
            <PushButton label="Create Report" href="/report/create-report" />
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          {/* Row 1: Search and Refresh */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search title (Press Enter)"
                className="pl-10 pr-8 text-sm h-10 bg-white border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <RefreshButton onClick={handleRefresh} />
            <PushButton label="Show" href="#" />
          </div>

          {/* Row 2: All Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <PageSizeSelect
              handlePageSizeChange={handlePageSizeChange}
              pageSize={pageSize}
            />

            <div className="h-6 w-px bg-gray-300"></div>

            <ReportStatusSelect handleStatusChange={handleStatusChange} />

            <div className="h-6 w-px bg-gray-300"></div>

            <ReportSeveritySelect handleSeverityChange={handleSeverityChange} />

            <div className="h-6 w-px bg-gray-300"></div>

            <ErrorSelect
              value={selectError}
              onValueChange={(errorId) => {
                setSelectError(errorId === 'all' ? '' : errorId);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <ReportListTable
            reports={reports}
            isLoading={isLoading}
            isError={isError}
            refreshKey={handleRefresh}
          />
        </div>

        {/* Pagination */}
        {pagination.total_page > 1 && (
          <div className="flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              totalPage={pagination.total_page}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
