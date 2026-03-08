import { useQuery } from '@tanstack/react-query';
import { endpoints, handleAPI } from '@/apis';
import { FetchLogListResponse, FetchLogStat, Filters } from '@/types';
import { buildQueryParams, buildQueryParamsNoPage } from '@/utils';

const fetchLogList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchLogListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.logs}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching audit log list:', error);
    throw error;
  }
};

const useLogList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchLogListResponse, Error>({
    queryKey: ['logList', page, filters, refreshKey],
    queryFn: () => fetchLogList(page, filters),
    enabled: page > 0,
    staleTime: 60000,
  });
};

const fetchLogStat = async (filters: Filters): Promise<FetchLogStat> => {
  try {
    const queryString = buildQueryParamsNoPage(filters);

    const response = await handleAPI(
      `${endpoints.logs_stats}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching audit log list:', error);
    throw error;
  }
};

const useLogStat = (filters: Filters = {}, refreshKey: number) => {
  return useQuery<FetchLogStat, Error>({
    queryKey: ['logStat', filters, refreshKey],
    queryFn: () => fetchLogStat(filters),
    enabled: true,
    staleTime: 60000,
  });
};

export { useLogList, useLogStat };
