import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints, handleAPI } from '@/apis';
import type { FetchRoleListResponse, Filters } from '@/types';
import { buildQueryParams } from '@/utils';

const fetchRoleList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchRoleListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.roles}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching role list:', error);
    throw error;
  }
};

const useRoleList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchRoleListResponse, Error>({
    queryKey: ['role', 'list', page, filters, refreshKey],
    queryFn: () => fetchRoleList(page, filters),
    enabled: page > 0,
    staleTime: 60000,
  });
};

export { useRoleList };
