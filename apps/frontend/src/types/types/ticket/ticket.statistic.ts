interface TicketsStatus {
  pending: number;
  approved: number;
  in_progress: number;
  resolved: number;
  rejected: number;
  closed: number;
}

interface TicketsType {
  auth: number;
  user: number;
  team: number;
  project: number;
  task: number;
  subtask: number;
  comment: number;
  tag: number;
  priority: number;
  schedule: number;
  notification: number;
  settings: number;
}

interface TicketsDate {
  date: string;
  count: number;
}

export interface TicketsStat {
  totalTickets: number;
  byStatus: TicketsStatus;
  byType: TicketsType;
  averageResolutionTime: string;
  ticketsByDate: TicketsDate[];
}
