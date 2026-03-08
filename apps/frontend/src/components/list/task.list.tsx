'use client';

import { Badge, Button } from '@/components/ui';
import { AuditLogList } from '../../libs/responses/audit-logLib';
import { getActionColor, getTypeColor, getActionIcon } from '@/types';
import { useRouter } from 'next/navigation';
import { LoadingSpin } from '../loading/spin';
import { Heading } from '../design/heading.design';
import NoResultsFound from '../design/no_result.design';
import { ErrorLoading } from '../loading/error';

const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString();
};

export default function AuditLogsHistory() {
  const router = useRouter();

  const params = { page_size: 8 };

  const { audit_logs, isLoading, isError } = AuditLogList(1, params, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">
          System History
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-gray-600 hover:text-gray-900"
          onClick={() => router.push('/admmin/audit-log')}
        >
          View All
        </Button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm   overflow-hidden">
          <thead className="bg-table-header">
            <tr className="text-left text-gray-800">
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3 text-right">Time</th>
            </tr>
          </thead>

          <tbody className="bg-row">
            {isError ? (
              <ErrorLoading />
            ) : isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <LoadingSpin />
                </td>
              </tr>
            ) : audit_logs.length > 0 ? (
              audit_logs.slice(0, 8).map((event, idx) => {
                const ActionIcon = getActionIcon(event.action);

                return (
                  <tr
                    key={event.id}
                    className="border-t border-border hover:bg-accent/40 transition-colors"
                  >
                    {/* ACTION */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-full ${getActionColor(
                            event.action
                          )} shrink-0`}
                        >
                          <ActionIcon className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-text-row">
                          {/* {formatActionText(event.action)} */}
                        </span>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="px-4 py-3">
                      <Badge
                        className={`${getTypeColor(
                          event.type
                        )} border-0 text-xs`}
                      >
                        {event.type}
                      </Badge>
                    </td>

                    {/* TARGET */}
                    <td className="px-4 py-3 text-text-row">
                      {event.target || '—'}
                    </td>

                    {/* USER */}
                    <td className="px-4 py-3 text-text-row">
                      {/* {event.byUser.username || '—'} */}
                    </td>

                    {/* TIME */}
                    <td className="px-4 py-3 text-right text-xs text-text-row">
                      {formatDate(event.createdAt)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <NoResultsFound />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-800">Total logs: {audit_logs.length}</span>
          <button className="text-gray-800 hover:underline">System logs</button>
        </div>
      </div>
    </div>
  );
}
