'use client';

import { Button, Input } from '@/components/ui';
import { Heading } from '@/components/design';
import { TaskTable } from '@/components/pages/task/task.table';
import { TeamProjectList } from '@/libs/responses/projectLib';
import { TaskTeamList, TaskProjectList } from '@/libs/responses/taskLib';
import { useParams, useRouter } from 'next/navigation';
import CreateProject from '@/components/pages/project/create-project';
import { useState } from 'react';
import NoResultsFound from '@/components/design/no_result.design';
import { LoadingSpin } from '@/components/loading/spin';
import { CustomPagination } from '@/components/design';
import { RefreshButton } from '@/components/button/refresh.button';
import {
  Search,
  ChevronRight,
  ChevronDown,
  Plus,
  SquareChartGantt,
} from 'lucide-react';
import { ErrorLoading } from '@/components/loading/error';
import { TeamProjectCard } from '@/components/card/team-project.card';
import PageSizeSelect from '@/components/select/page_size-select';
import { ComponentsIcons } from '@/assets/icons';
import { TaskList } from '@/components/task/task.list';
import { truncateText } from '@/utils';
import Split from 'react-split';
import { TaskQuickPanel } from '@/components/task/task-quick-panel';
import { useSelectedTaskContext } from '@/context/use-selected-task-context';
import '@/styles/split.css';

type ViewMode = 'table' | 'roadmap';

// Component for expanded project tasks in roadmap view
function ProjectTasks({
  projectSlug,
  teamSlug,
  refreshKey,
  onRefresh,
  onTaskSelect,
}: {
  projectSlug: string;
  teamSlug: string;
  refreshKey: number;
  onRefresh: () => void;
  onTaskSelect: (taskId: string) => void;
}) {
  const [taskPage, setTaskPage] = useState(1);
  const taskParams = { page_size: 10 };

  const { tasks, isLoading, isError, pagination } = TaskProjectList(
    taskPage,
    projectSlug,
    taskParams,
    refreshKey
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.total_page) {
      setTaskPage(page);
    }
  };

  return (
    <div className="ml-9 space-y-1">
      <div className="min-w-0">
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          isError={isError}
          teamSlug={teamSlug}
          refreshKey={onRefresh}
          onTaskSelect={onTaskSelect}
          projectSlug={projectSlug}
        />
      </div>
      {pagination.total_page > 1 && (
        <CustomPagination
          currentPage={taskPage}
          totalPage={pagination.total_page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default function Page() {
  const params = useParams();
  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : params['team-slug'] || '';
  const router = useRouter();
  const { taskId, setTaskId } = useSelectedTaskContext();

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Split layout configuration based on taskId state
  const splitSizes = taskId ? [60, 40] : [100, 0];
  const gutterSize = taskId ? 2 : 0;
  const minSize = taskId ? 400 : 0;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [projectRefreshKey, setProjectRefreshKey] = useState(0);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );

  const projectFilters = { page_size: viewMode === 'table' ? 4 : 100 };
  const taskFilters = {
    search: actualSearchQuery || undefined,
    page_size: pageSize,
  };

  // PROJECT
  const { projects, isLoading, isError } = TeamProjectList(
    1,
    teamSlug,
    projectFilters,
    projectRefreshKey
  );

  // TASK (only for table view)
  const {
    tasks,
    isLoading: isTaskLoading,
    isError: isTaskError,
    pagination,
  } = TaskTeamList(currentPage, teamSlug, taskFilters, refreshKey);

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

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

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setProjectRefreshKey((prev) => prev + 1);
  };

  const handleTaskSelect = (selectedTaskId: string) => {
    setTaskId(selectedTaskId);
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

  return (
    <div className="h-full border-t-2 border-t-neutral-200">
      <Split
        className="split h-full"
        sizes={splitSizes}
        minSize={minSize}
        gutterSize={gutterSize}
        snapOffset={30}
        dragInterval={1}
      >
        <div className="min-h-screen bg-white overflow-auto p-4">
          {/* View Toggle */}
          <div className="flex justify-end space-x-2 mb-4">
            <Button
              variant="ghost"
              className={`flex items-center space-x-2 p-2 border ${
                viewMode === 'table'
                  ? 'bg-main text-white border-main'
                  : 'border-main-400'
              }`}
              onClick={() => setViewMode('table')}
            >
              <ComponentsIcons.TableProperties />
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center space-x-2 p-2 border ${
                viewMode === 'roadmap'
                  ? 'bg-main text-white border-main'
                  : 'border-main-400'
              }`}
              onClick={() => setViewMode('roadmap')}
            >
              <ComponentsIcons.ChartNoAxesGanttIcon />
            </Button>
          </div>

          {viewMode === 'table' ? (
            // TABLE VIEW
            <>
              {/* Project Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <Heading name="Team Project" />
                  <div className="space-x-2 flex">
                    <Button
                      onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
                      className={
                        isCreateDialogOpen
                          ? 'border-b-2 border-b-main text-main'
                          : 'border-b-2 border-b-main hover:bg-main-800 hover:text-white'
                      }
                    >
                      {isCreateDialogOpen ? 'Cancel' : 'Create Project'}
                    </Button>
                    <Button
                      variant="ghost"
                      className="bg-main-200 hover:bg-main-500 hover:text-white"
                      onClick={() => router.push(`/team/${teamSlug}/project`)}
                    >
                      View All
                    </Button>
                  </div>
                </div>

                {isCreateDialogOpen && (
                  <div className="bg-white border-2 border-main p-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                    <CreateProject
                      teamSlug={teamSlug}
                      onSuccess={() => {
                        setIsCreateDialogOpen(false);
                        setProjectRefreshKey((prev) => prev + 1);
                      }}
                    />
                  </div>
                )}

                {!isCreateDialogOpen && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {isLoading ? (
                      <div className="col-span-full flex justify-center py-8">
                        <LoadingSpin />
                      </div>
                    ) : isError ? (
                      <div className="col-span-full text-center py-8">
                        <ErrorLoading />
                      </div>
                    ) : projects.length > 0 ? (
                      projects.map((project) => (
                        <TeamProjectCard
                          key={project.id}
                          project={project}
                          teamSlug={teamSlug}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center">
                        <NoResultsFound />
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Task Section */}
              <section className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <Heading name="Team Task" />
                </div>
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
                      <span className="text-xs text-main font-semibold">
                        Show:
                      </span>
                      <PageSizeSelect
                        handlePageSizeChange={handlePageSizeChange}
                        pageSize={pageSize}
                      />
                    </div>
                  </div>
                </div>
                <div className="min-w-0">
                  <TaskTable
                    tasks={tasks}
                    isLoading={isTaskLoading}
                    isError={isTaskError}
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
            </>
          ) : (
            // ROADMAP VIEW
            <div className="bg-white rounded-lg">
              <header className="border-b px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search project (Press Enter)"
                      className="pl-10 pr-8 rounded-md h-10 bg-gray-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                    />
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
                </div>
              </header>

              <main className="p-6">
                <div className="space-y-1">
                  {isLoading ? (
                    <LoadingSpin />
                  ) : isError ? (
                    <ErrorLoading />
                  ) : projects.length === 0 ? (
                    <NoResultsFound />
                  ) : (
                    projects.map((project) => {
                      const isExpanded = expandedProjects.has(project.id);
                      return (
                        <div key={project.id}>
                          <div
                            onClick={() => toggleProject(project.id)}
                            className="group flex w-full items-center gap-3 rounded px-2 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <div className="shrink-0">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                              )}
                            </div>
                            <div className="shrink-0 h-5 w-5 rounded bg-main text-white flex items-center justify-center">
                              <SquareChartGantt size={18} />
                            </div>
                            <span className="font-medium text-gray-600 text-sm">
                              {truncateText(project.id, 10)}
                            </span>
                            <span className="font-medium text-sm">
                              {project.name}
                            </span>
                            <div className="ml-auto flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {isExpanded && (
                            <ProjectTasks
                              projectSlug={project.slug}
                              teamSlug={teamSlug}
                              refreshKey={refreshKey}
                              onRefresh={handleRefresh}
                              onTaskSelect={handleTaskSelect}
                            />
                          )}
                        </div>
                      );
                    })
                  )}

                  <button
                    className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                    onClick={() => setIsCreateDialogOpen(!isCreateDialogOpen)}
                  >
                    {isCreateDialogOpen ? (
                      'Cancel'
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Create Project</span>
                      </>
                    )}
                  </button>

                  {isCreateDialogOpen && (
                    <div className="bg-white border-2 border-main p-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                      <CreateProject
                        teamSlug={teamSlug}
                        onSuccess={() => {
                          setIsCreateDialogOpen(false);
                          setProjectRefreshKey((prev) => prev + 1);
                        }}
                      />
                    </div>
                  )}
                </div>
              </main>
            </div>
          )}
        </div>

        {/* Task Quick Panel */}
        <div className={taskId ? 'overflow-auto h-full' : 'hidden'}>
          <TaskQuickPanel />
        </div>
      </Split>
    </div>
  );
}
