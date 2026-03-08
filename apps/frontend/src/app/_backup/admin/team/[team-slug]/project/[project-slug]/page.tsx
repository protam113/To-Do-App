'use client';

import { Button, Input } from '@/components/ui';
import { Container } from '@/components';
import { RefreshButton } from '@/components/button/refresh.button';
import { Heading } from '@/components/design';
import { CustomPagination } from '@/components/design';
import PageSizeSelect from '@/components/select/page_size-select';
import { AdminTaskTable } from '@/components/table/admin-task-table.table';
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
  const teamSlug = Array.isArray(params['team-slug'])
    ? params['team-slug'][0]
    : params['team-slug'] || '';
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
    <Container className=" p-6   min-h-screen">
      <section className="grid grid-cols-2 gap-6">
        <div>
          <Heading name={project.name} desc={project.description} />
          {project.team && (
            <p className="text-sm text-gray-500 mt-1">
              Team: {project.team.name}
            </p>
          )}
        </div>

        <div>
          <Heading name="Member" desc="List of project members" />
          {/* <MemberList projectSlug={projectSlug} /> */}
        </div>
      </section>

      {/* Task Section */}
      <section className="mt-8 space-y-4">
        <Heading name="Project Task" />

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
              <span className="text-xs text-main font-semibold">Show:</span>
              <PageSizeSelect
                handlePageSizeChange={handlePageSizeChange}
                pageSize={pageSize}
              />
            </div>

            {/* <div className="flex items-center gap-4">
              <span className="text-xs font-semibold">Role :</span>
              <Select onValueChange={handleRoleChange}>
                <SelectTrigger className="w-[120px] h-10 rounded-md px-4">
                  <SelectValue placeholder="all" />
                </SelectTrigger>
                <SelectContent
                  className="rounded-md bg-white min-w-[120px]"
                  align="start"
                >
                  <SelectItem value="all" className="rounded-md">
                    All
                  </SelectItem>
                  <SelectItem value="admin" className="rounded-md">
                    Admin
                  </SelectItem>
                  <SelectItem value="manager" className="rounded-md">
                    Manager
                  </SelectItem>
                  <SelectItem value="manager" className="rounded-md">
                    User
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </div>
        <div className=" min-w-0">
          <AdminTaskTable
            tasks={tasks}
            isLoading={isLoading}
            isError={isError}
            teamSlug={teamSlug}
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
