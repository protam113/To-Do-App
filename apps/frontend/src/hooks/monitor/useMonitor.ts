import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints, handleAPI } from '@/apis';
import type {
  AccessCode,
  FetchMonitorListResponse,
  Filters,
  MonitorAuthConfigResponse,
  CreateMonitorDTO, CreateMonitorInput
} from '@/types';
import { buildQueryParams } from '@/utils';
import { toast } from 'sonner';
import { ERROR_MESSAGE } from '@/types';

const fetchMonitorList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchMonitorListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.monitors}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching monitor list:', error);
    throw error;
  }
};

const useMonitorList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchMonitorListResponse, Error>({
    queryKey: ['monitor', 'list', page, filters, refreshKey],
    queryFn: () => fetchMonitorList(page, filters),
    enabled: page > 0,
    staleTime: 60000,
  });
};

const addMatric = async (addMatricData: CreateMonitorDTO) => {
  try {
    const response = await handleAPI(
      `${endpoints.monitors}`,
      'POST',
      addMatricData
    );

    return response.data;
  } catch (error: any) {
    const errorERROR_MESSAGEs = error.response?.data?.ERROR_MESSAGE;
    let errorERROR_MESSAGE = 'Failed to register';

    if (Array.isArray(errorERROR_MESSAGEs) && errorERROR_MESSAGEs.length > 0) {
      // Take the first error ERROR_MESSAGE
      errorERROR_MESSAGE = errorERROR_MESSAGEs[0];
    } else if (typeof errorERROR_MESSAGEs === 'string') {
      errorERROR_MESSAGE = errorERROR_MESSAGEs;
    }

    throw new Error(errorERROR_MESSAGE);
  }
};

const useAddMatric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addMatricData: CreateMonitorInput) => {
      return addMatric(addMatricData as CreateMonitorDTO);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitor'] });
      queryClient.invalidateQueries({ queryKey: ['list'] });
    },
    onError: (error: any) => {
      toast.error(error.ERROR_MESSAGE || 'Failed to register.');
      console.error(error.ERROR_MESSAGE || 'Failed to register.');
    },
  });
};

const toggleMonitorActive = async (monitorId: string): Promise<any> => {
  if (!endpoints.monitor_active) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const url = endpoints.monitor_active.replace(':id', monitorId);
    console.log('Toggle active URL:', url);
    const response = await handleAPI(url, 'PATCH');
    return response.data;
  } catch (error) {
    console.error('Error toggling monitor status:', error);
    throw error;
  }
};

export const useToggleMonitorActive = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { monitorId: string }>({
    mutationFn: ({ monitorId }) => toggleMonitorActive(monitorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitor', 'list'] });
    },
  });
};

const generateCode = async (monitorId: string): Promise<AccessCode> => {
  if (!endpoints.generate_code) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const url = endpoints.generate_code.replace(':monitorId', monitorId);
    const response = await handleAPI(url, 'POST');
    return response.data;
  } catch (error) {
    console.error('Error toggling monitor status:', error);
    throw error;
  }
};

export const useGenerateCode = () => {
  const queryClient = useQueryClient();

  return useMutation<AccessCode, Error, { monitorId: string }>({
    mutationFn: ({ monitorId }) => generateCode(monitorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['code'] });
    },
  });
};

const deleteMatric = async (matricId: string): Promise<any> => {
  if (!endpoints.monitor) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const url = endpoints.monitor.replace(':id', matricId);
    const response = await handleAPI(url, 'DELETE');
    return response.data;
  } catch (error) {
    console.error('Error toggling monitor status:', error);
    throw error;
  }
};

export const useDeleteMatric = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { matricId: string }>({
    mutationFn: ({ matricId }) => deleteMatric(matricId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitor', 'list'] });
    },
  });
};

const deleteCode = async (code: string): Promise<any> => {
  if (!endpoints.code) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const url = endpoints.code.replace(':code', code);
    const response = await handleAPI(url, 'DELETE');
    return response.data;
  } catch (error) {
    console.error('Error toggling monitor status:', error);
    throw error;
  }
};

export const useDeleteCode = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { code: string }>({
    mutationFn: ({ code }) => deleteCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['code'] });
    },
  });
};

const fetchMonitorConfig = async (
  monitorId: string,
  accessCode: string
): Promise<MonitorAuthConfigResponse> => {
  try {
    if (!endpoints.get_auth) {
      throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
    }

    const response = await handleAPI(
      `${endpoints.get_auth.replace(':monitorId', monitorId)}`,
      'GET',
      undefined,
      { 'x-access-code': accessCode }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching monitor config:', error);
    throw error;
  }
};

export const useGetMonitorConfig = () => {
  return useMutation<
    MonitorAuthConfigResponse,
    Error,
    { monitorId: string; accessCode: string }
  >({
    mutationFn: ({ monitorId, accessCode }) =>
      fetchMonitorConfig(monitorId, accessCode),
  });
};

export { useMonitorList, useAddMatric, fetchMonitorConfig };
