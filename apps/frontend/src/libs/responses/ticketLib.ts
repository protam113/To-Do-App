import type { Filters } from '@/types';
import { useMyTicketList, useTicketList } from '../../hooks/ticket/useTicket';

export const TicketList = (
  currentPage: number,
  filters: Filters,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useTicketList(
    currentPage,
    filters,
    refreshKey
  );

  const pagination = data?.pagination ?? {
    page: 1,
    total_page: 1,
    total: 0,
  };

  const tickets = data?.results ?? [];

  return {
    tickets,
    isLoading,
    isError,
    pagination,
  };
};

export const MyTicketList = (
  currentPage: number,
  filters: Filters,
  refreshKey: number
) => {
  const { data, isLoading, isError } = useMyTicketList(
    currentPage,
    filters,
    refreshKey
  );

  const pagination = data?.pagination ?? {
    page: 1,
    total_page: 1,
    total: 0,
  };

  const tickets = data?.results ?? [];

  return {
    tickets,
    isLoading,
    isError,
    pagination,
  };
};
