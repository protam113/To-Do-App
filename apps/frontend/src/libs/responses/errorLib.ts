import type { Filters } from '@/types';
import { useErrorList } from '../../hooks/error/useError';

export const ErrorList = (
  currentPage: number,
  filters: Filters,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useErrorList(
    currentPage,
    filters,
    refreshKey
  );

  const pagination = data?.pagination ?? {
    page: 1,
    total_page: 1,
    total: 0,
  };

  const errors = data?.results ?? [];

  return {
    errors,
    isLoading,
    isError,
    pagination,
  };
};
