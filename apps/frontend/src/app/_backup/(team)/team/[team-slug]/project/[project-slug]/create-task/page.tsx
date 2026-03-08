'use client';

import { useCreateTask } from '@/hooks/task/useTask';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTaskSchema, CreateTaskInput } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils';
import { Heading } from '@/components/design';
import { RichTextEditor } from '@/components/tiptap/rich-text-editor';
import { TypeList } from '@/libs/responses/typeLib';
import { StatusList } from '@/libs/responses/status.lib';
import { Calendar } from '@/components/ui';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { TeamMemberList } from '@/libs/responses/teamLib';

const Page = () => {
  const params = useParams();
  const projectSlug = Array.isArray(params['project-slug'])
    ? params['project-slug'][0]
    : params['project-slug'] || '';
  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : params['team-slug'] || '';

  const router = useRouter();
  const { mutate: createTask, isPending } = useCreateTask();
  const [searchQuery, setSearchQuery] = useState('');
  const [openTypeSelect, setOpenTypeSelect] = useState(false);
  const [openStatusSelect, setOpenStatusSelect] = useState(false);
  const [openMemberSelect, setOpenMemberSelect] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const typeFilters = {
    search: searchQuery || undefined,
    page_size: 100,
  };

  const statusFilters = {
    search: searchQuery || undefined,
    page_size: 100,
  };

  const memberFilters = {
    search: searchQuery || undefined,
    page_size: 100,
  };

  const { status, isLoading: isStatusLoading } = StatusList(
    1,
    projectSlug,
    statusFilters,
    0
  );

  const {
    members,
    isLoading: isTeamMembersLoading,
    pagination,
  } = TeamMemberList(currentPage, teamSlug, memberFilters, 0);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.total_page) {
      setCurrentPage(page);
    }
  };

  // TYPES LIST
  const { types, isLoading: isTypeLoading } = TypeList(1, typeFilters, 0);

  const createTaskForm = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      name: '',
      description: '',
      projectSlug: projectSlug,
      typeId: '',
      assignedTo: '',
      status: '',
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit = (data: CreateTaskInput) => {
    createTask(data, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  return (
    <div className=" mx-auto min-h-screen">
      <Form {...createTaskForm}>
        <form
          onSubmit={createTaskForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="flex">
            <Heading name="Create New Task" />
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 border-b border-b-main bg-white hover:bg-main-800 hover:text-white"
              >
                {isPending ? 'Creating...' : 'Create Task'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
          <div className="flex gap-8 flex-1 min-h-0 overflow-hidden">
            <div className="flex-2 border-l border-slate-200 pl-8 flex flex-col space-y-2 min-h-0">
              <FormField
                control={createTaskForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-main">
                      Task Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className=" bg-gray-100 h-14"
                        placeholder="Enter task name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createTaskForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-main">Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3  h-14 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value as Date, 'PPP p')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 " align="start">
                          <Calendar
                            mode="single"
                            selected={field.value as Date | undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                          <div className="border-t p-3">
                            <Input
                              type="time"
                              value={
                                field.value
                                  ? format(field.value as Date, 'HH:mm')
                                  : '00:00'
                              }
                              onChange={(e) => {
                                const [hours, minutes] =
                                  e.target.value.split(':');
                                const newDate = field.value
                                  ? new Date(field.value as Date)
                                  : new Date();
                                newDate.setHours(parseInt(hours));
                                newDate.setMinutes(parseInt(minutes));
                                field.onChange(newDate);
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createTaskForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-main">End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 h-14  text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value as Date, 'PPP p')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value as Date | undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                          <div className="border-t p-3">
                            <Input
                              type="time"
                              value={
                                field.value
                                  ? format(field.value as Date, 'HH:mm')
                                  : '00:00'
                              }
                              onChange={(e) => {
                                const [hours, minutes] =
                                  e.target.value.split(':');
                                const newDate = field.value
                                  ? new Date(field.value as Date)
                                  : new Date();
                                newDate.setHours(parseInt(hours));
                                newDate.setMinutes(parseInt(minutes));
                                field.onChange(newDate);
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={createTaskForm.control}
                  name="typeId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-main">
                        Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover
                        open={openTypeSelect}
                        onOpenChange={setOpenTypeSelect}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openTypeSelect}
                              className={cn(
                                'w-full justify-between h-14 ',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? types?.find((type) => type.id === field.value)
                                    ?.name
                                : 'Select type...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput
                              placeholder="Search type..."
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                            />
                            <CommandEmpty>
                              {isTypeLoading ? 'Loading...' : 'No type found.'}
                            </CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {types?.map((type) => (
                                <CommandItem
                                  key={type.id}
                                  value={type.name}
                                  onSelect={() => {
                                    field.onChange(type.id);
                                    setOpenTypeSelect(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === type.id
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {type.name}
                                    </span>
                                    {type.description && (
                                      <span className="text-xs text-muted-foreground">
                                        {type.description}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createTaskForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-main">Status </FormLabel>
                      <Popover
                        open={openStatusSelect}
                        onOpenChange={setOpenStatusSelect}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openStatusSelect}
                              className={cn(
                                'w-full justify-between h-14 ',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {field.value &&
                                  status?.find(
                                    (statusD) => statusD.id === field.value
                                  )?.color && (
                                    <div
                                      className="h-3 w-3 rounded-full"
                                      style={{
                                        backgroundColor: status.find(
                                          (statusD) =>
                                            statusD.id === field.value
                                        )?.color,
                                      }}
                                    />
                                  )}
                                <span>
                                  {field.value
                                    ? status?.find(
                                        (statusD) => statusD.id === field.value
                                      )?.name
                                    : 'Select type...'}
                                </span>
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput
                              placeholder="Search type..."
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                            />
                            <CommandEmpty>
                              {isStatusLoading
                                ? 'Loading...'
                                : 'No status found.'}
                            </CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {status?.map((statusD) => (
                                <CommandItem
                                  key={statusD.id}
                                  value={statusD.name}
                                  onSelect={() => {
                                    field.onChange(statusD.id);
                                    setOpenStatusSelect(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === statusD.id
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {statusD.color && (
                                    <div
                                      className="mr-2 h-3 w-3 rounded-full"
                                      style={{
                                        backgroundColor: statusD.color,
                                      }}
                                    />
                                  )}
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {statusD.name}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createTaskForm.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-main">Assigned To</FormLabel>
                      <Popover
                        open={openMemberSelect}
                        onOpenChange={setOpenMemberSelect}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openMemberSelect}
                              className={cn(
                                'w-full h-14  justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? members?.find(
                                    (member) => member.id === field.value
                                  )?.user.username
                                : 'Select member...'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput
                              placeholder="Search member..."
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                            />
                            <CommandEmpty>
                              {isTeamMembersLoading
                                ? 'Loading...'
                                : 'No member found.'}
                            </CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {members?.map((member) => (
                                <CommandItem
                                  key={member.id}
                                  value={member.user.username}
                                  onSelect={() => {
                                    field.onChange(member.user.id);
                                    setOpenMemberSelect(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value === member.user.id
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
                              {currentPage < pagination.total_page && (
                                <div className="p-2 border-t">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handlePageChange(currentPage + 1);
                                    }}
                                    disabled={isTeamMembersLoading}
                                  >
                                    {isTeamMembersLoading
                                      ? 'Loading...'
                                      : `Load more (${currentPage}/${pagination.total_page})`}
                                  </Button>
                                </div>
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex-3 overflow-y-auto pr-4">
              <FormField
                control={createTaskForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        initialContent={field.value}
                        onChange={(val) => field.onChange(val.html)}
                        className="w-full bg-whtie rounded-md cursor-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <input type="hidden" {...createTaskForm.register('projectSlug')} />
        </form>
      </Form>
    </div>
  );
};

export default Page;
