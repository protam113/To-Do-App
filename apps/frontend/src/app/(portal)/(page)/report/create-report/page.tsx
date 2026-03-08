'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateReportSchema, CreateReportInput } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui';
import { RichTextEditor } from '@/components/tiptap/rich-text-editor';
import { ErrorSelectForCreate } from '@/components/select/error_report_create.select';
import { useCreateReport } from '@/hooks/report/useReport';
import UpdateFile from '@/components/design/upload.design';
import { toast } from 'sonner';
import { FileIcon } from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const [selectedErrors, setSelectedErrors] = useState<string[]>([]);
  const { mutate: createReport, isPending } = useCreateReport();
  const [selectedMedias, setSelectedMedias] = useState<any[]>([]);

  const [uploadKey, setUploadKey] = useState(0);

  const createReportForm = useForm<CreateReportInput>({
    resolver: zodResolver(CreateReportSchema),
    defaultValues: {
      title: '',
      description: '',
      error: [],
      severity: 'low',
      status: 'open',
      incidentTime: new Date().toISOString().slice(0, 16),
      attachments: [],
    },
  });

  const handleErrorChange = (errorIds: string[]) => {
    setSelectedErrors(errorIds);
    createReportForm.setValue('error', errorIds);
  };

  const onSubmit = (data: CreateReportInput) => {
    createReport(data, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Form {...createReportForm}>
          <form
            onSubmit={createReportForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Create New Report
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Create a detailed report with complete information and
                  attachments.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="border-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isPending ? 'Creating...' : 'Create Report'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <FormField
                    control={createReportForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">
                          Title <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white h-11 border-gray-200"
                            placeholder="Enter report title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Severity & Status Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Report Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={createReportForm.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Severity <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 w-full rounded-md bg-white border-gray-200">
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-md bg-white">
                              <SelectItem value="low" className="rounded-md">
                                Low
                              </SelectItem>
                              <SelectItem value="medium" className="rounded-md">
                                Medium
                              </SelectItem>
                              <SelectItem value="high" className="rounded-md">
                                High
                              </SelectItem>
                              <SelectItem
                                value="critical"
                                className="rounded-md"
                              >
                                Critical
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createReportForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Status
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 w-full rounded-md bg-white border-gray-200">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-md bg-white">
                              <SelectItem value="open" className="rounded-md">
                                Open
                              </SelectItem>
                              <SelectItem
                                value="in_progress"
                                className="rounded-md"
                              >
                                In Progress
                              </SelectItem>
                              <SelectItem
                                value="resolved"
                                className="rounded-md"
                              >
                                Resolved
                              </SelectItem>
                              <SelectItem
                                value="canceled"
                                className="rounded-md"
                              >
                                Canceled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Incident Time Field */}
                  <FormField
                    control={createReportForm.control}
                    name="incidentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Incident Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            className="h-11 w-full rounded-md bg-white border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Related Errors Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <FormField
                    control={createReportForm.control}
                    name="error"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">
                          Related Errors
                        </FormLabel>
                        <FormControl>
                          <ErrorSelectForCreate
                            value={selectedErrors}
                            onValueChange={handleErrorChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <FormField
                    control={createReportForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">
                          Description
                        </FormLabel>
                        <FormControl>
                          <RichTextEditor
                            initialContent={field.value || ''}
                            onChange={(val) => field.onChange(val.html)}
                            className="w-full bg-white rounded-md cursor-text min-h-[300px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Right Column - Attachments & Instructions */}
              <div className="space-y-6">
                {/* Attachments Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <FormField
                    control={createReportForm.control}
                    name="attachments"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-medium">
                          Attachments
                        </FormLabel>
                        <FormControl>
                          <div>
                            <UpdateFile
                              key={uploadKey}
                              onUploadSuccess={(file, mediaData) => {
                                if (mediaData) {
                                  const newMedias = [
                                    ...selectedMedias,
                                    mediaData,
                                  ];
                                  setSelectedMedias(newMedias);
                                  createReportForm.setValue(
                                    'attachments',
                                    newMedias
                                  );
                                  setUploadKey((prev) => prev + 1);
                                }
                              }}
                              onUploadError={(error) => {
                                toast.error(error);
                              }}
                            />

                            {selectedMedias.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium text-gray-700">
                                  Selected Files ({selectedMedias.length}):
                                </p>
                                <div className="space-y-2">
                                  {selectedMedias.map((media, index) => (
                                    <div
                                      key={`${media.id}-${index}`}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        <FileIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 truncate">
                                          {media.originalName || media.fileName}
                                        </span>
                                        <span className="text-xs text-gray-500 flex-shrink-0">
                                          ({media.fileType})
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newMedias =
                                            selectedMedias.filter(
                                              (_, i) => i !== index
                                            );
                                          setSelectedMedias(newMedias);
                                          createReportForm.setValue(
                                            'attachments',
                                            newMedias
                                          );
                                        }}
                                        className="text-red-500 hover:text-red-700 text-sm ml-2 flex-shrink-0"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Instructions Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Instructions
                  </h3>
                  <div className="text-sm text-gray-600 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Report Guidelines
                      </h4>
                      <p className="text-sm">
                        Provide clear and detailed information about the issue
                        or incident.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Severity Levels
                      </h4>
                      <p className="text-sm">
                        Choose appropriate severity: Low for minor issues,
                        Critical for urgent problems.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        Attachments
                      </h4>
                      <p className="text-sm">
                        Include screenshots, logs, or documents that help
                        explain the issue.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
