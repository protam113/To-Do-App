import { useQuery } from '@tanstack/react-query';
import { endpoints, handleAPI } from '@/apis';
import { FetchAuditLogListResponse, Filters } from '@/types';
import { buildQueryParams } from '@/utils';

/**
 * ==========================
 * 📌 @HOOK useAuditLogList
 * ==========================
 *
 * @desc Custom hook to get list of user
 * @returns {User} List of employee
 */

const fetchAuditLogList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchAuditLogListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.audit_log}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching audit log list:', error);
    throw error;
  }
};

const useAuditLogList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchAuditLogListResponse, Error>({
    queryKey: ['audit-logList', page, filters, refreshKey],
    queryFn: () => fetchAuditLogList(page, filters),
    enabled: page > 0,
    staleTime: 60000,
  });
};

export { useAuditLogList };
