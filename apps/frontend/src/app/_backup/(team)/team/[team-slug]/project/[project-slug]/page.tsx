'use client';

import { Input } from '@/components/ui';
import { Container } from '@/components';
import { PushButton } from '@/components/button/push.button';
import { RefreshButton } from '@/components/button/refresh.button';
import { Heading } from '@/components/design';
import { CustomPagination } from '@/components/design';
import PageSizeSelect from '@/components/select/page_size-select';
import MemberCard from '@/components/task/member.card';
import { TaskList } from '@/components/task/task.list';
import { TaskQuickPanel } from '@/components/task/task-quick-panel';
import { useProjectDetail } from '@/hooks/project/useProject';
import { TaskProjectList } from '@/libs/responses/taskLib';
import { useSelectedTaskContext } from '@/context/use-selected-task-context';
import { Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Split from 'react-split';
import '@/styles/split.css';

export default function Page() {
  const params = useParams();
  const { taskId, setTaskId } = useSelectedTaskContext();
  const projectSlug = Array.isArray(params['project-slug'])
    ? params['project-slug'][0]
    : params['project-slug'] || '';
  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : params['team-slug'] || '';
  // STATE
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');

  // Split layout configuration based on taskId state
  const splitSizes = taskId ? [60, 40] : [100, 0];
  const gutterSize = taskId ? 2 : 0;
  const minSize = taskId ? 400 : 0;

  const handleTaskSelect = (selectedTaskId: string) => {
    setTaskId(selectedTaskId);
  };

  const filters = {
    search: actualSearchQuery || undefined,
    page_size: pageSize,
  };

  // PROJECT DETAIL
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
    return null;
  }

  return (
    <div className="h-full border-t-2 border-t-nuetral-200">
      <Split
        className="split h-full"
        sizes={splitSizes}
        minSize={minSize}
        gutterSize={gutterSize}
        snapOffset={30}
        dragInterval={1}
      >
        <div className="overflow-auto">
          <section className="mt-8 space-y-4">
            <Heading name={project.name} desc={project.description} />

            <div className="md:flex col flex-col-2 md:flex-row justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search title (Press Enter)"
                    className="pl-10 pr-8 text-xs rounded-md h-10 bg-white"
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
                <MemberCard projectSlug={teamSlug} />
                <RefreshButton onClick={handleRefresh} />

                <div className="flex items-center gap-4">
                  <span className="text-xs text-main font-semibold">Show:</span>
                  <PageSizeSelect
                    handlePageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                  />
                </div>

                <div>
                  <PushButton
                    href={`/team/${teamSlug}/project/${projectSlug}/create-task`}
                    label="Create Task"
                  />
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <TaskList
                tasks={tasks}
                isLoading={isLoading}
                isError={isError}
                teamSlug={teamSlug}
                refreshKey={handleRefresh}
                onTaskSelect={handleTaskSelect}
              />
            </div>
            <CustomPagination
              currentPage={currentPage}
              totalPage={pagination.total_page}
              onPageChange={handlePageChange}
            />
          </section>
        </div>

        {/* Task Quick Panel */}
        <div className={taskId ? 'overflow-auto h-full' : 'hidden'}>
          <TaskQuickPanel />
        </div>
      </Split>
    </div>
  );
}
