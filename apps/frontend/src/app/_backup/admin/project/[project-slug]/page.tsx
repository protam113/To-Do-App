'use client';

import { Button, Input } from '@/components/ui';
import { Container } from '@/components';
import { PushButton } from '@/components/button/push.button';
import { RefreshButton } from '@/components/button/refresh.button';
import { Header } from '@/components/design/header.design';
import { Heading } from '@/components/design';
import { CustomPagination } from '@/components/design';
import PageSizeSelect from '@/components/select/page_size-select';
import { ProjectTaskTable } from '@/components/table/project-task.table';
import { useProjectDetail } from '@/hooks/project/useProject';
import { TaskProjectList } from '@/libs/responses/taskLib';
import { Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const params = useParams();
  const projectSlug = Array.isArray(params['project-slug'])
    ? params['project-slug'][0]
    : params['project-slug'] || '';

  // STATE
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');

  const filters = {
    search: actualSearchQuery || undefined,
    page_size: pageSize,
  };

  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useProjectDetail(projectSlug, refreshKey);

  // TASK
  const { tasks, isLoading, isError, pagination } = TaskProjectList(
    currentPage,
    projectSlug,
    filters,
    refreshKey
  );

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.total_page) {
      setCurrentPage(page);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setActualSearchQuery(searchQuery.trim());
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActualSearchQuery('');
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Loading state
  if (isProjectLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
          </div>
        </div>
      </Container>
    );
  }

  // Error state
  if (isProjectError || !project) {
    return (
      <Container>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">Failed to load project</p>
            <Button onClick={handleRefresh}>Try Again</Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Project Header */}
      <Header title="Project Detail" />

      <section className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <Heading name={project.name} desc={project.description} />
          {project.team && (
            <p className="text-sm text-gray-500 mt-1">
              Team: {project.team.name}
            </p>
          )}
        </div>
      </section>

      {/* Task Section */}
      <section className="mt-8 space-y-4">
        <Heading name="Project Tasks" />

        <div className="md:flex col flex-col-2 md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search title (Press Enter)"
                className="pl-10 text-xs pr-8 rounded-md h-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {/* Clear search button */}
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <RefreshButton onClick={handleRefresh} />
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold">Show1:</span>
              <PageSizeSelect
                handlePageSizeChange={handlePageSizeChange}
                pageSize={pageSize}
              />
            </div>

            <div>
              <PushButton
                href={`/team/${project.team?.slug}/project/${projectSlug}/create-task`}
                label="Create Task"
              />
            </div>
          </div>
        </div>
        <div className="  min-w-0">
          <ProjectTaskTable
            tasks={tasks}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
        <CustomPagination
          currentPage={currentPage}
          totalPage={pagination.total_page}
          onPageChange={handlePageChange}
        />
      </section>
    </Container>
  );
}
