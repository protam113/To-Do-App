export enum TiketStatus {
  Pending = 'pending',
  Rejected = 'rejected',
  Approved = 'approved',
  InProgress = 'in_progress',
  Closed = 'closed',
  Resolved = 'resolved',
}

export enum TicketType {
  AUTH = 'auth',
  USER = 'user',
  TEAM = 'team',
  PROJECT = 'project',
  TASK = 'task',
  SUBTASK = 'subtask',
  COMMENT = 'comment',
  TAG = 'tag',
  PRIORITY = 'priority',
  SCHEDULE = 'schedule',
  NOTIFICATION = 'notification',
  SETTINGS = 'settings',
}
