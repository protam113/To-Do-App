// admin_sessions;
// admin_session;
// admin_user_session;

import { endpoints, handleAPI } from '../../apis';
import { useQuery } from '@tanstack/react-query';
import type { Filters, FetchSessionListResponse } from '@/types';
import { buildQueryParams } from '../../utils';

const fetchSessionList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchSessionListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.admin_sessions}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching session list:', error);
    throw error;
  }
};

const useSessionList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchSessionListResponse, Error>({
    queryKey: ['sessionList', page, filters, refreshKey],
    queryFn: () => fetchSessionList(page, filters),
    enabled: page > 0,
    staleTime: 60000,
  });
};

const fetchUserSessionList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchSessionListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);
    const response = await handleAPI(
      `${endpoints.my_sessions}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user session list:', error);
    throw error;
  }
};

const useUserSessionList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchSessionListResponse, Error>({
    queryKey: ['sessionList', page, filters, refreshKey],
    queryFn: () => fetchUserSessionList(page, filters),
    enabled: page > 0,
    staleTime: 60000,
  });
};

export { useSessionList, useUserSessionList };
