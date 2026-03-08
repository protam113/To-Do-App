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
import { CustomPagination, Heading } from '@/components/design';
import { RefreshButton } from '@/components/button/refresh.button';
import { AuditLogList } from '@/libs/responses/audit-logLib';
import { AuditLogTable } from '@/components/table/audit-log.table';
import { AuditType, AuditAction } from '@/types';
import { UserSelect } from '@/components/select/user-select';
import PageSizeSelect from '@/components/select/page_size-select';

const AUDIT_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: AuditType.USER, label: 'User' },
  { value: AuditType.SESSION, label: 'Session' },
  { value: AuditType.TEAM, label: 'Team' },
  { value: AuditType.PROJECT, label: 'Project' },
  { value: AuditType.TASK, label: 'Task' },
  { value: AuditType.TICKET, label: 'Ticket' },
  { value: AuditType.COMMENT, label: 'Comment' },
];

const TYPE_TO_ACTIONS: Record<string, { value: string; label: string }[]> = {
  [AuditType.USER]: [
    { value: AuditAction.USER_CREATED, label: 'User Created' },
    { value: AuditAction.USER_UPDATED, label: 'User Updated' },
    { value: AuditAction.USER_DELETED, label: 'User Deleted' },
    { value: AuditAction.USER_PROMOTED, label: 'User Promoted' },
    { value: AuditAction.USER_BLOCKED, label: 'User Blocked' },
    { value: AuditAction.USER_UNBLOCKED, label: 'User Unblocked' },
    { value: AuditAction.USER_ACTIVATED, label: 'User Activated' },
    { value: AuditAction.USER_LOGIN, label: 'User Login' },
    { value: AuditAction.USER_LOGOUT, label: 'User Logout' },
    { value: AuditAction.USER_PASSWORD_CHANGED, label: 'Password Changed' },
  ],
  [AuditType.SESSION]: [
    { value: AuditAction.SESSION_CREATED, label: 'Session Created' },
    { value: AuditAction.SESSION_REVOKED, label: 'Session Revoked' },
    { value: AuditAction.SESSION_EXPIRED, label: 'Session Expired' },
  ],
  [AuditType.TEAM]: [
    { value: AuditAction.TEAM_CREATED, label: 'Team Created' },
    { value: AuditAction.TEAM_UPDATED, label: 'Team Updated' },
    { value: AuditAction.TEAM_DELETED, label: 'Team Deleted' },
    { value: AuditAction.TEAM_MEMBER_ADDED, label: 'Member Added' },
    { value: AuditAction.TEAM_MEMBER_REMOVED, label: 'Member Removed' },
    { value: AuditAction.TEAM_OWNER_CHANGED, label: 'Owner Changed' },
  ],
  [AuditType.PROJECT]: [
    { value: AuditAction.PROJECT_CREATED, label: 'Project Created' },
    { value: AuditAction.PROJECT_UPDATED, label: 'Project Updated' },
    { value: AuditAction.PROJECT_DELETED, label: 'Project Deleted' },
    { value: AuditAction.PROJECT_MEMBER_ADDED, label: 'Member Added' },
    { value: AuditAction.PROJECT_MEMBER_REMOVED, label: 'Member Removed' },
    { value: AuditAction.PROJECT_MANAGER_CHANGED, label: 'Manager Changed' },
  ],
  [AuditType.TASK]: [
    { value: AuditAction.TASK_CREATED, label: 'Task Created' },
    { value: AuditAction.TASK_UPDATED, label: 'Task Updated' },
    { value: AuditAction.TASK_DELETED, label: 'Task Deleted' },
    { value: AuditAction.TASK_ASSIGNED, label: 'Task Assigned' },
    { value: AuditAction.TASK_UNASSIGNED, label: 'Task Unassigned' },
    { value: AuditAction.TASK_STATUS_CHANGED, label: 'Status Changed' },
    { value: AuditAction.TASK_PRIORITY_CHANGED, label: 'Priority Changed' },
  ],
  [AuditType.TICKET]: [
    { value: AuditAction.TICKET_CREATED, label: 'Ticket Created' },
    { value: AuditAction.TICKET_UPDATED, label: 'Ticket Updated' },
    { value: AuditAction.TICKET_STATUS_CHANGED, label: 'Status Changed' },
  ],
  [AuditType.COMMENT]: [],
};

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0); // State to refresh data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [selectType, setSelectType] = useState('');
  const [selectUserId, setSelectUserId] = useState('');
  const [selectAction, setSelectAction] = useState('');

  const params = {
    search: actualSearchQuery || undefined,
    page_size: pageSize,
    type: selectType,
    userId: selectUserId || undefined,
    action: selectAction || undefined,
  };

  // Get available actions based on selected type
  const availableActions = selectType ? TYPE_TO_ACTIONS[selectType] || [] : [];

  const { audit_logs, isLoading, isError, pagination } = AuditLogList(
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track and monitor all system activities
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Filters</h3>

          {/* Row 1: Search and Refresh */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[280px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title (Press Enter)"
                className="pl-10 pr-8 text-sm h-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
          </div>

          {/* Row 2: All Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Show:
              </span>
              <PageSizeSelect
                handlePageSizeChange={handlePageSizeChange}
                pageSize={pageSize}
              />
            </div>

            <div className="h-6 w-px bg-gray-200"></div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Type:
              </span>
              <Select
                value={selectType || 'all'}
                onValueChange={(value) => {
                  setSelectType(value === 'all' ? '' : value);
                  setSelectAction('');
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px] rounded-md bg-white px-4 h-10 border-gray-200">
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

            {selectType && availableActions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Action:
                </span>
                <Select
                  value={selectAction || 'all'}
                  onValueChange={(value) => {
                    setSelectAction(value === 'all' ? '' : value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px] rounded-md bg-white px-4 h-10 border-gray-200">
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent
                    className="rounded-md bg-white min-w-[180px] max-h-[300px]"
                    align="start"
                  >
                    <SelectItem value="all" className="rounded-md">
                      All Actions
                    </SelectItem>
                    {availableActions.map((action) => (
                      <SelectItem
                        key={action.value}
                        value={action.value}
                        className="rounded-md"
                      >
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                User:
              </span>
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

        {/* Table Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <AuditLogTable
            audit_logs={audit_logs}
            isLoading={isLoading}
            isError={isError}
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
