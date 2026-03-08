import type { Filters } from '@/types';
import { useAuthUserList, useUserList } from '../../hooks/user/useUser';

export const UserList = (
  currentPage: number,
  filters: Filters,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useUserList(
    currentPage,
    filters,
    refreshKey
  );

  const pagination = data?.pagination ?? {
    page: 1,
    total_page: 1,
    total: 0,
  };

  const users = data?.results ?? [];

  return {
    users,
    isLoading,
    isError,
    pagination,
  };
};

export const AuthUserList = (
  currentPage: number,
  filters: Filters,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useAuthUserList(
    currentPage,
    filters,
    refreshKey
  );

  const pagination = data?.pagination ?? {
    page: 1,
    total_page: 1,
    total: 0,
  };

  const users = data?.results ?? [];

  return {
    users,
    isLoading,
    isError,
    pagination,
  };
};
