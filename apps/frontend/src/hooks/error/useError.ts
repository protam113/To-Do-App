import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints, handleAPI } from '@/apis';
import type {
  FetchErrorListResponse,
  Filters,
  CreateTypeBySlugDTO,
  UpdateTypeBySlugDTO,
} from '@/types';
import { ERROR_MESSAGE } from '@/types';
import { buildQueryParams } from '@/utils';

const fetchErrorList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchErrorListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.errors}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching error list:', error);
    throw error;
  }
};

const useErrorList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchErrorListResponse, Error>({
    queryKey: ['error', 'list', page, filters, refreshKey],
    queryFn: () => fetchErrorList(page, filters),
    enabled: page > 0,
    staleTime: 60000,
  });
};

const CreateError = async (newType: CreateTypeBySlugDTO) => {
  try {
    const response = await handleAPI(`${endpoints.errors}`, 'POST', newType);

    return response;
  } catch (error: any) {
    console.error('Error creating error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to create error');
  }
};

const useCreateError = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newType: CreateTypeBySlugDTO) => {
      return CreateError(newType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['error', 'list'],
      });
    },
  });
};

const DeleteError = async (errorId: string) => {
  if (!endpoints.error) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const response = await handleAPI(
      `${endpoints.error.replace(':id', errorId)}`,
      'DELETE'
    );

    return response;
  } catch (error: any) {
    console.error('Error deleting error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to delete error');
  }
};

const useDeleteError = (errorId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return DeleteError(errorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['error'],
      });
    },
  });
};

const UpdateError = async (
  errorId: string,
  updateErrorDto: UpdateTypeBySlugDTO
) => {
  if (!endpoints.error) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const response = await handleAPI(
      `${endpoints.error.replace(':id', errorId)}`,
      'PATCH',
      updateErrorDto
    );

    return response;
  } catch (error: any) {
    console.error('Error updating error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to update error');
  }
};

const useUpdateError = (errorId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateErrorDto: UpdateTypeBySlugDTO) => {
      return UpdateError(errorId, updateErrorDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['error', 'list', errorId],
      });
    },
  });
};

export { useErrorList, useCreateError, useDeleteError, useUpdateError };
