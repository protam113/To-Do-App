'use client';

import React, { useState } from 'react';
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
import { UserSessionProps, UserSessionColumns } from '@/types';
import NoResultsFound from '../design/no_result.design';
import { Arrows } from '../../assets/icons';
import { parseUserAgent } from '../../utils/userAgent';

// Format IP address để hiển thị đẹp hơn
// Chuyển IPv4-mapped IPv6 (::ffff:x.x.x.x) thành IPv4 thuần
const formatIpAddress = (ip: string | null | undefined): string => {
  if (!ip) return 'N/A';

  // Xử lý IPv4-mapped IPv6 address (::ffff:192.168.1.1)
  const ipv4MappedMatch = ip.match(
    /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i
  );
  if (ipv4MappedMatch) {
    return ipv4MappedMatch[1];
  }

  // Xử lý localhost variants
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1 (localhost)';
  }

  return ip;
};

export const UserSessionTable: React.FC<UserSessionProps> = ({
  sessions,
  isLoading,
  isError,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (sessionId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };
  return (
    <>
      <div className="border overflow-hidden">
        <div className="overflow-auto max-h-[600px]">
          <Table className="border-main border relative">
            <TableHeader className="bg-table-header text-gray-700 font-bold">
              <TableRow>
                {UserSessionColumns.map((col) => (
                  <TableHead key={col.key} className={col.className}>
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-row">
              {isError ? (
                <TableRow>
                  <TableCell
                    colSpan={UserSessionColumns.length + 1}
                    className="text-center"
                  >
                    <NoResultsFound />
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-4 rounded" />
                    </TableCell>
                    {UserSessionColumns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : sessions && sessions.length > 0 ? (
                sessions.map((session) => {
                  const isExpanded = expandedRows.has(session.id);
                  return (
                    <React.Fragment key={session.id}>
                      <TableRow>
                        {UserSessionColumns.map((col) => {
                          let cellContent: React.ReactNode = '';

                          if (col.key === 'userId') {
                            cellContent = session.user?.fullName || 'N/A';
                          } else if (col.key === 'ipAddress') {
                            cellContent = formatIpAddress(session.ipAddress);
                          } else if (col.key === 'userAgent') {
                            const ua = session.userAgent || '';
                            const { display, isDebugTool } = parseUserAgent(ua);

                            cellContent = (
                              <span
                                className={`text-sm ${
                                  isDebugTool
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : ''
                                }`}
                                title={ua}
                              >
                                {display}
                              </span>
                            );
                          } else if (col.key === 'isActive') {
                            cellContent = (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  session.isActive
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}
                              >
                                {session.isActive ? 'Active' : 'Inactive'}
                              </span>
                            );
                          } else if (col.key === 'expiresAt') {
                            cellContent = new Date(
                              session.expiresAt
                            ).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                          } else if (col.key === 'createdAt') {
                            cellContent = new Date(
                              session.createdAt
                            ).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                          } else if (col.key === 'action') {
                            cellContent = (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleRow(session.id)}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                              >
                                <Arrows.ArrowDown
                                  className={`w-4 h-4 transition-transform ${
                                    isExpanded ? 'rotate-180' : ''
                                  }`}
                                />
                              </Button>
                            );
                          }

                          return (
                            <TableCell key={col.key} className={col.className}>
                              {cellContent}
                            </TableCell>
                          );
                        })}
                      </TableRow>

                      {/* Expanded Detail Row */}
                      {isExpanded && (
                        <TableRow className="bg-row">
                          <TableCell colSpan={UserSessionColumns.length}>
                            <div className="p-4 space-y-3">
                              <h4 className="font-semibold text-gray-900 text-sm mb-3">
                                Session Details
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-800 ">
                                    Session ID:
                                  </span>
                                  <p className="font-mono text-gray-900 text-xs mt-1 break-all">
                                    {session.id}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800 ">
                                    User ID:
                                  </span>
                                  <p className="font-mono text-gray-900 text-xs mt-1 break-all">
                                    {session.userId}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">
                                    Token:
                                  </span>
                                  <p className="font-mono text-gray-900 text-xs mt-1">
                                    {session.token}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">
                                    Refresh Token:
                                  </span>
                                  <p className="font-mono text-gray-900 text-xs mt-1">
                                    {session.refreshToken}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">
                                    IP Address:
                                  </span>
                                  <p className="mt-1 text-gray-900">
                                    {formatIpAddress(session.ipAddress)}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">
                                    User Agent:
                                  </span>
                                  <p className="mt-1 text-xs text-gray-900 break-all">
                                    {session.userAgent || 'Unknown'}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">
                                    Created At:
                                  </span>
                                  <p className="mt-1 text-gray-900">
                                    {new Date(
                                      session.createdAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">
                                    Updated At:
                                  </span>
                                  <p className="mt-1 text-gray-900">
                                    {new Date(
                                      session.updatedAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">
                                    Expires At:
                                  </span>
                                  <p className="mt-1 text-gray-900">
                                    {new Date(
                                      session.expiresAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">
                                    Status:
                                  </span>
                                  <p className="mt-1">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        session.isActive
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {session.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={UserSessionColumns.length + 1}
                    className="text-center text-gray-500"
                  >
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
