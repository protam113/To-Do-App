import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { endpoints, handleAPI } from '@/apis';
import type { DeleteMedia, PresignItem } from '@/types';
import { ERROR_MESSAGE } from '@/types';

/**
 * ==========================
 * 📌 @HOOK usePresignMedia
 * ==========================
 **/

const CreatePresign = async (presignItem: PresignItem) => {
  try {
    const response = await handleAPI(
      `${endpoints.presign}`,
      'POST',
      presignItem
    );
    return response.data;
  } catch (error: any) {
    console.error('Error presign media:', error.response?.data);
    throw new Error(
      error.response?.data?.message || 'Failed to  presign media'
    );
  }
};

const usePresignMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (presignItem: PresignItem) => {
      return CreatePresign(presignItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaPresign'] });
    },
    onError: (error: any) => {
      console.error(error.message || 'Failed to presign media.');
    },
  });
};

/**
 * ========== END OF @HOOK usePresignMedia ==========
 */

const SubmitPresign = async (id: string) => {
  try {
    if (!endpoints.confirm) {
      throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
    }

    const response = await handleAPI(
      `${endpoints.confirm.replace(':id', id)}`,
      'POST'
    );
    return response.data;
  } catch (error: any) {
    console.error('Error submit media:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to submit media');
  }
};

const useSubmitMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return SubmitPresign(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaSubmit'] });
    },
    onError: (error: any) => {
      console.error(error.message || 'Failed to submit media.');
    },
  });
};

/**
 * ========== END OF @HOOK useSubmitMedia ==========
 */

/**
 * ==========================
 * 📌 @HOOK useUploadFile
 * ==========================
 **/

const uploadFileToUrl = async (uploadUrl: string, file: File) => {
  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data; // Return only the data part to be consistent
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
};

const useUploadFile = () => {
  return useMutation({
    mutationFn: async ({
      uploadUrl,
      file,
    }: {
      uploadUrl: string;
      file: File;
    }) => {
      return uploadFileToUrl(uploadUrl, file);
    },
    onSuccess: () => {
      toast.success('File uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload file.');
    },
  });
};

const DeleteMedia = async (deleteMediaDto: DeleteMedia) => {
  try {
    const response = await handleAPI(
      `${endpoints.delete_media}`,
      'DELETE',
      deleteMediaDto
    );
    return response.data;
  } catch (error: any) {
    console.error('Error submit media:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to submit media');
  }
};

const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deleteMediaDto: DeleteMedia) => {
      return DeleteMedia(deleteMediaDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deleteMedia'] });
    },
    onError: (error: any) => {
      console.error(error.message || 'Failed to submit media.');
    },
  });
};

/**
 * ========== END OF @HOOK useUploadFile ==========
 */

export { usePresignMedia, useSubmitMedia, useUploadFile, useDeleteMedia };
