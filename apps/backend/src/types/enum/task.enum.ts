export enum TaskSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TaskStatus {
  OPEN = 'open',
  PROCESS = 'in_progress',
  RESOLVE = 'resolved',
  CANCELED = 'canceled',
}

export enum UserActionType {
  CREATED_BY = 'created_by',
  UPDATED_BY = 'updated_by',
  DELETED_BY = 'deleted_by',
}

export enum TaskType {
  INCIDENT = 'incident',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}
