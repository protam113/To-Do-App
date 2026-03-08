'use client';

import { useCreateProject } from '@/hooks/project/useProject';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProjectSchema } from '@/types';
import { toast } from 'sonner';
import { Button, Input, Label, Textarea } from '@/components/ui';
import { AdminTeamList } from '@/libs/responses/teamLib';
import { useRouter } from 'next/navigation';
import { Container } from '@/components';
import { LoadingSpin } from '@/components/loading/spin';

const Page = () => {
  const router = useRouter();
  const { mutate: createProject, isPending } = useCreateProject();
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');

  const params = {
    search: actualSearchQuery || undefined,
    page_size: 100, // Get all teams for dropdown
  };

  const { teams, isLoading: isLoadingTeams } = AdminTeamList(
    1,
    params,
    refreshKey
  );

  const handleSearch = () => {
    setActualSearchQuery(searchQuery);
    setRefreshKey((prev) => prev + 1);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      teamId: '',
    },
    mode: 'onChange',
  });

  const selectedTeamId = watch('teamId');

  const onSubmit = (data: z.infer<typeof CreateProjectSchema>) => {
    createProject(data, {
      onSuccess: () => {
        toast.success('Project created successfully!');
        reset();
        router.push('/admin/project');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to create project');
      },
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <Container className=" p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-main font-bold">Create New Project</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Team Selection with Search */}

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-main">
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              className="bg-neutral-100 h-10 p-2"
              placeholder="Enter project name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-main">
              Description
            </Label>
            <Textarea
              id="description"
              className="bg-neutral-100 p-2"
              placeholder="Enter project description (optional)"
              rows={4}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-main">
              Select Team <span className="text-red-500">*</span>
            </Label>

            {/* Search Box */}
            <div className="flex gap-2">
              <Input
                placeholder="Search teams..."
                className="p-2 bg-neutral-100 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSearch}
                disabled={isLoadingTeams}
              >
                Search
              </Button>
            </div>

            {/* Team List */}
            <div className="border p-4  max-h-64 overflow-y-auto">
              {isLoadingTeams ? (
                <div className="text-center text-gray-500 py-8">
                  Loading teams...
                </div>
              ) : teams && teams.length > 0 ? (
                <div className="space-y-2">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      onClick={() => setValue('teamId', team.id)}
                      className={`p-3   border-2 cursor-pointer transition-all ${
                        selectedTeamId === team.id
                          ? 'border-main bg-main/10'
                          : 'border-gray-200 bg-neutral-100 hover:border-main/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{team.name}</h3>
                          {team.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {team.description}
                            </p>
                          )}
                        </div>
                        {selectedTeamId === team.id && (
                          <div className="text-main">
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No teams found
                </div>
              )}
            </div>

            {errors.teamId && (
              <p className="text-sm text-red-500">{errors.teamId.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg bg-main text-main hover:bg-main-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpin />
                Creating project...
              </span>
            ) : (
              'Create Project'
            )}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Page;
