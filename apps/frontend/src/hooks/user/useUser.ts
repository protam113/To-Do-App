import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints, handleAPI } from '../../apis';
import type {
  FetchAuthUserListResponse,
  FetchUserListResponse,
  Filters,
  BlockedUsersDTO,
  UpdateAvatarDTO,
} from '@/types';
import { buildQueryParams } from '../../utils';
import { ERROR_MESSAGE } from '@/types';

/**
 * ==========================
 * 📌 @HOOK useUserList
 * ==========================
 *
 * @desc Custom hook to get list of user
 * @returns {User} List of employee
 */

const fetchUserList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchUserListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.users}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user list:', error);
    throw error;
  }
};

const useUserList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchUserListResponse, Error>({
    queryKey: ['user', 'list', page, filters, refreshKey],
    queryFn: () => fetchUserList(page, filters),
    enabled: page > 0, // Bật query nếu page hợp lệ
    staleTime: 60000,
  });
};

const fetchAuthUserList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchAuthUserListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.user_list}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching auth user list:', error);
    throw error;
  }
};

const useAuthUserList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchAuthUserListResponse, Error>({
    queryKey: ['user', 'list', 'auth', page, filters, refreshKey],
    queryFn: () => fetchAuthUserList(page, filters),
    enabled: page > 0, // Bật query nếu page hợp lệ
    staleTime: 60000,
  });
};

const promoteManager = async (userId: string) => {
  if (!endpoints.promote_manager) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const response = await handleAPI(
      `${endpoints.promote_manager.replace(':id', userId)}`,
      'PATCH'
    );

    return response.data;
  } catch (error: any) {
    console.error('Error creating manager:', error.response?.data);

    // Extract error messages from rsponse
    const errorMessages = error.response?.data?.ERROR_MESSAGE;
    let errorMessage = 'Failed to create manager';

    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
      // Take the first error ERROR_MESSAGE
      errorMessage = errorMessages[0];
    } else if (typeof errorMessages === 'string') {
      errorMessage = errorMessages;
    }

    throw new Error(errorMessage);
  }
};

const usePromoteManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return promoteManager(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      console.error(error.ERROR_MESSAGE || 'Failed to create employee.');
    },
  });
};

const demoteManager = async (userId: string) => {
  if (!endpoints.demote_manager) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const response = await handleAPI(
      `${endpoints.demote_manager.replace(':id', userId)}`,
      'PATCH'
    );

    return response.data;
  } catch (error: any) {
    console.error('Error creating manager:', error.response?.data);

    // Extract error messages from rsponse
    const errorMessages = error.response?.data?.ERROR_MESSAGE;
    let errorMessage = 'Failed to create manager';

    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
      // Take the first error ERROR_MESSAGE
      errorMessage = errorMessages[0];
    } else if (typeof errorMessages === 'string') {
      errorMessage = errorMessages;
    }

    throw new Error(errorMessage);
  }
};

const useDemoteManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return demoteManager(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      console.error(error.ERROR_MESSAGE || 'Failed to create employee.');
    },
  });
};

// /**
//  * ========== END OF @HOOK useCreateEmployee ==========
//  */

const UpdateAvartar = async (updateAvatar: UpdateAvatarDTO) => {
  try {
    const response = await handleAPI(
      `${endpoints.profile_avatar}`,
      'PATCH',
      updateAvatar
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating avatar:', error.response?.data);
    throw new Error(
      error.response?.data?.ERROR_MESSAGE || 'Failed to update avatar'
    );
  }
};

const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateAvatar: UpdateAvatarDTO) => {
      return UpdateAvartar(updateAvatar);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      console.error(error.ERROR_MESSAGE || 'Failed to update avatar.');
    },
  });
};

const deleteUsers = async (deleteUsersDto: BlockedUsersDTO) => {
  try {
    const response = await handleAPI(
      `${endpoints.delete_users}`,
      'PATCH',
      deleteUsersDto
    );

    return response.data;
  } catch (error: any) {
    console.error('Error deleting users:', error.response?.data);
    throw new Error(
      error.response?.data?.ERROR_MESSAGE || 'Failed to delete users'
    );
  }
};

const useDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deleteUsersDto: BlockedUsersDTO) => {
      return deleteUsers(deleteUsersDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      console.error(error.ERROR_MESSAGE || 'Failed to delete users.');
    },
  });
};

const deleteUser = async (userId: string) => {
  if (!endpoints.delete_user) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }

  try {
    const response = await handleAPI(
      `${endpoints.delete_user.replace(':id', userId)}`,
      'DELETE'
    );

    return response.data;
  } catch (error: any) {
    console.error('Error deleting user:', error.response?.data);
    throw new Error(
      error.response?.data?.ERROR_MESSAGE || 'Failed to delete user'
    );
  }
};

const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      console.error(error.ERROR_MESSAGE || 'Failed to delete user.');
    },
  });
};

export {
  useUserList,
  useAuthUserList,
  usePromoteManager,
  useUpdateAvatar,
  useDeleteUsers,
  useDeleteUser,
  useDemoteManager,
};
//
