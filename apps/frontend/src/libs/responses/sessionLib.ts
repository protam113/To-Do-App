import type { Filters } from '@/types';
import {
  useSessionList,
  useUserSessionList,
} from '../../hooks/session/useAdminSession';

export const SessionList = (
  currentPage: number,
  filters: Filters,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useSessionList(
    currentPage,
    filters,
    refreshKey
  );

  const pagination = data?.pagination ?? {
    page: 1,
    total_page: 1,
    total: 0,
  };

  const session = data?.results ?? [];

  return {
    session,
    isLoading,
    isError,
    pagination,
  };
};

export const MySessionList = (
  currentPage: number,
  filters: Filters,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useUserSessionList(
    currentPage,
    filters,
    refreshKey
  );

  const pagination = data?.pagination ?? {
    page: 1,
    total_page: 1,
    total: 0,
  };

  const session = data?.results ?? [];

  return {
    session,
    isLoading,
    isError,
    pagination,
  };
};
