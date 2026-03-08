'use client';

import { Container } from '@/components';
import { useTicketDetail, useUpdateTicket } from '@/hooks/ticket/useTicket';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import {
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { TiketStatus } from '@/types';
import { UserAvatar } from '@/components/design/avatar.design';
import { formatSmartDate } from '@/utils';
import { ChevronLeft } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  closed: 'bg-gray-100 text-gray-800',
};

const Page = () => {
  const params = useParams();
  const ticketId = Array.isArray(params['id'])
    ? params['id'][0]
    : params['id'] || '';
  const { data: ticket, isLoading, isError } = useTicketDetail(ticketId, 0);
  const { mutate: updateTicket, isPending } = useUpdateTicket(ticketId);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleUpdateStatus = () => {
    const payload: any = { status: selectedStatus };
    if (selectedStatus === TiketStatus.Rejected && rejectionReason) {
      payload.rejectionReason = rejectionReason;
    }
    updateTicket(payload);
    setShowUpdateForm(false);
    setRejectionReason('');
  };

  if (isLoading) {
    return (
      <Container className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto p-6">
          <div className="text-center py-12">Loading...</div>
        </div>
      </Container>
    );
  }

  if (isError || !ticket) {
    return (
      <Container className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto p-6">
          <div className="text-center py-12 text-red-600">Ticket not found</div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ticket Detail
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                View and manage ticket information
              </p>
            </div>
          </div>
          <Badge
            className={`px-3 py-1.5 text-sm font-medium ${
              statusColors[ticket.status as keyof typeof statusColors] ?? ''
            }`}
          >
            {ticket.status}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Type Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {ticket.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {ticket.type}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {ticket.content}
                </p>
              </div>
            </div>

            {/* Update Status Card */}
            {showUpdateForm && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Update Ticket Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Status
                    </label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {Object.values(TiketStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedStatus === TiketStatus.Rejected && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        rows={3}
                        placeholder="Please provide a reason for rejection..."
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleUpdateStatus}
                      disabled={isPending || !selectedStatus}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isPending ? 'Updating...' : 'Update Status'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowUpdateForm(false);
                        setSelectedStatus('');
                        setRejectionReason('');
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!showUpdateForm && (
              <Button
                onClick={() => setShowUpdateForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update Status
              </Button>
            )}
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-6">
            {/* Submitted By Card */}
            {ticket.user && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Submitted By
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserAvatar
                      key={ticket.user.id}
                      url={'/imgs/logo_c.jpg'}
                      username={ticket.user.username}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ticket.user.fullName || ticket.user.username}
                    </p>
                    <p className="text-xs text-gray-600">{ticket.user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resolved By Card */}
            {ticket.resolver && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Resolved By
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-green-600">
                      {ticket.resolver.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ticket.resolver.username}
                    </p>
                    <p className="text-xs text-gray-600">
                      {ticket.resolver.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">Created</p>
                    <p className="text-xs text-gray-600">
                      {ticket.createdAt
                        ? formatSmartDate(ticket.createdAt)
                        : ''}
                    </p>
                  </div>
                </div>
                {ticket.resolvedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">
                        Resolved
                      </p>
                      <p className="text-xs text-gray-600">
                        {ticket.resolvedAt
                          ? formatSmartDate(ticket.resolvedAt)
                          : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Reason Card */}
            {ticket.rejectionReason && (
              <div className="bg-red-50 rounded-lg border border-red-200 p-6">
                <h3 className="text-sm font-semibold text-red-900 mb-2">
                  Rejection Reason
                </h3>
                <p className="text-sm text-red-700">{ticket.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Page;
