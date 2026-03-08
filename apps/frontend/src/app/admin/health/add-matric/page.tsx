'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateMonitorInput, CreateMonitorSchema } from '@/types';
import { MonitorType } from '@/types';
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
import { Heading } from '@/components/design';
import { useAddMatric } from '@/hooks/monitor/useMonitor';

const Page = () => {
  const router = useRouter();
  const { mutate: createMatric, isPending } = useAddMatric();

  const form = useForm<CreateMonitorInput>({
    resolver: zodResolver(CreateMonitorSchema),
    defaultValues: {
      title: '',
      url: '',
      type: '',
      refreshInterval: 30,
      authConfig: {
        username: '',
        password: '',
        token: '',
        apiKey: '',
      },
    },
  });

  const onSubmit = (data: CreateMonitorInput) => {
    createMatric(data, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  return (
    <div className="mx-auto min-h-screen bg-white p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between items-center">
            <Heading name="Create New Monitor" />
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isPending}
                className="border-b border-b-secondary-400 bg-secondary hover:bg-secondary-600 hover:text-white"
              >
                {isPending ? 'Creating...' : 'Create Monitor'}
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

          <div className="grid grid-cols-10 gap-8">
            {/* Left Column - Main Fields (70%) */}
            <div className="col-span-7 space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-main">
                      Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-50 h-12"
                        placeholder="Enter monitor title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-main">URL</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-50 h-12"
                        placeholder="https://example.com/api/health"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type & Refresh Interval Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-main">Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-md bg-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-md bg-white">
                          {Object.values(MonitorType).map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="rounded-md"
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Refresh Interval */}
                <FormField
                  control={form.control}
                  name="refreshInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-main">
                        Refresh Interval (seconds)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-gray-50 h-12"
                          placeholder="30"
                          min={5}
                          max={3600}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 30)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Column - Auth Config (30%) */}
            <div className="col-span-3 space-y-4">
              <div className="p-4 border bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-4">
                  Authentication Config
                </h3>

                {/* Username */}
                <FormField
                  control={form.control}
                  name="authConfig.username"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel className="text-main text-sm">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white h-10"
                          placeholder="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="authConfig.password"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel className="text-main text-sm">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="bg-white h-10"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Token */}
                <FormField
                  control={form.control}
                  name="authConfig.token"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel className="text-main text-sm">Token</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white h-10"
                          placeholder="Bearer token"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authConfig.apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-main text-sm">
                        API Key
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white h-10"
                          placeholder="API Key"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
