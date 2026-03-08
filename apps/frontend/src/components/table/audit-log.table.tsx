'use client';

import type React from 'react';
import { useState } from 'react';
//UI components

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Button,
} from '@/components/ui';

// import {CustomImage} from '../design/image.component';
import {
  AuditLogsColumns,
  AuditLogTableProps,
  getActionColor,
  getTypeColor,
} from '@/types';
import NoResultsFound from '../design/no_result.design';
import { Icons } from '../../assets/icons';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  audit_logs,
  isLoading,
  isError,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  return (
    <>
      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow className="hover:bg-gray-50">
              {AuditLogsColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`${col.className} text-xs font-semibold text-gray-700 uppercase tracking-wider`}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={AuditLogsColumns.length}
                  className="text-center py-12"
                >
                  <NoResultsFound />
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  {AuditLogsColumns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : audit_logs && audit_logs.length > 0 ? (
              audit_logs.flatMap((audit_log) => {
                const isExpanded = expandedRows.has(audit_log.id);
                return [
                  <TableRow
                    key={audit_log.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {AuditLogsColumns.map((col) => {
                      let cellContent: React.ReactNode = '';

                      if (col.key === 'id') {
                        cellContent = (
                          <span className="text-sm font-mono text-gray-600">
                            {audit_log.id.substring(0, 8)}...
                          </span>
                        );
                      } else if (col.key === 'type') {
                        cellContent = (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              audit_log.type
                            )}`}
                          >
                            {audit_log.type}
                          </span>
                        );
                      } else if (col.key === 'action') {
                        cellContent = (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getActionColor(
                              audit_log.action
                            )}`}
                          >
                            {audit_log.action}
                          </span>
                        );
                      } else if (col.key === 'byUser') {
                        cellContent =
                          audit_log.byUser && audit_log.byUser.username ? (
                            <div className="flex items-center gap-3">
                              <div className="flex aspect-square size-9 items-center font-semibold justify-center rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                                {audit_log.byUser.username
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">
                                  @{audit_log.byUser.username}
                                </span>
                                {audit_log.byUser.email && (
                                  <span className="text-xs text-gray-500">
                                    {audit_log.byUser.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              System
                            </span>
                          );
                      } else if (col.key === 'target') {
                        cellContent = audit_log.target ? (
                          <span className="text-sm text-blue-600 font-medium">
                            {audit_log.target}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        );
                      } else if (col.key === 'setting') {
                        cellContent = (
                          <div className="flex justify-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleRow(audit_log.id)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        );
                      }

                      return (
                        <TableCell
                          key={col.key}
                          className={`${col.className} text-sm`}
                        >
                          {cellContent}
                        </TableCell>
                      );
                    })}
                  </TableRow>,
                  isExpanded && (
                    <TableRow key={`${audit_log.id}-details`}>
                      <TableCell
                        colSpan={AuditLogsColumns.length}
                        className="bg-gray-50 p-6 border-t border-gray-100"
                      >
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Basic Info */}
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                  Request Information
                                </h4>
                                <div className="space-y-2.5">
                                  <div className="flex items-start">
                                    <span className="text-xs font-medium text-gray-500 w-24 flex-shrink-0">
                                      IP Address:
                                    </span>
                                    <span className="text-xs text-gray-900 font-mono">
                                      {audit_log.ip || '-'}
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-xs font-medium text-gray-500 w-24 flex-shrink-0">
                                      Created At:
                                    </span>
                                    <span className="text-xs text-gray-900">
                                      {new Date(
                                        audit_log.createdAt
                                      ).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-xs font-medium text-gray-500 w-24 flex-shrink-0">
                                      User Agent:
                                    </span>
                                    <span className="text-xs text-gray-900 break-all">
                                      {audit_log.userAgent || '-'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Column - Changes */}
                            <div className="space-y-4">
                              {audit_log.before && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    Before
                                  </h4>
                                  <pre className="bg-gray-900 p-3 rounded-md text-xs text-green-400 overflow-auto max-h-40 font-mono">
                                    {JSON.stringify(audit_log.before, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {audit_log.after && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    After
                                  </h4>
                                  <pre className="bg-gray-900 p-3 rounded-md text-xs text-blue-400 overflow-auto max-h-40 font-mono">
                                    {JSON.stringify(audit_log.after, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Metadata - Full Width */}
                          {audit_log.metadata && (
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Metadata
                              </h4>
                              <pre className="bg-gray-900 p-3 rounded-md text-xs text-purple-400 overflow-auto max-h-40 font-mono">
                                {JSON.stringify(audit_log.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                ].filter(Boolean);
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={AuditLogsColumns.length}
                  className="text-center py-12"
                >
                  <NoResultsFound />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
