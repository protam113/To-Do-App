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
import { TicketList } from '@/libs/responses/ticketLib';
import { AdminTicketTable } from '@/components/table/admin-ticket.tablet';
import { TicketType, TiketStatus } from '@/types';
import { UserSelect } from '@/components/select/user-select';
import { Heading } from '@/components/design';
import PageSizeSelect from '@/components/select/page_size-select';

const AUDIT_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: TicketType.AUTH, label: 'Auth' },
  { value: TicketType.USER, label: 'User' },
  { value: TicketType.TEAM, label: 'Team' },
  { value: TicketType.PROJECT, label: 'Project' },
  { value: TicketType.TASK, label: 'Task' },
  { value: TicketType.SUBTASK, label: 'Subtask' },
  { value: TicketType.COMMENT, label: 'Comment' },
  { value: TicketType.TAG, label: 'Tag' },
  { value: TicketType.PRIORITY, label: 'Priority' },
  { value: TicketType.SCHEDULE, label: 'Schedule' },
  { value: TicketType.NOTIFICATION, label: 'Notification' },
  { value: TicketType.SETTINGS, label: 'Settings' },
];

const AUDIT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: TiketStatus.Approved, label: 'Approved' },
  { value: TiketStatus.Closed, label: 'Closed' },
  { value: TiketStatus.InProgress, label: 'InProgress' },
  { value: TiketStatus.Pending, label: 'Pending' },
  { value: TiketStatus.Rejected, label: 'Rejected' },
  { value: TiketStatus.Resolved, label: 'resolved' },
];

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [selectType, setSelectType] = useState('');
  const [selectStatus, setSelectStatus] = useState('');
  const [selectUserId, setSelectUserId] = useState('');

  const params = {
    search: actualSearchQuery || undefined,
    page_size: pageSize,
    type: selectType || undefined,
    status: selectStatus || undefined,
    userId: selectUserId || undefined,
  };

  const { tickets, isLoading, isError, pagination } = TicketList(
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

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setRefreshKey((prev) => prev + 1);
  };

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
    <>
      <Container className="min-h-screen">
        {/* <StatisOverview /> */}
        <Heading name="Ticket List" />
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
              <span className="text-xs text-main font-semibold">Type:</span>
              <Select
                onValueChange={(value) => {
                  setSelectType(value === 'all' ? '' : value);
                  setCurrentPage(1);
                }}
                defaultValue="all"
              >
                <SelectTrigger className="w-[140px] rounded-md bg-white px-4">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent
                  className="rounded-md bg-white min-w-[140px]"
                  align="start"
                >
                  {AUDIT_TYPE_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="rounded-md"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-main font-semibold">Status:</span>
              <Select
                onValueChange={(value) => {
                  setSelectStatus(value === 'all' ? '' : value);
                  setCurrentPage(1);
                }}
                defaultValue="all"
              >
                <SelectTrigger className="w-[140px] rounded-md bg-white px-4">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent
                  className="rounded-md bg-white min-w-[140px]"
                  align="start"
                >
                  {AUDIT_STATUS_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="rounded-md"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-main font-semibold">User:</span>
              <UserSelect
                value={selectUserId || 'all'}
                onValueChange={(value) => {
                  setSelectUserId(value === 'all' ? '' : value);
                  setCurrentPage(1);
                }}
                placeholder="All Users"
              />
            </div>
          </div>
        </div>
        <div className=" min-w-0">
          <AdminTicketTable
            tickets={tickets}
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
      </Container>
    </>
  );
}
