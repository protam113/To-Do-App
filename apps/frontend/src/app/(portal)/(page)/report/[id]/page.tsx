'use client';

import { useParams } from 'next/navigation';
import { Container } from '@/components';
import { formatSmartDate } from '@/utils';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import {
  Paperclip,
  AlertCircle,
  Plus,
  Clock,
  User,
  Save,
  X,
  ArrowLeft,
  Edit3,
  History,
  Share2,
} from 'lucide-react';
import { LoadingSpin, ErrorLoading } from '@/components/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import NoResultsFound from '@/components/design/no_result.design';
import {
  useAddAttachment,
  useRemoveAttachment,
  useReportDetail,
  useUpdateReportDetail,
} from '@/hooks';
import { BackButton } from '@/components/button/back.button';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import UpdateFile from '@/components/design/upload.design';
import { CopyLinkButton } from '@/components/button/copy.button';
import { Icons } from '@/assets';
import { RichTextEditor } from '@/components/tiptap/rich-text-editor';
import { AttachmentCard } from '@/components/attachment/attachment-card';
import { StatusBadge, SeverityBadge } from '@/components/badge';

interface EditForm {
  title: string;
  description: string;
  severity: string;
  status: string;
}

const Page = () => {
  const params = useParams();
  const id = Array.isArray(params['id'])
    ? params['id'][0]
    : (params['id'] as string) || '';

  const {
    data: report,
    isLoading,
    isError,
    error,
    refetch,
  } = useReportDetail(id, 0);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    title: '',
    description: '',
    severity: '',
    status: '',
  });

  const { mutate: addAttachment, isPending } = useAddAttachment(id);
  const { mutate: deleteAttachment } = useRemoveAttachment(id);
  const { mutate: updateReport, isPending: isUpdating } =
    useUpdateReportDetail(id);

  // Sync editForm when report loads
  useEffect(() => {
    if (report) {
      setEditForm({
        title: report.title || '',
        description: report.description || '',
        severity: report.severity || '',
        status: report.status || '',
      });
    }
  }, [report]);

  const handleSave = () => {
    updateReport(
      {
        title: editForm.title,
        description: editForm.description,
        severity: editForm.severity as any,
        status: editForm.status as any,
      },
      {
        onSuccess: () => {
          toast.success('Report updated successfully');
          setIsEditing(false);
          refetch();
        },
        onError: () => {
          toast.error('Failed to update report');
        },
      }
    );
  };

  const handleCancel = () => {
    if (report) {
      setEditForm({
        title: report.title || '',
        description: report.description || '',
        severity: report.severity || '',
        status: report.status || '',
      });
    }
    setIsEditing(false);
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      deleteAttachment(attachmentId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Container className="min-h-screen justify-center content-center">
        <LoadingSpin />
      </Container>
    );
  }

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

  if (!report) {
    return (
      <Container className="min-h-screen justify-center content-center">
        <NoResultsFound />
      </Container>
    );
  }

  const createdByUser = report.users?.find((u) => u.type === 'created_by');
  const updatedByUser = report.users?.find((u) => u.type === 'updated_by');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <BackButton href="/report" />
            <div>
              <h1 className="text-2xl font-bold text-blue-600">
                Report Detail #{report.id}
              </h1>
              {createdByUser && (
                <p className="text-sm text-gray-500 mt-1">
                  Created by {createdByUser.user?.firstName}{' '}
                  {createdByUser.user?.lastName} •{' '}
                  {new Date(report.createdAt).toLocaleString('vi-VN')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <CopyLinkButton />
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors rounded-md"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <Save className="w-4 h-4" />
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm font-medium hover:bg-gray-600 transition-colors rounded-md"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Report Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Info Card */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Report Information
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Select
                          value={editForm.severity}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, severity: value })
                          }
                        >
                          <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue placeholder="Severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={editForm.status}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, status: value })
                          }
                        >
                          <SelectTrigger className="h-8 w-32 text-xs">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <>
                        <SeverityBadge severity={report.severity} />
                        <StatusBadge status={report.status} />
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="w-full"
                        placeholder="Enter report title"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {report.title}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Errors */}
            {report.errors && report.errors.length > 0 && (
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                    Related Errors ({report.errors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {report.errors.map((err) => (
                      <div
                        key={err.id}
                        className="p-3 bg-red-50 border border-red-200 rounded-md"
                      >
                        <p className="text-sm font-medium text-red-900">
                          {err.name}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          ID: {err.id}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="min-h-[300px]">
                  {isEditing ? (
                    <RichTextEditor
                      initialContent={editForm.description || ''}
                      onChange={(val) =>
                        setEditForm({ ...editForm, description: val.html })
                      }
                      className="w-full bg-white rounded-md border border-gray-200"
                    />
                  ) : report.description ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: report.description }}
                    />
                  ) : (
                    <p className="text-gray-500 text-center py-12">
                      No description available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors text-blue-700 font-medium text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Attachment
                </button>
                <button className="w-full flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm">
                  <History className="h-4 w-4" />
                  View History
                </button>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center justify-between text-base font-semibold text-gray-900">
                  <span className="flex items-center">
                    <Paperclip className="w-5 h-5 mr-2 text-orange-500" />
                    Attachments
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                    {report.attachments.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {report.attachments.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {report.attachments.map((attachment) => (
                      <AttachmentCard
                        key={attachment.id}
                        attachment={attachment}
                        onDelete={handleRemoveAttachment}
                        showDeleteButton={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-md">
                    <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">
                      No attachments
                    </p>
                    <p className="text-xs text-gray-400">
                      Click "Add Attachment" to upload files
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Information */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center text-base font-semibold text-gray-900">
                  <User className="w-5 h-5 mr-2 text-purple-500" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {createdByUser && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Created By
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {createdByUser.user?.firstName?.[0]}
                        {createdByUser.user?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium text-sm">
                          {createdByUser.user?.firstName}{' '}
                          {createdByUser.user?.lastName}
                        </p>
                        <p className="text-gray-500 text-xs">
                          @{createdByUser.user?.username}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {createdByUser.actionAt
                        ? formatSmartDate(createdByUser.actionAt as string)
                        : '-'}
                    </p>
                  </div>
                )}

                {updatedByUser && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Updated By
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {updatedByUser.user?.firstName?.[0]}
                        {updatedByUser.user?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium text-sm">
                          {updatedByUser.user?.firstName}{' '}
                          {updatedByUser.user?.lastName}
                        </p>
                        <p className="text-gray-500 text-xs">
                          @{updatedByUser.user?.username}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {updatedByUser.actionAt
                        ? formatSmartDate(updatedByUser.actionAt as string)
                        : '-'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upload Modal */}
        {isCreateDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upload New Attachment
                  </h3>
                  <button
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <UpdateFile
                  key={uploadKey}
                  acceptedFileTypes={[
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'application/pdf',
                    'text/plain',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ]}
                  maxFileSize={50 * 1024 * 1024} // 50MB
                  onUploadSuccess={(_, mediaData) => {
                    console.log('Upload success:', mediaData);
                    if (mediaData) {
                      addAttachment([mediaData], {
                        onSuccess: () => {
                          setUploadKey((prev) => prev + 1);
                          setIsCreateDialogOpen(false);
                          refetch();
                          toast.success('Attachment added successfully');
                        },
                      });
                    }
                  }}
                  onUploadError={(err) => {
                    console.error('Upload error:', err);
                    toast.error(err);
                  }}
                />
                {isPending && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Uploading attachment...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
