'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components';
import {
  useTaskDetail,
  useAssignTask,
  useUnassignTask,
  useUpdateTaskDates,
  useUpdateTaskDescription,
} from '@/hooks/task/useTask';
import { formatSmartDate } from '@/utils';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Calendar,
  Input,
  cn,
} from '@/components/ui';
import {
  CalendarIcon,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Star,
  Check,
  UserX,
  X,
} from 'lucide-react';
import TaskComment from '@/components/pages/task/comment';
import { useUpdateTaskPriority } from '@/hooks/task/usePriority';
import { useUpdateTask } from '@/hooks/task/useStatus';
import { StatusList } from '@/libs/responses/status.lib';
import { Heading } from '@/components/design';
import { LoadingSpin, ErrorLoading } from '@/components/loading';

import NoResultsFound from '@/components/design/no_result.design';
import { UserAvatar } from '@/components/design/avatar.design';
import { TeamMemberList } from '@/libs/responses/teamLib';
import { RichTextEditor } from '@/components/tiptap/rich-text-editor';
import { format } from 'date-fns';

const Page = () => {
  const params = useParams();

  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : (params['team-slug'] as string) || '';

  const projectSlug = Array.isArray(params['project-slug'])
    ? params['project-slug'][0]
    : (params['project-slug'] as string) || '';

  const taskId = Array.isArray(params['id'])
    ? params['id'][0]
    : (params['id'] as string) || '';

  const { data: task, isLoading, isError, error } = useTaskDetail(taskId, 0);
  const { mutate: updateTaskPriority } = useUpdateTaskPriority(taskId);
  const { mutate: updateTask } = useUpdateTask(taskId);
  const { mutate: assignTask, isPending: isAssigning } = useAssignTask(taskId);
  const { mutate: unassignTask, isPending: isUnassigning } =
    useUnassignTask(taskId);
  const { mutate: updateDates } = useUpdateTaskDates(taskId);
  const { mutate: updateDescription, isPending: isUpdatingDesc } =
    useUpdateTaskDescription(taskId);

  // Assignee states
  const [openAssigneePopover, setOpenAssigneePopover] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Priority states
  const [selectedPriority, setSelectedPriority] = useState<number | null>(null);
  const [isPriorityEditing, setIsPriorityEditing] = useState(false);

  // Start date states
  const [isEditingStartDate, setIsEditingStartDate] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [isSavingStartDate, setIsSavingStartDate] = useState(false);

  // End date states
  const [isEditingEndDate, setIsEditingEndDate] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isSavingEndDate, setIsSavingEndDate] = useState(false);

  // Description states
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState('');

  const memberFilters = {
    search: memberSearchQuery || undefined,
    page_size: 20,
  };

  const { members, isLoading: isMembersLoading } = TeamMemberList(
    1,
    teamSlug,
    memberFilters,
    0
  );

  const statusFilters = {
    page_size: 20,
  };
  const { status, isLoading: isStatusLoading } = StatusList(
    1,
    projectSlug,
    statusFilters,
    0
  );

  // Priority handlers
  const handleStarClick = (level: number) => {
    setSelectedPriority(level);
    setIsPriorityEditing(true);
  };

  const handleApprove = () => {
    if (selectedPriority !== null) {
      updateTaskPriority(
        { level: selectedPriority },
        {
          onSettled: () => {
            setIsPriorityEditing(false);
            setSelectedPriority(null);
          },
        }
      );
    }
  };

  const handleClear = () => {
    updateTaskPriority(
      { level: 0 },
      {
        onSettled: () => {
          setIsPriorityEditing(false);
          setSelectedPriority(null);
        },
      }
    );
  };

  const displayLevel = selectedPriority ?? task?.priority?.level ?? 0;

  // Start date handler
  const handleSaveStartDate = () => {
    setIsSavingStartDate(true);
    updateDates(
      { startDate: startDate?.toISOString() },
      {
        onSettled: () => {
          setIsSavingStartDate(false);
          setIsEditingStartDate(false);
        },
      }
    );
  };

  // End date handler
  const handleSaveEndDate = () => {
    setIsSavingEndDate(true);
    updateDates(
      { endDate: endDate?.toISOString() },
      {
        onSettled: () => {
          setIsSavingEndDate(false);
          setIsEditingEndDate(false);
        },
      }
    );
  };

  // Description handler
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

  // Check if error is "Task not found" (404)
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
    <div className="bg-white ">
      <div className=" p-8 h-[calc(100vh-100px)] flex flex-col">
        {/* Header Section - Fixed */}
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
                  {' '}
                  {task?.createdAt
                    ? formatSmartDate(task.createdAt)
                    : 'No date available'}
                </span>
              </Badge>
              {/* STATUS */}
              <Badge
                variant="secondary"
                className="text-black px-3 py-1"
                style={{
                  backgroundColor: task.statusTag?.color || '#3B82F6',
                }}
              >
                {task.statusTag?.name}

                <span className="ml-1 text-xs">
                  {' '}
                  {task.statusTag?.updatedAt
                    ? formatSmartDate(task.statusTag.updatedAt)
                    : 'No date available'}
                </span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-800 hover:text-slate-100"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content with separate scrolls */}
        <div className="flex gap-8 flex-1 min-h-0 overflow-hidden">
          {/* Main Content - 60% with scroll */}
          <div className="flex-3 overflow-y-auto pr-4">
            <div className="space-y-8">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Metadata */}
                <div className="space-y-6">
                  {/* Team */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Team
                    </label>
                    <p className="text-slate-800">{task.project?.team?.name}</p>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Assigned to
                    </label>
                    <div className="flex space-x-2">
                      {task.assignedUser ? (
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            url={
                              task.assignedUser.avatarUrl || '/imgs/logo_c.jpg'
                            }
                            username={task.assignedUser.username}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {task.assignedUser.firstName || 'unknow'}{' '}
                              {task.assignedUser.lastName || ''}
                            </span>
                            {task.assignedUser.username && (
                              <span className="text-xs text-muted-foreground">
                                @{task.assignedUser.username || 'unknow'}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No user assigned
                        </span>
                      )}
                      <Popover
                        open={openAssigneePopover}
                        onOpenChange={setOpenAssigneePopover}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            disabled={isAssigning || isUnassigning}
                          >
                            <Pencil
                              className="text-blue-400 text-xs"
                              size={16}
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search member..."
                              value={memberSearchQuery}
                              onValueChange={setMemberSearchQuery}
                            />
                            <CommandEmpty>
                              {isMembersLoading
                                ? 'Loading...'
                                : 'No member found.'}
                            </CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {task.assignedUser && (
                                <CommandItem
                                  onSelect={() => {
                                    unassignTask();
                                    setOpenAssigneePopover(false);
                                  }}
                                  className="text-red-500"
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Unassign
                                </CommandItem>
                              )}
                              {members?.map((member) => (
                                <CommandItem
                                  key={member.id}
                                  value={member.user.username}
                                  onSelect={() => {
                                    assignTask(member.user.id);
                                    setOpenAssigneePopover(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      task.assignedUser?.id === member.user.id
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {member.user.firstName}{' '}
                                      {member.user.lastName}
                                    </span>
                                    {member.user.username && (
                                      <span className="text-xs text-muted-foreground">
                                        @{member.user.username}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Priority
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`cursor-pointer transition-colors ${
                              idx < displayLevel
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-700 hover:text-yellow-200'
                            }`}
                            size={16}
                            onClick={() => handleStarClick(idx + 1)}
                          />
                        ))}
                      </div>
                      {isPriorityEditing && (
                        <div className="flex gap-2 ml-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClear}
                            className="text-xs px-2 py-1 h-6"
                          >
                            Clear
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleApprove}
                            className="text-xs px-2 py-1 h-6"
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Type
                    </label>
                    <p className="text-slate-800">{task.type?.name}</p>
                  </div>
                </div>

                {/* Right Column - Dates */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Status
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                          <Badge
                            variant="secondary"
                            className="text-black px-3 py-1"
                            style={{
                              backgroundColor:
                                task.statusTag?.color || '#3B82F6',
                            }}
                          >
                            {task.statusTag?.name}
                          </Badge>
                          <ChevronDown size={16} className="text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {isStatusLoading ? (
                          <DropdownMenuItem disabled>
                            Loading...
                          </DropdownMenuItem>
                        ) : (
                          status?.map((s: any) => (
                            <DropdownMenuItem
                              key={s.id}
                              onClick={() => updateTask({ status: s.id })}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: s.color || '#3B82F6',
                                  }}
                                />
                                <span>{s.name}</span>
                              </div>
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
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
                                  startDate
                                    ? format(startDate, 'HH:mm')
                                    : '00:00'
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
                                disabled={isSavingStartDate}
                              >
                                {isSavingStartDate ? 'Saving...' : 'Save'}
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <>
                          <p className="text-slate-800">
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
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
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
                                disabled={isSavingEndDate}
                              >
                                {isSavingEndDate ? 'Saving...' : 'Save'}
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <>
                          <p className="text-slate-800">
                            {task?.endDate
                              ? formatSmartDate(task.endDate)
                              : 'No date available'}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setEndDate(
                                task.endDate
                                  ? new Date(task.endDate)
                                  : undefined
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
              <div className="border-t border-slate-200 pt-2">
                <div className="flex justify-between gap-6 border-b border-slate-200 pb-4">
                  <span className="text-black font-semibold">Description</span>
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
                    <button
                      type="button"
                      onClick={() => setIsEditingDesc(false)}
                    >
                      <X className="text-red-400" size={16} />
                    </button>
                  )}
                </div>

                {isEditingDesc ? (
                  <div className="space-y-4 mt-4">
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
          </div>

          {/* Right Sidebar - Comments - 40% */}
          <div className="flex-2 border-l border-slate-200 pl-8 flex flex-col min-h-0">
            <div className="flex gap-4 mb-4 border-b border-slate-200 pb-4 shrink-0">
              <p className="text-slate-600 font-semibold text-sm pb-2 hover:text-black">
                Comments
              </p>
            </div>

            {/* Activity Feed - Takes remaining height */}
            <div className="flex-1 min-h-0">
              <TaskComment taskId={taskId} teamSlug={teamSlug} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
