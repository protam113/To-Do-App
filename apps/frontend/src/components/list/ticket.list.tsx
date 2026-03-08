'use client';

import { Badge, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { LoadingSpin } from '../loading/spin';
import { TicketList } from '../../libs/responses/ticketLib';
import { formatSmartDate } from '../../utils';
import NoResultsFound from '../design/no_result.design';
import { ErrorLoading } from '../loading/error';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function TicketHistory() {
  const router = useRouter();

  const params = { page_size: 8 };

  const { tickets, isLoading, isError } = TicketList(1, params, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ticket History
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">
            Recent ticket activities
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => router.push('/admin/ticket')}
        >
          View All
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">
                Time
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {isError ? (
              <tr>
                <td colSpan={5} className="px-6 py-8">
                  <ErrorLoading />
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <LoadingSpin />
                </td>
              </tr>
            ) : tickets.length > 0 ? (
              tickets.slice(0, 8).map((ticket) => {
                return (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/ticket/${ticket.id}`)}
                  >
                    {/* TYPE */}
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-xs font-medium">
                        {ticket.type}
                      </Badge>
                    </td>

                    {/* TITLE */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 font-medium line-clamp-1">
                        {ticket.title || ticket.content || '—'}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <Badge
                        className={`text-xs font-medium border ${
                          statusColors[
                            ticket.status as keyof typeof statusColors
                          ] ?? 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {ticket.status}
                      </Badge>
                    </td>

                    {/* USER */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {ticket.user?.username || 'System'}
                      </span>
                    </td>

                    {/* TIME */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs text-gray-600">
                        {ticket.createdAt
                          ? formatSmartDate(ticket.createdAt)
                          : '—'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12">
                  <NoResultsFound />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      {tickets.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing {Math.min(tickets.length, 8)} of {tickets.length} tickets
            </span>
            <button
              onClick={() => router.push('/admin/audit-log')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View System Logs →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
