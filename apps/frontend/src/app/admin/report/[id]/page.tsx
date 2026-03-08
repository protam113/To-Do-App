'use client';

import { useParams } from 'next/navigation';
import { Container } from '@/components';
import { formatSmartDate } from '@/utils';
import { Badge } from '@/components/ui';
import { Paperclip, AlertCircle, FileText } from 'lucide-react';
import { Heading } from '@/components/design';
import { LoadingSpin, ErrorLoading } from '@/components/loading';

import NoResultsFound from '@/components/design/no_result.design';
import { useReportDetail } from '@/hooks/report/useReport';
import { BackButton } from '@/components/button/back.button';

const severityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-800 h-8',
  medium: 'bg-yellow-100 text-yellow-800 h-8',
  high: 'bg-orange-100 text-orange-800 h-8',
  critical: 'bg-red-100 text-red-800 h-8',
};

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800 h-8',
  in_progress: 'bg-purple-100 text-purple-800 h-8',
  resolved: 'bg-green-100 text-green-800 h-8',
  canceled: 'bg-gray-100 text-gray-800 h-8',
};

const Page = () => {
  const params = useParams();
  const id = Array.isArray(params['id'])
    ? params['id'][0]
    : (params['id'] as string) || '';

  const { data: report, isLoading, isError, error } = useReportDetail(id, 0);

  if (isLoading)
    return (
      <Container className="min-h-screen justify-center content-center">
        <LoadingSpin />
      </Container>
    );

  if (isError) {
    const errorCode = (error as any)?.response?.data?.code;
    if (errorCode === 5001) {
      return (
        <Container className="min-h-screen justify-center content-center">
          <NoResultsFound />
        </Container>
      );
    }
    return <ErrorLoading />;
  }

  if (!report)
    return (
      <Container className="min-h-screen justify-center content-center">
        <NoResultsFound />
      </Container>
    );

  const createdByUser = report.users?.find((u) => u.type === 'created_by');
  const updatedByUser = report.users?.find((u) => u.type === 'updated_by');

  return (
    <div className="bg-white">
      <div className="p-8 h-[calc(100vh-100px)] flex flex-col">
        {/* Header */}
        <div className="mb-4 shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <BackButton href="/admin/report" />
              <Heading name={report.title} />
            </div>

            <div className="flex items-center gap-3">
              <Badge className={severityColors[report.severity] || ''}>
                {report.severity}
              </Badge>
              <Badge className={statusColors[report.status] || ''}>
                {report.status?.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8 flex-1 min-h-0 overflow-hidden">
          {/* Left - Info & Attachments */}
          <div className="w-1/3 overflow-y-auto pr-4 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              {createdByUser && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Created By
                  </label>
                  <p className="text-gray-900">
                    {createdByUser.user?.firstName}{' '}
                    {createdByUser.user?.lastName}
                    <span className="text-gray-500 text-sm ml-1">
                      @{createdByUser.user?.username}
                    </span>
                  </p>
                  <p className="text-gray-500 text-xs">
                    {createdByUser.actionAt
                      ? formatSmartDate(createdByUser.actionAt as string)
                      : '-'}
                  </p>
                </div>
              )}

              {(updatedByUser && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Created By
                  </label>
                  <p className="text-gray-900">
                    {updatedByUser.user?.firstName}{' '}
                    {updatedByUser.user?.lastName}
                    <span className="text-gray-500 text-sm ml-1">
                      @{updatedByUser.user?.username}
                    </span>
                  </p>
                  <p className="text-gray-500 text-xs">
                    {updatedByUser.actionAt
                      ? formatSmartDate(updatedByUser.actionAt as string)
                      : '-'}
                  </p>
                </div>
              )) ||
                ''}
            </div>

            {/* Related Errors */}
            {report.errors && report.errors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <AlertCircle className="inline h-4 w-4 mr-1" />
                  Related Errors
                </label>
                <div className="space-y-2">
                  {report.errors.map((err) => (
                    <div
                      key={err.id}
                      className="p-2 bg-red-50 border border-red-200 rounded text-sm"
                    >
                      {err.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Paperclip className="inline h-4 w-4 mr-1" />
                Attachments
              </label>
              {report.attachments && report.attachments.length > 0 ? (
                <div className="space-y-2">
                  {report.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-gray-50 border rounded hover:bg-gray-100 transition"
                    >
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-blue-600 truncate">
                        {att.originalName || att.fileName || 'Attachment'}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No attachments</p>
              )}
            </div>
          </div>

          {/* Right - Description */}
          <div className="flex-1 border-l border-gray-200 pl-8 overflow-y-auto">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            {report.description ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: report.description }}
              />
            ) : (
              <p className="text-gray-500">No description</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
