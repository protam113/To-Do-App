'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui';
import { ReportList } from '@/libs/responses/reportLib';
import { Container } from '@/components/wrappers/container';
import { Heading } from '@/components/design';
import { RefreshButton } from '@/components/button/refresh.button';
import PageSizeSelect from '@/components/select/page_size-select';
import { CustomPagination } from '@/components/design';
import { ErrorSelect } from '@/components/select/error_report.select';
import ReportStatusSelect from '@/components/select/status_report.select';
import ReportSeveritySelect from '@/components/select/severity_report.select';
import { AdminReportListTable } from '@/components/pages/report/admin_report.list';

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
    <Container className="h-full">
      <section className="mt-8 space-y-4">
        <Heading name="Report Page" />

        <div className="md:flex col flex-col-2 md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-4">
              <span className="text-xs text-main font-semibold">Status:</span>
              <ReportStatusSelect handleStatusChange={handleStatusChange} />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-main font-semibold">Severity:</span>
              <ReportSeveritySelect
                handleSeverityChange={handleSeverityChange}
              />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-main font-semibold">Error:</span>
              <ErrorSelect
                value={selectError}
                onValueChange={(errorId) => {
                  setSelectError(errorId === 'all' ? '' : errorId);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <AdminReportListTable
            reports={reports}
            isLoading={isLoading}
            isError={isError}
            refreshKey={handleRefresh}
          />
        </div>

        <CustomPagination
          currentPage={currentPage}
          totalPage={pagination.total_page}
          onPageChange={handlePageChange}
        />
      </section>
    </Container>
  );
}
