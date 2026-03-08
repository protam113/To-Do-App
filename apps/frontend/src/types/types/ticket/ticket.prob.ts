import { TicketResponse } from '../../responses/ticket/data.response.js';

export interface AdminTickTableProps {
  tickets: TicketResponse[];
  isLoading: boolean;
  isError: boolean;
  refreshKey?: () => void;
}
