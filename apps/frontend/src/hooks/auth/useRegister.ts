import { useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints, handleAPI } from '@/apis';
import { toast } from 'sonner';
import { RegisterAccountData, UpdatePasswordDto } from '@/types';

const regiterAccount = async (registerData: RegisterAccountData) => {
  try {
    const response = await handleAPI(
      `${endpoints.register}`,
      'POST',
      registerData
    );

    return response.data;
  } catch (error: any) {
    const errorMessages = error.response?.data?.message;
    let errorMessage = 'Failed to register';

    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
      // Take the first error message
      errorMessage = errorMessages[0];
    } else if (typeof errorMessages === 'string') {
      errorMessage = errorMessages;
    }

    throw new Error(errorMessage);
  }
};

const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registerData: RegisterAccountData) => {
      return regiterAccount(registerData);
    },
    onSuccess: () => {
      toast.success('Create User Success!');
      queryClient.invalidateQueries({ queryKey: ['user', 'list', 'auth'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create user.');
      console.error(
        '  Create user error:',
        error.message || 'Failed to create user.'
      );
    },
  });
};

const changePassword = async (updatePassword: UpdatePasswordDto) => {
  try {
    const response = await handleAPI(
      `${endpoints.change_password}`,
      'POST',
      updatePassword
    );

    return response.data;
  } catch (error: any) {
    const errorMessages = error.response?.data?.message;
    let errorMessage = 'Failed to register';

    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
      // Take the first error message
      errorMessage = errorMessages[0];
    } else if (typeof errorMessages === 'string') {
      errorMessage = errorMessages;
    }

    throw new Error(errorMessage);
  }
};

const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatePassword: UpdatePasswordDto) => {
      return changePassword(updatePassword);
    },
    onSuccess: () => {
      toast.success('Create User Success!');
      queryClient.invalidateQueries({ queryKey: ['user', 'list', 'auth'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create user.');
      console.error(
        '  Create user error:',
        error.message || 'Failed to create user.'
      );
    },
  });
};
//
export { useRegister, useChangePassword };
