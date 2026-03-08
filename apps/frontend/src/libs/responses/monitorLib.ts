import type { Filters } from '@/types';
import { useMonitorList } from '../../hooks/monitor/useMonitor';

export const MonitorList = (
  currentPage: number,
  filters: Filters,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useMonitorList(
    currentPage,
    filters,
    refreshKey
  );

  const pagination = data?.pagination ?? {
    page: 1,
    total_page: 1,
    total: 0,
  };

  const monitors = data?.results ?? [];

  return {
    monitors,
    isLoading,
    isError,
    pagination,
  };
};
