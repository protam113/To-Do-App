'use client';

import { Container } from '@/components';
import { useTicketDetail } from '@/hooks/ticket/useTicket';
import { useParams } from 'next/navigation';
import React from 'react';
import { statusColors } from '@/types';
import { Badge } from '@/components/ui';
import { formatSmartDate } from '@/utils';
import { useAuthStore } from '@/store';
import { LoadingSpin } from '@/components/loading/spin';
import NoResultsFound from '@/components/design/no_result.design';

const Page = () => {
  const { userInfo } = useAuthStore();

  const params = useParams();
  const ticketId = Array.isArray(params['id'])
    ? params['id'][0]
    : params['id'] || '';
  const { data: ticket, isLoading, isError } = useTicketDetail(ticketId, 0);
  // const { data: ticket } = useTicketDetail(ticketId);

  if (isLoading) {
    return (
      <Container className=" min-h-screen">
        <LoadingSpin />
      </Container>
    );
  }

  if (isError || !ticket) {
    return (
      <Container className=" min-h-screen">
        <NoResultsFound />
      </Container>
    );
  }

  return (
    <Container className=" min-h-screen">
      <div className="bg-white p-6 space-y-6">
        {/* Header */}
        <div className="grid grid-cols-2 justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl text-main font-bold mb-2">
              Titile: {ticket.title}
            </h1>
            <span className="text-md text-main">Type: {ticket.type}</span>
          </div>
          <div className="flex justify-end items-start">
            <Badge
              className={`px-3 py-1 text-xs font-medium ${
                statusColors[ticket.status as keyof typeof statusColors] ?? ''
              }`}
            >
              {ticket.status}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="border-t pt-4">
          <h3 className="text-sm text-gray-100 font-medium mb-2">
            Description
          </h3>
          <p className="text-md text-main whitespace-pre-wrap">
            {ticket.content}
          </p>
        </div>

        {/* User Info */}
        <div className="border-t pt-4">
          <h3 className="text-sm text-main font-medium mb-2">Submitted By</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {userInfo?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm  text-main font-medium">
                {userInfo?.fullName || userInfo?.username}
              </p>
              <p className="text-xs  text-whtie text-muted-foreground">
                {userInfo?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Resolver Info */}
        {ticket.resolver && (
          <div className="border-t pt-4">
            <h3 className="text-sm text-main  font-medium mb-2">
              Resolved By vas
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">
                  {ticket.resolver.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-main">
                  {ticket.resolver.username}ss
                </p>
                <p className="text-xs text-muted-foreground">
                  {ticket.resolver.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t pt-4 grid text-main grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-main font-medium mb-1">Created At</h3>
            <p className="text-sm text-muted-foreground">
              {ticket.createdAt ? formatSmartDate(ticket.createdAt) : ''}
            </p>
          </div>
          {ticket.resolvedAt && (
            <div>
              <h3 className="text-sm font-medium mb-1">Resolved At</h3>
              <p className="text-sm text-muted-foreground">
                {ticket.resolvedAt ? formatSmartDate(ticket.resolvedAt) : ''}
              </p>
            </div>
          )}
        </div>

        {/* Rejection Reason */}
        {ticket.rejectionReason && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2 text-destructive">
              Rejection Reason
            </h3>
            <p className="text-sm text-muted-foreground">
              {ticket.rejectionReason}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Page;
