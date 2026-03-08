'use client';

import React, { useState } from 'react';
import {
  ExternalLink,
  Settings,
  Search,
  RefreshCw,
  Layers,
  BarChart3,
  Activity,
  Globe,
  LockKeyhole,
  EyeOff,
  Eye,
  LockKeyholeOpen,
  Copy,
  Check,
} from 'lucide-react';
import { MonitorType, MonitorAuthConfigResponse } from '@/types';
import { MonitorList } from '@/libs';
import { CustomPagination } from '../../design/pagination.design';
import PageSizeSelect from '../../select/page_size-select';
import { MonitorTypeConfig, type MonitorTypeFilter } from './matric-type';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '../../ui/alert-dialog';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import {
  useDeleteMatric,
  useGenerateCode,
  useGetMonitorConfig,
  useToggleMonitorActive,
} from '@/hooks';
import { Icons } from '@/assets';
import { toast } from 'sonner';
import { AccessCode } from '@/types';

const menuItems: {
  id: MonitorTypeFilter;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: 'all', label: 'SuccessRate', icon: Activity },
  { id: MonitorType.Custom, label: 'Throughput', icon: BarChart3 },
  { id: MonitorType.Prometheus, label: 'Latency', icon: Globe },
];

export const MetricsTab = () => {
  const { userInfo } = useAuthStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [typeFilter, setTypeFilter] = useState<MonitorTypeFilter>('all');
  const [serverFilter, setServerFilter] = useState('all');
  const { mutate: activeMonitor, isPending } = useToggleMonitorActive();

  // Access code popup state
  const [accessCodeData, setAccessCodeData] = useState<AccessCode | null>(null);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // Enter code popup state
  const [isEnterCodeDialogOpen, setIsEnterCodeDialogOpen] = useState(false);
  const [enterCodeValue, setEnterCodeValue] = useState('');
  const [selectedMonitorId, setSelectedMonitorId] = useState<string | null>(
    null
  );

  // Config result popup state
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [monitorConfig, setMonitorConfig] =
    useState<MonitorAuthConfigResponse | null>(null);

  // Delete confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [monitorToDelete, setMonitorToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const router = useRouter();
  const filters = {
    ...(actualSearchQuery && { search: actualSearchQuery }),
    ...(typeFilter !== 'all' && { type: typeFilter }),
    page_size: pageSize,
  };

  const { monitors, isLoading, isError, pagination } = MonitorList(
    currentPage,
    filters,
    refreshKey
  );
  const { mutate: generateCode, isPending: isGenerating } = useGenerateCode();
  const { mutate: deletMatrix, isPending: isDeleting } = useDeleteMatric();

  const { mutate: getMonitorConfig, isPending: isLoadingConfig } =
    useGetMonitorConfig();

  const handleOpenEnterCodeDialog = (monitorId: string) => {
    setSelectedMonitorId(monitorId);
    setEnterCodeValue('');
    setIsEnterCodeDialogOpen(true);
  };

  const handleSubmitCode = () => {
    if (!selectedMonitorId || !enterCodeValue.trim()) {
      toast.error('Please enter access code');
      return;
    }

    getMonitorConfig(
      { monitorId: selectedMonitorId, accessCode: enterCodeValue.trim() },
      {
        onSuccess: (response) => {
          setMonitorConfig(response);
          setIsEnterCodeDialogOpen(false);
          setIsConfigDialogOpen(true);
        },
        onError: (error: any) => {
          const status = error?.response?.status;
          let message = 'Failed to verify access code';

          if (status === 401) {
            message =
              'Invalid or expired access code. Please check and try again.';
          } else if (status === 403) {
            message =
              'Access denied. This code does not have permission to view this monitor.';
          } else if (status === 404) {
            message = 'Monitor not found.';
          }

          toast.error(message);
        },
      }
    );
  };

  const handleGenerateCode = (monitorId: string) => {
    setDropdownOpen(null); // Close dropdown first
    generateCode(
      { monitorId },
      {
        onSuccess: (response) => {
          console.log(response);
          // response is already the data: { accessCode, monitorId, expiresAt, ttlSeconds }
          setAccessCodeData(response);
          setTimeout(() => {
            setIsCodeDialogOpen(true);
          }, 100);
          setCopied(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to generate access code');
        },
      }
    );
  };
  const handleCopyCode = () => {
    if (accessCodeData?.accessCode) {
      navigator.clipboard.writeText(accessCodeData.accessCode);
      setCopied(true);
      toast.success('Access code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenDeleteDialog = (monitor: { id: string; title: string }) => {
    setDropdownOpen(null);
    setMonitorToDelete(monitor);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!monitorToDelete) return;

    deletMatrix(
      { matricId: monitorToDelete.id },
      {
        onSuccess: () => {
          toast.success('Monitor deleted successfully');
          setIsDeleteDialogOpen(false);
          setMonitorToDelete(null);
          handleRefresh();
        },
        onError: (error: any) => {
          const status = error?.response?.status;
          let message = 'Failed to delete monitor';

          if (status === 403) {
            message = 'You do not have permission to delete this monitor.';
          } else if (status === 404) {
            message = 'Monitor not found.';
          }

          toast.error(message);
        },
      }
    );
  };

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

  const handleTypeChange = (type: MonitorTypeFilter) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-48 shrink-0 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = typeFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTypeChange(item.id)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right Content */}
      <div className="flex-1 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => router.push('/admin/health/add-matric')}
            >
              Add metric
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Actions
                  <Icons.ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-white">
                <DropdownMenuItem onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <button className="p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-md transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Filters and Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={serverFilter} onValueChange={setServerFilter}>
              <SelectTrigger className="w-[180px] rounded-md bg-white border-gray-300">
                <SelectValue placeholder="All Server name" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Server name</SelectItem>
                <SelectItem value="prod-api">prod-api</SelectItem>
                <SelectItem value="staging-api">staging-api</SelectItem>
                <SelectItem value="dev-api">dev-api</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by alias name"
                className="border border-gray-300 bg-white rounded-md py-2 pl-9 pr-10 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
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
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-3">
            <CustomPagination
              currentPage={currentPage}
              totalPage={pagination.total_page}
              onPageChange={handlePageChange}
            />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <PageSizeSelect
                handlePageSizeChange={handlePageSizeChange}
                pageSize={pageSize}
              />
              <span>/ page</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Refresh Interval
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-red-500"
                  >
                    Error loading data
                  </td>
                </tr>
              ) : monitors.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No monitors found
                  </td>
                </tr>
              ) : (
                monitors.map((monitor) => {
                  const typeConfig =
                    MonitorTypeConfig[monitor.type as MonitorTypeFilter] ||
                    MonitorTypeConfig.all;
                  return (
                    <tr key={monitor.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {monitor.isActive ? monitor.title : '*****'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {monitor.isActive ? (
                          <a
                            href={monitor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                          >
                            {monitor.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          '*****'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {monitor.isActive ? (
                          <Badge
                            variant="default"
                            className={`${typeConfig.color} text-white`}
                          >
                            {typeConfig.label}
                          </Badge>
                        ) : (
                          '*****'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {monitor.isActive
                          ? `${monitor.refreshInterval}s`
                          : '*****'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <Badge
                          variant={monitor.isActive ? 'default' : 'default'}
                          className={
                            monitor.isActive ? 'bg-green-500' : 'bg-gray-500'
                          }
                        >
                          {monitor.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap flex px-6 py-4 text-sm text-gray-500">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          onClick={() => handleOpenEnterCodeDialog(monitor.id)}
                        >
                          <LockKeyhole className="w-4 h-4" />
                        </Button>
                        {['admin'].includes(userInfo?.role || '') && (
                          <DropdownMenu
                            open={dropdownOpen === monitor.id}
                            onOpenChange={(open) =>
                              setDropdownOpen(open ? monitor.id : null)
                            }
                          >
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="flex items-center gap-1 text-sm hover:text-gray-400"
                              >
                                <Icons.EllipsisVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 bg-white"
                            >
                              <DropdownMenuItem
                                disabled={isPending}
                                onClick={() => {
                                  const action = monitor.isActive
                                    ? 'disable'
                                    : 'enable';
                                  const confirmed = window.confirm(
                                    `Do you want to ${action} this monitor "${monitor.title}"?`
                                  );
                                  if (confirmed) {
                                    activeMonitor(
                                      { monitorId: monitor.id },
                                      {
                                        onSuccess: () => {
                                          handleRefresh();
                                        },
                                      }
                                    );
                                  }
                                }}
                                className="text-blue-600"
                              >
                                {monitor.isActive ? (
                                  <Eye className="w-4 h-4 mr-2" />
                                ) : (
                                  <EyeOff className="w-4 h-4 mr-2" />
                                )}
                                {monitor.isActive ? 'Active' : 'Inactive'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={isGenerating}
                                onClick={() => handleGenerateCode(monitor.id)}
                              >
                                <LockKeyholeOpen className="w-4 h-4 mr-2" />
                                {isGenerating ? 'Generating...' : 'Public'}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                variant="destructive"
                                disabled={isDeleting}
                                onClick={() =>
                                  handleOpenDeleteDialog({
                                    id: monitor.id,
                                    title: monitor.title,
                                  })
                                }
                              >
                                <Icons.Trash className="w-4 h-4 mr-2" />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Access Code Dialog */}
      <AlertDialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
        <AlertDialogContent className="sm:max-w-md bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Access Code Generated</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Access Code
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-3 bg-gray-100 rounded-md text-lg font-mono tracking-widest text-center">
                  {accessCodeData?.accessCode}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Monitor ID
              </label>
              <p className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded">
                {accessCodeData?.monitorId}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Expires At
              </label>
              <p className="text-sm text-gray-600">
                {accessCodeData?.expiresAt
                  ? new Date(accessCodeData.expiresAt).toLocaleString()
                  : '-'}
              </p>
            </div>

            <div className="pt-2 text-xs text-gray-500">
              This code will expire in 30 minutes. Share it with users who need
              access to this monitor&apos;s configuration.
            </div>

            <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enter Access Code Dialog */}
      <AlertDialog
        open={isEnterCodeDialogOpen}
        onOpenChange={setIsEnterCodeDialogOpen}
      >
        <AlertDialogContent className="sm:max-w-md bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Access Code</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Access Code
              </label>
              <Input
                placeholder="Enter 6-character code"
                value={enterCodeValue}
                onChange={(e) =>
                  setEnterCodeValue(e.target.value.toUpperCase())
                }
                maxLength={6}
                className="text-center text-lg font-mono tracking-widest"
              />
            </div>
            <div className="flex gap-2">
              <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
              <Button
                className="flex-1"
                onClick={handleSubmitCode}
                disabled={isLoadingConfig || enterCodeValue.length !== 6}
              >
                {isLoadingConfig ? 'Loading...' : 'Submit'}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Monitor Config Dialog */}
      <AlertDialog
        open={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
      >
        <AlertDialogContent className="sm:max-w-lg bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Monitor Configuration</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Title
                </label>
                <p className="text-sm text-gray-900">{monitorConfig?.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Type
                </label>
                <p className="text-sm text-gray-900">{monitorConfig?.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">URL</label>
                <p className="text-sm text-gray-900 break-all">
                  {monitorConfig?.url}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Refresh Interval
                </label>
                <p className="text-sm text-gray-900">
                  {monitorConfig?.refreshInterval}s
                </p>
              </div>
            </div>

            {monitorConfig?.authConfig && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Auth Configuration
                </h4>
                <div className="space-y-2 bg-gray-50 p-3 rounded">
                  {monitorConfig.authConfig.username && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Username:</span>
                      <span className="text-sm font-mono">
                        {monitorConfig.authConfig.username}
                      </span>
                    </div>
                  )}
                  {monitorConfig.authConfig.password && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Password:</span>
                      <span className="text-sm font-mono">
                        {monitorConfig.authConfig.password}
                      </span>
                    </div>
                  )}
                  {monitorConfig.authConfig.token && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Token:</span>
                      <span className="text-sm font-mono break-all">
                        {monitorConfig.authConfig.token}
                      </span>
                    </div>
                  )}
                  {monitorConfig.authConfig.apiKey && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">API Key:</span>
                      <span className="text-sm font-mono break-all">
                        {monitorConfig.authConfig.apiKey}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="sm:max-w-md bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Monitor</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the monitor{' '}
              <span className="font-semibold">
                &quot;{monitorToDelete?.title}&quot;
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
