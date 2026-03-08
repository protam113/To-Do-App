'use client';

import { Button } from '@/components/ui';
import { Container } from '@/components';
import { ProjectCard } from '@/components/card/project.card';
import { Heading } from '@/components/design';
import NoResultsFound from '@/components/design/no_result.design';
import { ErrorLoading } from '@/components/loading/error';
import { LoadingSpin } from '@/components/loading/spin';
import CreateProject from '@/components/pages/project/create-project';
import { AdminTaskTable } from '@/components/table/admin-task-table.table';
import { TeamProjectList } from '@/libs/responses/projectLib';
import { TaskTeamList } from '@/libs/responses/taskLib';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const params = useParams();
  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : params['team-slug'] || '';
  const router = useRouter();
  const projectFilters = {
    page_size: 4,
  };
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const taskFilters = {
    page_size: 4,
  };
  // PROJECT
  const { projects, isLoading, isError } = TeamProjectList(
    1,
    teamSlug,
    projectFilters,
    0
  );
  // TASK
  const {
    tasks,
    isLoading: isTaskLoading,
    isError: isTaskError,
  } = TaskTeamList(1, teamSlug, taskFilters, 0);

  if (isLoading) {
    return (
      <Container>
        <LoadingSpin />
      </Container>
    );
  }

  return (
    <div>
      {/* Project Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading name="Recent Project" />
          <div className="space-x-2 flex">
            <Button
              onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
              className={
                isCreateDialogOpen
                  ? 'border-b-2 border-b-black text-main bg-white'
                  : 'border-b-2 hover:border-b-main hover:bg-main-800 hover:text-white'
              }
            >
              {isCreateDialogOpen ? 'Cancel' : 'Create Project'}
            </Button>
            <Button
              variant="ghost"
              className="bg-main-200 hover:bg-main-500 hover:text-white"
              onClick={() => router.push(`/admin/team/${teamSlug}/project`)}
            >
              View All
            </Button>
          </div>
        </div>
        {isCreateDialogOpen && (
          <div className="bg-white border-2 border-main   p-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
            <CreateProject
              teamSlug={teamSlug}
              onSuccess={() => setIsCreateDialogOpen(false)}
            />
          </div>
        )}

        {!isCreateDialogOpen && (
          <>
            {isError ? (
              <ErrorLoading />
            ) : isLoading ? (
              <LoadingSpin />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      teamSlug={teamSlug}
                    />
                  ))
                ) : (
                  <NoResultsFound />
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* Task Section */}
      <section className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <Heading name="Team Task" />
          <Button
            variant="ghost"
            className="bg-main-200 hover:bg-main-500 hover:text-white"
          >
            View All
          </Button>
        </div>
        <div className="  min-w-0">
          <AdminTaskTable
            tasks={tasks}
            isLoading={isTaskLoading}
            isError={isTaskError}
            teamSlug={teamSlug}
          />
        </div>
      </section>
    </div>
  );
}
