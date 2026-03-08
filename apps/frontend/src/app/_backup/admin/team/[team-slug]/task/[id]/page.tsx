'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components';
import {
  useTaskDetail,
  useUpdateTaskDates,
  useUpdateTaskDescription,
} from '@/hooks/task/useTask';
import { formatSmartDate } from '@/utils';
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
  Input,
} from '@/components/ui';
import { CalendarIcon, MoreHorizontal, Pencil, Star, X } from 'lucide-react';
import TaskComment from '@/components/pages/task/comment';
import { Heading } from '@/components/design';
import { LoadingSpin } from '@/components/loading/spin';
import NoResultsFound from '@/components/design/no_result.design';
import { ErrorLoading } from '@/components/loading/error';
import { RichTextEditor } from '@/components/tiptap/rich-text-editor';
import { format } from 'date-fns';
import { cn } from '@/utils';

const Page = () => {
  const params = useParams();
  const taskId = Array.isArray(params['id'])
    ? params['id'][0]
    : params['id'] || '';
  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : (params['team-slug'] as string) || '';

  const { data: task, isLoading, isError, error } = useTaskDetail(taskId, 0);
  const { mutate: updateDates, isPending: isUpdatingDates } =
    useUpdateTaskDates(taskId);
  const { mutate: updateDescription, isPending: isUpdatingDesc } =
    useUpdateTaskDescription(taskId);

  // Edit states
  const [isEditingStartDate, setIsEditingStartDate] = useState(false);
  const [isEditingEndDate, setIsEditingEndDate] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState('');

  const handleSaveStartDate = () => {
    updateDates(
      { startDate: startDate?.toISOString() },
      {
        onSuccess: () => setIsEditingStartDate(false),
      }
    );
  };

  const handleSaveEndDate = () => {
    updateDates(
      { endDate: endDate?.toISOString() },
      {
        onSuccess: () => setIsEditingEndDate(false),
      }
    );
  };

  const handleSaveDescription = () => {
    updateDescription(description, {
      onSuccess: () => setIsEditingDesc(false),
    });
  };

  if (isLoading)
    return (
      <Container className="min-h-screen justify-center content-center">
        <LoadingSpin />
      </Container>
    );

  if (isError) {
    const errorMessage =
      (error as any)?.response?.data?.message || error?.message || '';
    const errorCode = (error as any)?.response?.data?.code;

    if (errorCode === 5001 || errorMessage.includes('Task not found')) {
      return (
        <Container className="min-h-screen justify-center content-center">
          <NoResultsFound />
        </Container>
      );
    }

    return <ErrorLoading />;
  }

  if (!task)
    return (
      <Container className="min-h-screen justify-center content-center">
        <NoResultsFound />
      </Container>
    );

  return (
    <Container>
      <div className="bg-white p-8 h-[calc(100vh-100px)] flex flex-col">
        {/* Header Section */}
        <div className="mb-2 shrink-0">
          <div className="flex items-start justify-between mb-6">
            <Heading name={task.name} />
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-slate-700 text-slate-100 px-3 py-1"
              >
                Create At:{' '}
                <span className="ml-1 text-xs">
                  {task?.createdAt
                    ? formatSmartDate(task.createdAt)
                    : 'No date available'}
                </span>
              </Badge>
              <Badge
                variant="secondary"
                className="text-black px-3 py-1"
                style={{
                  backgroundColor: task.statusTag?.color || '#3B82F6',
                }}
              >
                {task.statusTag?.name}
                <span className="ml-1 text-xs">
                  {task.statusTag?.updatedAt
                    ? formatSmartDate(task.statusTag.updatedAt)
                    : 'No date available'}
                </span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-black hover:text-slate-100"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8 flex-1 min-h-0 overflow-hidden">
          {/* Main Content */}
          <div className="flex-4 overflow-y-auto pr-4">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Team
                  </label>
                  <p className="text-black">{task.project?.team?.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Assigned to
                  </label>
                  <p className="text-black">
                    {task.assignedUser?.firstName} {task.assignedUser?.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    @{task.assignedUser?.username}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Priority
                  </label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={
                          idx < (task.priority?.level ?? 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }
                        size={16}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Type
                  </label>
                  <p className="text-black">{task.type?.name}</p>
                </div>
              </div>

              {/* Right Column - Dates */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Status
                  </label>
                  <Badge
                    style={{
                      backgroundColor: task.statusTag?.color || '#3B82F6',
                    }}
                  >
                    {task.statusTag?.name}
                  </Badge>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Start Date
                  </label>
                  <div className="flex items-center gap-2">
                    {isEditingStartDate ? (
                      <Popover
                        open={isEditingStartDate}
                        onOpenChange={setIsEditingStartDate}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'w-full pl-3 h-10 text-left font-normal',
                              !startDate && 'text-muted-foreground'
                            )}
                          >
                            {startDate ? (
                              format(startDate, 'PPP p')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                          <div className="border-t p-3">
                            <Input
                              type="time"
                              value={
                                startDate ? format(startDate, 'HH:mm') : '00:00'
                              }
                              onChange={(e) => {
                                const [hours, minutes] =
                                  e.target.value.split(':');
                                const newDate = startDate
                                  ? new Date(startDate)
                                  : new Date();
                                newDate.setHours(parseInt(hours));
                                newDate.setMinutes(parseInt(minutes));
                                setStartDate(newDate);
                              }}
                            />
                          </div>
                          <div className="flex justify-end gap-2 p-3 border-t">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditingStartDate(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleSaveStartDate}
                              disabled={isUpdatingDates}
                            >
                              {isUpdatingDates ? 'Saving...' : 'Save'}
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <>
                        <p className="text-black">
                          {task?.startDate
                            ? formatSmartDate(task.startDate)
                            : 'No date available'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setStartDate(
                              task.startDate
                                ? new Date(task.startDate)
                                : undefined
                            );
                            setIsEditingStartDate(true);
                          }}
                        >
                          <Pencil className="text-blue-400" size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    End Date
                  </label>
                  <div className="flex items-center gap-2">
                    {isEditingEndDate ? (
                      <Popover
                        open={isEditingEndDate}
                        onOpenChange={setIsEditingEndDate}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'w-full pl-3 h-10 text-left font-normal',
                              !endDate && 'text-muted-foreground'
                            )}
                          >
                            {endDate ? (
                              format(endDate, 'PPP p')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                          <div className="border-t p-3">
                            <Input
                              type="time"
                              value={
                                endDate ? format(endDate, 'HH:mm') : '00:00'
                              }
                              onChange={(e) => {
                                const [hours, minutes] =
                                  e.target.value.split(':');
                                const newDate = endDate
                                  ? new Date(endDate)
                                  : new Date();
                                newDate.setHours(parseInt(hours));
                                newDate.setMinutes(parseInt(minutes));
                                setEndDate(newDate);
                              }}
                            />
                          </div>
                          <div className="flex justify-end gap-2 p-3 border-t">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditingEndDate(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleSaveEndDate}
                              disabled={isUpdatingDates}
                            >
                              {isUpdatingDates ? 'Saving...' : 'Save'}
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <>
                        <p className="text-black">
                          {task?.endDate
                            ? formatSmartDate(task.endDate)
                            : 'No date available'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setEndDate(
                              task.endDate ? new Date(task.endDate) : undefined
                            );
                            setIsEditingEndDate(true);
                          }}
                        >
                          <Pencil className="text-blue-400" size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="border-t border-slate-200 pt-8 mt-8">
              <div className="flex justify-between gap-6 mb-6 border-b border-slate-200 pb-4">
                <span className="text-gray-800 font-semibold">Description</span>
                {!isEditingDesc ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDescription(task.description || '');
                      setIsEditingDesc(true);
                    }}
                  >
                    <Pencil className="text-blue-400" size={16} />
                  </button>
                ) : (
                  <button type="button" onClick={() => setIsEditingDesc(false)}>
                    <X className="text-red-400" size={16} />
                  </button>
                )}
              </div>

              {isEditingDesc ? (
                <div className="space-y-4">
                  <RichTextEditor
                    initialContent={task.description || ''}
                    onChange={(val) => setDescription(val.html)}
                    className="w-full bg-white rounded-md cursor-text"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingDesc(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveDescription}
                      disabled={isUpdatingDesc}
                    >
                      {isUpdatingDesc ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rich-text-content mx-auto">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: task.description || '',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Comments */}
          <div className="flex-2 border-l border-slate-200 pl-8 flex flex-col min-h-0">
            <div className="flex gap-4 mb-4 border-b border-slate-200 pb-4 shrink-0">
              <p className="text-slate-600 font-semibold text-sm pb-2 hover:text-gray-800">
                Comments
              </p>
            </div>
            <div className="flex-1 min-h-0">
              <TaskComment taskId={taskId} teamSlug={teamSlug} />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Page;
