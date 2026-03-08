'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createErrorFormSchema } from '@/types';
import { toast } from 'sonner';
import { Button, Input, Label } from '@/components/ui';
import { LoadingSpin } from '../../loading/spin';
import { Heading } from '../../design/heading.design';
import { useCreateError } from '@/hooks';

const CreateError = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { mutate: createError, isPending } = useCreateError();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof createErrorFormSchema>>({
    resolver: zodResolver(createErrorFormSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: z.infer<typeof createErrorFormSchema>) => {
    createError(data, {
      onSuccess: () => {
        toast.success('Project created successfully!');
        reset();
        onSuccess?.();
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to create project');
      },
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <div className="space-y-8">
      <Heading name="Create Type" />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-main">
            Error Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Enter error name"
            {...register('name')}
            className="bg-gray-100 h-14"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
      </div>
      <Button
        type="button"
        onClick={(e) => {
          handleSubmit(onSubmit)(e);
        }}
        className={`w-full font-bold h-[60px]   text-xl bg-main hover:bg-main/70 text-white ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <LoadingSpin />
            </svg>
            Creating ...
          </span>
        ) : (
          'Create'
        )}
      </Button>
    </div>
  );
};

export default CreateError;
