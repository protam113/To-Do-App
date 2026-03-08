'use client';

import type React from 'react';
//UI components

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Skeleton,
  Button,
  TableHead,
  TableHeader,
} from '@/components/ui';
import { ReportTableProps, TeamTaskColumns, ReportSeverity } from '@/types';

import { Plus } from 'lucide-react';
import { Icons } from '@/assets';
import { ErrorLoading } from '../../loading/error';
import NoResultsFound from '../../design/no_result.design';
import { useRouter } from 'next/navigation';
import { ReportSelectStatus } from './report-select-status';
import { truncateHtmlToText } from '@/utils';
import Link from 'next/link';

const getUserAction = (
  users: Array<{
    type: string;
    userId: string;
    user?: { firstName?: string; lastName?: string };
    actionAt: string | Date;
  }>,
  type: string
) => {
  const action = users?.find((u) => u.type === type);
  if (!action) return { name: '-', time: '-' };
  const name = action.user
    ? `${action.user.firstName || ''} ${action.user.lastName || ''}`.trim() ||
      '-'
    : '-';
  const time = action.actionAt
    ? new Date(action.actionAt).toLocaleDateString('vi-VN')
    : '-';
  return { name, time };
};

const severityConfig: Record<
  string,
  { border: string; text: string; label: string }
> = {
  [ReportSeverity.LOW]: {
    border: 'border-green-400',
    text: 'text-green-700',
    label: 'Low',
  },
  [ReportSeverity.MEDIUM]: {
    border: 'border-yellow-400',
    text: 'text-yellow-700',
    label: 'Medium',
  },
  [ReportSeverity.HIGH]: {
    border: 'border-orange-400',
    text: 'text-orange-700',
    label: 'High',
  },
  [ReportSeverity.CRITICAL]: {
    border: 'border-red-400',
    text: 'text-red-700',
    label: 'Critical',
  },
};

export const ReportListTable: React.FC<ReportTableProps> = ({
  reports,
  isLoading,
  isError,
  refreshKey,
}) => {
  const router = useRouter();
  const getSeverityStyle = (severity: string) => {
    return (
      severityConfig[severity] || {
        border: 'border-gray-300',
        text: 'text-gray-700',
        label: severity,
      }
    );
  };

  return (
    <>
      <div className="border rounded-md">
        <div className="overflow-x-auto">
          <Table className="rounded-md">
            <TableHeader className="bg-table-header text-gray-700 font-bold rounded-md">
              <TableRow>
                {TeamTaskColumns.map((col) => (
                  <TableHead key={col.key} className={col.className}>
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-row rounded-md">
              {isError ? (
                <TableRow>
                  <TableCell
                    colSpan={TeamTaskColumns.length + 1}
                    className="text-center"
                  >
                    <ErrorLoading />
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-4 rounded" />
                    </TableCell>
                    {TeamTaskColumns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : reports && reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    {TeamTaskColumns.map((col) => {
                      let cellContent: React.ReactNode = '';
                      if (col.key === 'title') {
                        cellContent = report.title ? (
                          <div className="flex flex-col">
                            {report.title && (
                              <Link
                                href={`/report/${report.id}`}
                                className="font-bold hover:text-secondary hover:underline"
                              >
                                {report.title}
                              </Link>
                            )}
                            {report.description && (
                              <span className="text-gray-400">
                                {truncateHtmlToText(report.description, 200)}
                              </span>
                            )}
                          </div>
                        ) : (
                          ''
                        );
                      } else if (col.key === 'severity') {
                        const severity = getSeverityStyle(report.severity);
                        cellContent = (
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-medium bg-white border-2 ${severity.border} ${severity.text}`}
                            >
                              {severity.label}
                            </span>
                          </div>
                        );
                      } else if (col.key === 'status') {
                        cellContent = (
                          <ReportSelectStatus
                            currentStatus={report.status || 'Unknown'}
                            reportId={report.id}
                            onUpdate={refreshKey}
                          />
                        );
                      } else if (col.key === 'error') {
                        cellContent = (
                          <div className="flex items-center gap-3">
                            {report.errors && report.errors.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {report.errors.map((error: any) => (
                                  <span
                                    key={error.id}
                                    className="px-1.5 py-0.5 text-xs bg-secondary-100 text-gray-600 rounded"
                                  >
                                    {error.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      } else if (col.key === 'author') {
                        const createdBy = getUserAction(
                          report.users,
                          'created_by'
                        );
                        cellContent = (
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              {createdBy.name}
                            </span>
                          </div>
                        );
                      } else if (col.key === 'incidentTime') {
                        const formatIncidentTime = (time?: string | Date) => {
                          if (!time) return '-';
                          const timeStr =
                            typeof time === 'string'
                              ? time
                              : time.toISOString();
                          // "2026-01-20T08:40:00.000Z" -> "2026-01-20 08:40"
                          return timeStr.replace('T', ' ').slice(0, 16);
                        };

                        cellContent = (
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">
                              {formatIncidentTime(report.incidentTime)}
                            </span>
                          </div>
                        );
                      } else if (col.key === 'created') {
                        const createdBy = getUserAction(
                          report.users,
                          'created_by'
                        );
                        cellContent = (
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              {createdBy.time}
                            </span>
                          </div>
                        );
                      } else if (col.key === 'updated') {
                        const updatedBy = getUserAction(
                          report.users,
                          'updated_by'
                        );
                        cellContent = (
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              {updatedBy.time}
                            </span>
                          </div>
                        );
                      } else if (col.key === 'action') {
                        cellContent = (
                          <div className="flex items-center justify-end gap-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                onClick={() =>
                                  router.push(`/report/${report.id}`)
                                }
                              >
                                <Icons.Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <TableCell key={col.key} className={col.className}>
                          {cellContent}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={TeamTaskColumns.length + 1}>
                    <NoResultsFound />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
