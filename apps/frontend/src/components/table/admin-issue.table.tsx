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
  Badge,
} from '@/components/ui';

import { IssueTableProps, EvidenceColumns } from '@/types';

import { useRouter } from 'next/navigation';
import { Icons } from '@/assets';
import { ErrorLoading } from '../loading/error';
import NoResultsFound from '../design/no_result.design';
import { formatSmartDate, truncateText } from '../../utils';
import { CopyLinkButton } from '../button/copy.button';

export const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  isLoading,
  isError,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="border">
        <Table>
          <TableBody className="bg-row">
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={EvidenceColumns.length + 1}
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
                  {EvidenceColumns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : issues && issues.length > 0 ? (
              issues.map((issue) => (
                <TableRow key={issue.id}>
                  {EvidenceColumns.map((col) => {
                    let cellContent: React.ReactNode = '';

                    if (col.key === 'start') {
                      cellContent = (
                        <div className="flex items-center gap-3">
                          <span className="font-light text-xs">
                            {truncateText(issue.id, 10)}
                          </span>
                          <div className="flex gap-4">
                            {issue.name && (
                              <span className="font-medium text-sm">
                                {issue.name}
                              </span>
                            )}
                            <Badge
                              className={`text-xs ${
                                issue.isActive
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }`}
                            >
                              {issue.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      );
                    } else if (col.key === 'end') {
                      cellContent = (
                        <div className="flex items-center justify-end gap-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex flex-col">
                              {issue.createdAt ? (
                                <span className="font-bold">
                                  {formatSmartDate(issue.createdAt)}
                                </span>
                              ) : (
                                <span className="font-bold text-gray-400">
                                  Unknown
                                </span>
                              )}
                              {issue.expiresAt ? (
                                <span className="text-gray-400">
                                  {formatSmartDate(issue.expiresAt)}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  No user assigned
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-center items-center"></div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                              onClick={() =>
                                router.push(`/admin/evidence/${issue.id}`)
                              }
                            >
                              <Icons.Eye className="w-4 h-4" />
                            </Button>
                            <CopyLinkButton url={`/evidence/${issue.id}`} />
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
                <TableCell colSpan={EvidenceColumns.length + 1}>
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
