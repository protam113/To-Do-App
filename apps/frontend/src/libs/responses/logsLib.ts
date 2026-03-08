import type { Filters } from '@/types';
import { useLogList } from '@/hooks';

export const LogList = (
  currentPage: number,
  filters: Filters,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useLogList(
    currentPage,
    filters,
    refreshKey
  );

  const pagination = data?.pagination ?? {
    page: 1,
    total_page: 1,
    total: 0,
  };

  const logs = data?.results ?? [];

  return {
    logs,
    isLoading,
    isError,
    pagination,
  };
};
