'use client';

import { LogRow } from './log-row';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ListFilter,
  Maximize2,
  MoreHorizontal,
  Search,
  X,
} from 'lucide-react';
import { LogList } from '@/libs/responses/logsLib';
import { useState } from 'react';
import type { LogResponse } from '@/types/types/audit-log/audit.type';
import { ChartSection } from './chart-section';

export function LogExplorer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [service, setService] = useState('');
  const [level, setLevel] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filters = {
    ...(actualSearchQuery && { search: actualSearchQuery }),
    ...(service && service !== 'all' && { service }),
    ...(level && level !== 'all' && { level }),
    ...(fromDate && { from: fromDate }),
    ...(toDate && { to: toDate }),
    page_size: pageSize,
  };

  const { logs, isLoading, isError, pagination } = LogList(
    currentPage,
    filters,
    refreshKey
  );

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

  const handleFilterChange = () => {
    setCurrentPage(1);
    setRefreshKey((prev) => prev + 1);
  };

  const transformLog = (log: LogResponse, index: number) => ({
    id: String(index),
    timestamp: new Date(log.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    duration: log.duration,
    level: log.level as 'info' | 'warn' | 'error' | 'debug',
    message: log.message,
    method: log.method,
    service: log.service,
    statusCode: log.statusCode,
    traceId: log.traceId,
    type: log.type,
    url: log.url,
    _id: '',
    _index: '',
    _score: null,
  });

  return (
    <div className="flex flex-col h-screen bg-background border rounded-lg overflow-hidden">
      <ChartSection />

      {/* Filter Section */}
      <div className="px-4 py-3 border-b bg-muted/20 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search logs (Enter)"
              className="pl-10 pr-8 text-xs h-8 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Service Filter */}
          <Select
            value={service}
            onValueChange={(v) => {
              setService(v);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="All Services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="api-gateway">api-gateway</SelectItem>
              <SelectItem value="auth-service">auth-service</SelectItem>
            </SelectContent>
          </Select>

          {/* Level Filter */}
          <Select
            value={level}
            onValueChange={(v) => {
              setLevel(v);
              handleFilterChange();
            }}
          >
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Warn</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>

          {/* From Date */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">From:</span>
            <Input
              type="datetime-local"
              className="w-[180px] h-8 text-xs bg-white"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                handleFilterChange();
              }}
            />
          </div>

          {/* To Date */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">To:</span>
            <Input
              type="datetime-local"
              className="w-[180px] h-8 text-xs bg-white"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                handleFilterChange();
              }}
            />
          </div>

          {/* Page Size */}
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[80px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-2 flex items-center justify-between border-b bg-muted/30">
          <span className="text-sm font-medium">
            {pagination.total} logs found
          </span>
        </div>

        <div className="px-4 py-2 border-b flex items-center justify-between text-xs text-muted-foreground bg-background">
          <div className="flex items-center gap-2">
            <ListFilter className="h-3 w-3" />
            <span>1 field sorted</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <LayoutGrid className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-[32px_32px_220px_1fr] border-b bg-muted/20 py-1 px-0 text-xs font-semibold">
          <div />
          <div className="flex justify-center">
            <Checkbox className="h-3 w-3" disabled />
          </div>
          <div className="flex items-center gap-1 pl-2">
            <ChevronRight className="h-3 w-3 rotate-90" />
            <span>@timestamp</span>
            <MoreHorizontal className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-1 px-4">
            <ChevronRight className="h-3 w-3" />
            <span>Document</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-background">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center p-12 text-red-500">
              Error loading logs
            </div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground">
              No logs found
            </div>
          ) : (
            logs.map((log: LogResponse, index: number) => (
              <LogRow key={index} log={transformLog(log, index)} />
            ))
          )}
        </div>

        <div className="p-2 border-t flex items-center justify-between text-xs bg-muted/10">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rows per page:</span>
            <span className="font-medium">{pageSize}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {Array.from(
                { length: Math.min(pagination.total_page, 5) },
                (_, i) => i + 1
              ).map((page) => (
                <span
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-1 cursor-pointer ${
                    currentPage === page
                      ? 'text-primary font-bold border-b-2 border-primary'
                      : 'hover:text-primary'
                  }`}
                >
                  {page}
                </span>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={currentPage === pagination.total_page}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Checkbox({
  className,
  disabled,
}: {
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`border rounded border-muted-foreground/50 ${className} ${
        disabled ? 'opacity-50' : ''
      }`}
    />
  );
}
