'use client';

import {
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui';
import { useForm, Controller } from 'react-hook-form';
import type { z } from 'zod';
import { CreateTicketSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useCreateTicket } from '../../hooks/ticket/useTicket';
import { TicketType } from '@/types';
import { useAuthStore } from '../../store';

const ticketTypeLabels: Record<TicketType, string> = {
  [TicketType.AUTH]: 'Authentication',
  [TicketType.USER]: 'User Management',
  [TicketType.TEAM]: 'Team',
  [TicketType.PROJECT]: 'Project',
  [TicketType.TASK]: 'Task',
  [TicketType.SUBTASK]: 'Subtask',
  [TicketType.COMMENT]: 'Comment',
  [TicketType.TAG]: 'Tag',
  [TicketType.PRIORITY]: 'Priority',
  [TicketType.SCHEDULE]: 'Schedule',
  [TicketType.NOTIFICATION]: 'Notification',
  [TicketType.SETTINGS]: 'Settings',
};

export default function AuthTicketForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { userInfo } = useAuthStore();
  const { mutate: createTicket, isPending, isSuccess } = useCreateTicket();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof CreateTicketSchema>>({
    resolver: zodResolver(CreateTicketSchema),
    defaultValues: {
      title: '',
      type: TicketType.AUTH,
      content: '',
      userId: userInfo?.id,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      reset();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isSuccess, reset, onSuccess]);

  const onSubmit = async (values: z.infer<typeof CreateTicketSchema>) => {
    createTicket(values);
  };

  const isLoading = isSubmitting || isPending;
  return (
    <div className="w-full bg-white border p-6 mb-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isSuccess && (
          <div className="bg-green-50 border border-green-200   p-4 text-center">
            <p className="text-green-700 font-medium">
              ✓ Ticket Submitted Successfully!
            </p>
            <p className="text-sm text-green-600 mt-1">
              Your issue has been reported. We will review it shortly.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              className={`text-sm text-main   font-medium ${
                isLoading ? 'opacity-50' : ''
              }`}
              htmlFor="title"
            >
              Title
            </label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              className={`w-full bg-white   h-14 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className={`text-sm text-main font-medium ${
                isLoading ? 'opacity-50' : ''
              }`}
              htmlFor="type"
            >
              Issue Type
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    className={`w-full h-14 bg-white ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.entries(ticketTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label
            className={`text-sm text-main font-medium ${
              isLoading ? 'opacity-50' : ''
            }`}
            htmlFor="content"
          >
            Description
          </label>
          <Textarea
            id="content"
            placeholder="Provide detailed information about the issue..."
            className={`w-full bg-white   min-h-[120px] ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
            {...register('content')}
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="text-sm text-red-500 text-center">
            {errors.root.message}
          </p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            className={`text-white border border-white bg-blue-950 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex  items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Report'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
