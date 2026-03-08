import { endpoints, handleAPI } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import type {
  Filters,
  UserActivityStatictis,
  UserGrowStat,
  UserOverviewStat,
  UserRoleStat,
} from '@/types';
// USER

const fetchUserOverviewStatis = async (): Promise<UserOverviewStat> => {
  try {
    const response = await handleAPI(
      `${endpoints.statistic_user_overview}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user overview statistics:', error);
    throw error;
  }
};

const useUserOverviewStatis = (refreshKey: number) => {
  return useQuery<UserOverviewStat, Error>({
    queryKey: ['statisUserOverview', refreshKey],
    queryFn: () => fetchUserOverviewStatis(),
    enabled: true,
    staleTime: 60000,
  });
};

const fetchUserGrowthStatis = async (
  filters: Filters
): Promise<UserGrowStat[]> => {
  const validFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== ''
    )
  );

  const queryString = new URLSearchParams(
    validFilters as Record<string, string>
  ).toString();

  try {
    const response = await handleAPI(
      `${endpoints.statistic_user_growth}${queryString ? `?${queryString}` : ''
      }`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user growth statistics:', error);
    throw error;
  }
};

const useUserGrowthStatis = (filters: Filters = {}, refreshKey: number) => {
  return useQuery<UserGrowStat[], Error>({
    queryKey: ['statisUserGrowth', refreshKey],
    queryFn: () => fetchUserGrowthStatis(filters),
    enabled: true,
    staleTime: 60000,
  });
};

const fetchUserRoleStatis = async (): Promise<UserRoleStat> => {
  try {
    const response = await handleAPI(`${endpoints.statistic_user_role}`, 'GET');
    return response.data;
  } catch (error) {
    console.error('Error fetching user role statistics:', error);
    throw error;
  }
};

const useUserRoleStatis = (refreshKey: number) => {
  return useQuery<UserRoleStat, Error>({
    queryKey: ['statisUserRole', refreshKey],
    queryFn: () => fetchUserRoleStatis(),
    enabled: true,
    staleTime: 60000,
  });
};

const fetchUserActivityStatis = async (): Promise<UserActivityStatictis> => {
  try {
    const response = await handleAPI(
      `${endpoints.statistic_user_activity}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user activity statistics:', error);
    throw error;
  }
};

const useUserActivityStatis = (refreshKey: number) => {
  return useQuery<UserActivityStatictis, Error>({
    queryKey: ['statisUserActivity', refreshKey],
    queryFn: () => fetchUserActivityStatis(),
    enabled: true,
    staleTime: 60000,
  });
};

export {
  useUserOverviewStatis,
  useUserGrowthStatis,
  useUserRoleStatis,
  useUserActivityStatis,
};
