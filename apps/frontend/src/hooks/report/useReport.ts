import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints, handleAPI } from '@/apis';
import type {
  FetchReportListResponse,
  Filters,
  ReportResponse,
  CreateReportDTO,
  CreateReportInput,
  UpdateReportStatusDTO,
  UpdateReportDTO,
} from '@/types';
import { buildQueryParams } from '@/utils';
import { toast } from 'sonner';
import { ERROR_MESSAGE } from '@/types';

const fetchReportProjectList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchReportListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.reports}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching report list:', error);
    throw error;
  }
};

const useReportList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchReportListResponse, Error>({
    queryKey: ['report', 'list', page, filters, refreshKey],
    queryFn: () => fetchReportProjectList(page, filters),
    enabled: page > 0,
    staleTime: 60000,
  });
};

// GET TASK DETAIL

const fetchReportDetail = async (id: string): Promise<ReportResponse> => {
  try {
    if (!endpoints.report) {
      throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
    }

    const response = await handleAPI(
      `${endpoints.report.replace(':id', id)}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching task detail:', error);
    throw error;
  }
};

const useReportDetail = (id: string, refreshKey: number) => {
  return useQuery<ReportResponse, Error>({
    queryKey: ['report', 'detail', id, refreshKey],
    queryFn: () => fetchReportDetail(id),
    enabled: true,
    staleTime: 30000,
  });
};

const createReport = async (createReportData: CreateReportDTO) => {
  try {
    const response = await handleAPI(
      `${endpoints.reports}`,
      'POST',
      createReportData
    );

    return response.data;
  } catch (error: any) {
    const errorMessages = error.response?.data?.ERROR_MESSAGE;
    let errorMessage = 'Failed to register';

    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
      // Take the first error ERROR_MESSAGE
      errorMessage = errorMessages[0];
    } else if (typeof errorMessages === 'string') {
      errorMessage = errorMessages;
    }

    throw new Error(errorMessage);
  }
};

const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createReportData: CreateReportInput) => {
      return createReport(createReportData as CreateReportDTO);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
      queryClient.invalidateQueries({ queryKey: ['list'] });
    },
    onError: (error: any) => {
      toast.error(error.ERROR_MESSAGE || 'Failed to register.');
      console.error(error.ERROR_MESSAGE || 'Failed to register.');
    },
  });
};

const UpdateStatus = async (
  updateReportStatus: UpdateReportStatusDTO,
  reportId: string
) => {
  if (!endpoints.report_status) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const response = await handleAPI(
      `${endpoints.report_status.replace(':id', reportId)}`,
      'PATCH',
      updateReportStatus
    );

    return response;
  } catch (error: any) {
    console.error('Error updating report status:', error.response?.data);
    throw new Error(
      error.response?.data?.ERROR_MESSAGE || 'Failed to update report status'
    );
  }
};

const useUpdateReportStatus = (reportId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateReportStatus: UpdateReportStatusDTO) => {
      return UpdateStatus(updateReportStatus, reportId);
    },
    onSuccess: () => {
      // Invalidate task detail for this specific task
      queryClient.invalidateQueries({
        queryKey: ['report', 'detail', 'list', reportId],
        exact: false,
      });
    },
  });
};

// REMOVE ATTACHMENT
const removeAttachment = async (reportId: string, attachmentId: string) => {
  if (!endpoints.report_delete_attachment) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const response = await handleAPI(
      `${endpoints.report_delete_attachment
        .replace(':id', reportId)
        .replace(':attachmentId', attachmentId)}`,
      'DELETE'
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.ERROR_MESSAGE || 'Failed to remove attachment';
    throw new Error(errorMessage);
  }
};

const useRemoveAttachment = (reportId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attachmentId: string) => {
      return removeAttachment(reportId, attachmentId);
    },
    onSuccess: () => {
      toast.success('Attachment removed successfully!');
      queryClient.invalidateQueries({
        queryKey: ['report', 'detail', reportId],
        exact: false,
      });
    },
    onError: (error: any) => {
      toast.error(error.ERROR_MESSAGE || 'Failed to remove attachment.');
    },
  });
};

const addAttachment = async (reportId: string, attachments: any[]) => {
  if (!endpoints.report_attachments) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const response = await handleAPI(
      `${endpoints.report_attachments.replace(':id', reportId)}`,
      'POST',
      attachments
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.ERROR_MESSAGE || 'Failed to add attachment';
    throw new Error(errorMessage);
  }
};

const useAddAttachment = (reportId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attachments: any[]) => {
      return addAttachment(reportId, attachments);
    },
    onSuccess: () => {
      toast.success('Attachment added successfully!');
      queryClient.invalidateQueries({
        queryKey: ['report', 'detail', reportId],
        exact: false,
      });
    },
    onError: (error: any) => {
      toast.error(error.ERROR_MESSAGE || 'Failed to add attachment.');
    },
  });
};

const deleteReport = async (reportId: string) => {
  try {
    if (!endpoints.report) {
      throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
    }

    const response = await handleAPI(
      `${endpoints.report.replace(':id', reportId)}`,
      'DELETE'
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.ERROR_MESSAGE || 'Failed to unassign task';
    throw new Error(errorMessage);
  }
};

const useDeleteReportId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string) => {
      return deleteReport(reportId);
    },
    onSuccess: () => {
      toast.success('Report deleted successfully!');
      queryClient.invalidateQueries({
        queryKey: ['report', 'detail'],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['task', 'list'] });
    },
    onError: (error: any) => {
      toast.error(error.ERROR_MESSAGE || 'Failed to unassign task.');
    },
  });
};

const updateReport = async (
  reportId: string,
  updateReportDto: UpdateReportDTO
) => {
  if (!endpoints.report) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const response = await handleAPI(
      `${endpoints.report.replace(':id', reportId)}`,
      'PATCH',
      updateReportDto
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.ERROR_MESSAGE || 'Failed to add attachment';
    throw new Error(errorMessage);
  }
};

const useUpdateReportDetail = (reportId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateReportDto: UpdateReportDTO) => {
      return updateReport(reportId, updateReportDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['report', 'detail', reportId],
        exact: false,
      });
    },
    onError: (error: any) => {
      toast.error(error.ERROR_MESSAGE || 'Failed to add attachment.');
    },
  });
};

export {
  useReportList,
  useCreateReport,
  useReportDetail,
  useUpdateReportStatus,
  useRemoveAttachment,
  useAddAttachment,
  useDeleteReportId,
  useUpdateReportDetail,
};
