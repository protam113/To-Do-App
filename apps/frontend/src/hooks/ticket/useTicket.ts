import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endpoints, handleAPI } from '../../apis';
import type {
  FetchTicketListResponse,
  Filters,
  TicketResponse,
  CreateTicketDTO,
} from '@/types';
import { buildQueryParams } from '../../utils';
import { ERROR_MESSAGE } from '@/types';

// tickets
// my_tickets
// ticket_status

const fetchTicketList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchTicketListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.tickets}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket list:', error);
    throw error;
  }
};

const useTicketList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchTicketListResponse, Error>({
    queryKey: ['ticket', 'list', page, filters, refreshKey],
    queryFn: () => fetchTicketList(page, filters),
    enabled: page > 0,
    staleTime: 60000,
  });
};

const fetchMyTicketList = async (
  pageParam = 1,
  filters: Filters
): Promise<FetchTicketListResponse> => {
  try {
    const queryString = buildQueryParams(filters, pageParam);

    const response = await handleAPI(
      `${endpoints.my_tickets}${queryString ? `?${queryString}` : ''}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching my ticket list:', error);
    throw error;
  }
};

const useMyTicketList = (
  page: number,
  filters: Filters = {},
  refreshKey: number
) => {
  return useQuery<FetchTicketListResponse, Error>({
    queryKey: ['ticket', 'list', 'my', page, filters, refreshKey],
    queryFn: () => fetchMyTicketList(page, filters),
    enabled: page > 0,
    staleTime: 60000,
  });
};

const fetchTicketDetail = async (id: string): Promise<TicketResponse> => {
  try {
    if (!endpoints.ticket) {
      throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
    }

    const response = await handleAPI(
      `${endpoints.ticket.replace(':id', id)}`,
      'GET'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching task detail:', error);
    throw error;
  }
};

const useTicketDetail = (id: string, refreshKey: number) => {
  return useQuery<TicketResponse, Error>({
    queryKey: ['ticket', 'detail', id, refreshKey],
    queryFn: () => fetchTicketDetail(id),
    enabled: true,
    staleTime: 30000,
  });
};

const CreateTicket = async (newTicket: CreateTicketDTO) => {
  try {
    const response = await handleAPI(`${endpoints.tickets}`, 'POST', newTicket);

    return response;
  } catch (error: any) {
    console.error('Error creating ticket:', error.response?.data);
    throw new Error(
      error.response?.data?.ERROR_MESSAGE || 'Failed to create ticket'
    );
  }
};

const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTicket: CreateTicketDTO) => {
      return CreateTicket(newTicket);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticket'],
      });
    },
  });
};

const UpdateTicket = async (status: string, id: string) => {
  if (!endpoints.ticket_status) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const response = await handleAPI(
      `${endpoints.ticket_status.replace(':id', id)}`,
      'PATCH',
      status
    );

    return response;
  } catch (error: any) {
    console.error('Error updating ticket:', error.response?.data);
    throw new Error(
      error.response?.data?.ERROR_MESSAGE || 'Failed to update ticket'
    );
  }
};

const useUpdateTicket = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: any) => {
      return UpdateTicket(status, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ticket'],
      });
    },
  });
};

const DeleteTicket = async (ticketId: string) => {
  if (!endpoints.ticket) {
    throw new Error(ERROR_MESSAGE.ENPOINT_ERROR);
  }
  try {
    const response = await handleAPI(
      `${endpoints.ticket.replace(':id', ticketId)}`,
      'DELETE'
    );

    return response;
  } catch (error: any) {
    console.error('Error deleting error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to delete error');
  }
};

const useDeleteTicket = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return DeleteTicket(ticketId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['error'],
      });
    },
  });
};

export {
  useTicketList,
  useMyTicketList,
  useCreateTicket,
  useTicketDetail,
  useUpdateTicket,
  useDeleteTicket,
};
