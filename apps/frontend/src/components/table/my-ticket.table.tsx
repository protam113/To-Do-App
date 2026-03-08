'use client';

import type React from 'react';
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
  AdminTicketColumns,
  AdminTickTableProps,
  getStatusColors,
  getTypeColor,
} from '@/types';
import NoResultsFound from '../design/no_result.design';
import { formatSmartDate } from '../../utils';
import { Icons } from '../../assets/icons';
import { useRouter } from 'next/navigation';

export const MyTicketTable: React.FC<AdminTickTableProps> = ({
  tickets,
  isLoading,
  isError,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="border">
        <Table>
          <TableHeader className="bg-table-header text-gray-700 font-bold">
            <TableRow>
              {AdminTicketColumns.map((col) => (
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
                  colSpan={AdminTicketColumns.length + 1}
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
                  {AdminTicketColumns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tickets && tickets.length > 0 ? (
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  {AdminTicketColumns.map((col) => {
                    let cellContent: React.ReactNode = '';

                    if (col.key === 'title') {
                      cellContent = <p> {ticket.title}</p>;
                    } else if (col.key === 'createdAt') {
                      cellContent = ticket.createdAt
                        ? formatSmartDate(ticket.createdAt)
                        : '';
                    } else if (col.key === 'resolvedBy') {
                      cellContent = ticket.resolver?.username ? (
                        <div className="flex items-center space-x-3">
                          <div className="flex aspect-square size-8 items-center font-semibold justify-center rounded-full bg-main text-white border">
                            {ticket.resolver?.username
                              ?.split(' ')?.[0]
                              ?.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            {ticket.resolver?.username && (
                              <span className="font-bold">
                                @{ticket.resolver?.username}
                              </span>
                            )}
                            {ticket.resolver?.email && (
                              <span className="text-gray-400">
                                {ticket.resolver?.email}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        'N/A'
                      );
                    } else if (col.key === 'resolvedAt') {
                      cellContent = ticket.resolvedAt
                        ? formatSmartDate(ticket.resolvedAt)
                        : '';
                    } else if (col.key === 'type') {
                      cellContent = (
                        <span
                          className={`px-2 py-1   text-xs font-medium ${getTypeColor(
                            ticket.type
                          )}`}
                        >
                          {ticket.type}
                        </span>
                      );
                    } else if (col.key === 'status') {
                      cellContent = (
                        <span
                          className={`px-2 py-1   text-xs font-medium ${
                            getStatusColors[ticket.status] ||
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      );
                    } else if (col.key === 'action') {
                      cellContent = (
                        <div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                            onClick={() => router.push(`/report/${ticket.id}`)}
                          >
                            <Icons.Eye className="w-4 h-4" />
                          </Button>
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
                <TableCell
                  colSpan={AdminTicketColumns.length + 1}
                  className="text-center text-gray-500"
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
