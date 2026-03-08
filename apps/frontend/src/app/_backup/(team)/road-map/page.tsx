'use client';

import { useState } from 'react';
import {
  Search,
  ChevronRight,
  ChevronDown,
  Plus,
  SquareChartGantt,
} from 'lucide-react';
import { Input, Button } from '@/components/ui';
import Split from 'react-split';
import { UserProjectList } from '@/libs/responses/projectLib';
import PageSizeSelect from '@/components/select/page_size-select';
import { RefreshButton } from '@/components/button/refresh.button';
import { truncateText } from '@/utils';
import { TaskList } from '@/components/task/task.list';
import { CustomPagination } from '@/components/design';
import { TaskProjectList } from '@/libs/responses/taskLib';
import { TaskQuickPanel } from '@/components/task/task-quick-panel';
import { useSelectedTaskContext } from '@/context/use-selected-task-context';
import '@/styles/split.css';

// Component for expanded project tasks
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
  const { taskId, setTaskId } = useSelectedTaskContext();
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualSearchQuery, setActualSearchQuery] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set()
  );

  // Split layout configuration based on taskId state
  const splitSizes = taskId ? [60, 40] : [100, 0];
  const gutterSize = taskId ? 2 : 0;
  const minSize = taskId ? 400 : 0;

  const params = {
    search: actualSearchQuery || undefined,
    page_size: pageSize,
  };

  const { projects, isLoading, isError, pagination } = UserProjectList(
    currentPage,
    params,
    refreshKey
  );

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
        <div className="min-h-screen bg-white overflow-auto">
          {/* Header */}
          <header className="border-b bg-white px-6 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search title (Press Enter)"
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

              <div className="flex items-center gap-4">
                <RefreshButton onClick={handleRefresh} />
                <div className="flex items-center gap-4">
                  <span className="text-xs text-main font-semibold">Show:</span>
                  <PageSizeSelect
                    handlePageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                  />
                </div>
                <Button variant="ghost" size="sm">
                  Epic
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  Type
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            <div className="space-y-1">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading projects...
                </div>
              ) : isError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading projects
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No projects found
                </div>
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
                        {project.team && (
                          <span className="text-xs text-gray-400 ml-2">
                            ({project.team.name})
                          </span>
                        )}
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
                          teamSlug={project.team?.slug || ''}
                          refreshKey={refreshKey}
                          onRefresh={handleRefresh}
                          onTaskSelect={handleTaskSelect}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <CustomPagination
              currentPage={currentPage}
              totalPage={pagination.total_page}
              onPageChange={handlePageChange}
            />
          </main>
        </div>

        {/* Task Quick Panel */}
        <div className={taskId ? 'overflow-auto h-full' : 'hidden'}>
          <TaskQuickPanel />
        </div>
      </Split>
    </div>
  );
}
