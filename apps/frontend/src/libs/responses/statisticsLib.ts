import type { Filters } from '@/types';
import {
  useUserActivityStatis,
  useUserGrowthStatis,
  useUserOverviewStatis,
  useUserRoleStatis,
} from '../../hooks/statistics/useStatisticUser';

export const UserOverviewStatis = (refreshKey: number) => {
  const { data, isLoading, isError } = useUserOverviewStatis(refreshKey);

  const statistics = data;

  return {
    statistics,
    isLoading,
    isError,
  };
};

export const UserGrowStatis = (refreshKey: number, filters: Filters) => {
  const { data, isLoading, isError } = useUserGrowthStatis(filters, refreshKey);

  const statistics = data ?? [];

  return {
    statistics,
    isLoading,
    isError,
  };
};

export const UserRoleStatis = (refreshKey: number) => {
  const { data, isLoading, isError } = useUserRoleStatis(refreshKey);

  const statistics = data?.roles ?? [];

  return {
    statistics,
    isLoading,
    isError,
  };
};

export const UserRoleActivity = (refreshKey: number) => {
  const { data, isLoading, isError } = useUserActivityStatis(refreshKey);

  const statistics = data;

  return {
    statistics,
    isLoading,
    isError,
  };
};
