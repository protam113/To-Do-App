import type { Filters } from '@/types';
import { useReportList } from '../../hooks/report/useReport';

export const ReportList = (
  currentPage: number,
  filters: Filters,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useReportList(
    currentPage,
    filters,
    refreshKey
  );

  const pagination = data?.pagination ?? {
    page: 1,
    total_page: 1,
    total: 0,
  };

  const reports = data?.results ?? [];

  return {
    reports,
    isLoading,
    isError,
    pagination,
  };
};
