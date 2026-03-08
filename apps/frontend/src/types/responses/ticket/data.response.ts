import { TicketType, TiketStatus } from '../../enum/ticket.enum.js';

export interface TicketResponse {
  id: string;
  title: string;
  content: string;
  userId?: string;
  type: TicketType;
  status: TiketStatus;
  resolvedAt?: Date | string;
  resolvedBy?: string;
  rejectionReason?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Populated user
  user?: {
    id: string;
    username: string;
    email: string;
    fullName?: string;
  };

  // Populated resolver (admin/manager who resolved the ticket)
  resolver?: {
    id: string;
    username: string;
    email: string;
    fullName?: string;
  };
}
