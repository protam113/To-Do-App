'use client';

import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { LoadingSpin } from '../loading/spin';
import { Heading } from '../design/heading.design';
import NoResultsFound from '../design/no_result.design';
import { ErrorLoading } from '../loading/error';
import { ReportList } from '@/libs';
import { ReportStatus, UserActionType } from '@/types';

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

const getStatusColor = (status: ReportStatus): string => {
  switch (status) {
    case ReportStatus.OPEN:
      return 'bg-yellow-500';
    case ReportStatus.PROCESS:
      return 'bg-blue-500';
    case ReportStatus.RESOLVE:
      return 'bg-green-500';
    case ReportStatus.CANCELED:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || 'UN';
};

export default function RecentReportList({ href }: { href?: string }) {
  const router = useRouter();
  const params = { page_size: 6 };
  const { reports, isLoading, isError, pagination } = ReportList(1, params, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <Heading name="Recent Reports" />
        <Button
          variant="ghost"
          className="rounded-md bg-white text-gray-800 hover:text-black"
          onClick={() => router.push(`${href}/report`)}
        >
          View All
        </Button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {isError ? (
          <ErrorLoading />
        ) : isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpin />
          </div>
        ) : reports.length > 0 ? (
          reports.slice(0, 6).map((report) => {
            const creator = report.users?.find(
              (u) => u.type === UserActionType.CREATED_BY
            )?.user;
            const initials = getInitials(creator?.firstName, creator?.lastName);
            const userName = creator
              ? `${creator.firstName} ${creator.lastName}`.trim()
              : 'Unknown';

            return (
              <div
                key={report.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
                onClick={() => router.push(`/report/${report.id}`)}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-main flex items-center justify-center text-white font-semibold text-sm">
                    {initials}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      by {userName} • {formatDate(report.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Status dot */}
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    report.status
                  )}`}
                />
              </div>
            );
          })
        ) : (
          <NoResultsFound />
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Total: {pagination.total} reports
          </span>
        </div>
      </div>
    </div>
  );
}
