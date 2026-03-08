import { number } from 'zod';
import { AuditAction, AuditType } from '../../enum/log-audit.enum';
import { PaginationData } from '../base/base.type';
import {
  User,
  Users,
  FolderKanban,
  CheckSquare,
  MessageSquare,
  AlertCircle,
  Settings,
  FileText,
  LucideIcon,
} from 'lucide-react';

export interface AuditHeaders {
  'x-user-id': string;
  'x-user-role': string;
  'x-ip-address': string;
  'x-user-agent': string;
}

export interface AuditInfo {
  userId: string;
  ipAddress: string;
  userAgent: string;
}

interface ByUser {
  _id: string;
  username: string;
  email: string;
}

export interface AuditLogResponse {
  id: string;
  type: AuditType;
  action: AuditAction;
  byUser: ByUser;
  target?: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FetchAuditLogListResponse {
  pagination: PaginationData;
  results: AuditLogResponse[];
}

export interface LogResponse {
  '@timestamp': string;
  level: string;
  message: string;
  service: string;
  traceId: string;
  type: string;
  method: string;
  url: string;
  statusCode: number;
  duration: string;
  timestamp: string;
}

export interface FetchLogListResponse {
  pagination: PaginationData;
  results: LogResponse[];
}
export interface ByService {
  key: string;
  doc_count: number;
}

export interface ByLevel {
  key: string;
  doc_count: number;
}

export interface OverTime {
  key_as_string: string | Date;
  key: string;
  doc_count: number;
}

export interface FetchLogStat {
  total: number;
  byService: ByService[];
  byLevel: ByLevel[];
  overTime: OverTime[];
}

const typeColorMap: Record<AuditType, string> = {
  [AuditType.USER]: 'bg-amber-100 text-amber-800',
  [AuditType.SESSION]: 'bg-green-100 text-green-800',
  [AuditType.TEAM]: 'bg-cyan-100 text-cyan-800',
  [AuditType.PROJECT]: 'bg-red-100 text-red-800',
  [AuditType.TASK]: 'bg-blue-100 text-blue-800',
  [AuditType.TICKET]: 'bg-purple-100 text-purple-800',
  [AuditType.COMMENT]: 'bg-violet-100 text-violet-800',
  [AuditType.REPORT]: 'bg-orange-100 text-orange-800',
};

export const getTypeColor = (type: string) => {
  return typeColorMap[type as AuditType] ?? 'bg-gray-100 text-black ';
};

const typeIconMap: Record<AuditType, LucideIcon> = {
  [AuditType.USER]: User,
  [AuditType.SESSION]: User,
  [AuditType.TEAM]: Users,
  [AuditType.PROJECT]: FolderKanban,
  [AuditType.TASK]: CheckSquare,
  [AuditType.TICKET]: AlertCircle,
  [AuditType.COMMENT]: MessageSquare,
  [AuditType.REPORT]: FileText,
};

export const getTypeIcon = (type: string): LucideIcon => {
  return typeIconMap[type as AuditType] ?? Settings;
};

const actionColorMap: Record<AuditAction, string> = {
  // User actions
  [AuditAction.USER_CREATED]: 'bg-amber-100 text-amber-800',
  [AuditAction.USER_UPDATED]: 'bg-amber-100 text-amber-800',
  [AuditAction.USER_DELETED]: 'bg-amber-100 text-amber-800',
  [AuditAction.USER_PROMOTED]: 'bg-amber-100 text-amber-800',
  [AuditAction.USER_BLOCKED]: 'bg-amber-100 text-amber-800',
  [AuditAction.USER_UNBLOCKED]: 'bg-amber-100 text-amber-800',
  [AuditAction.USER_ACTIVATED]: 'bg-amber-100 text-amber-800',
  [AuditAction.USER_LOGIN]: 'bg-amber-100 text-amber-800',
  [AuditAction.USER_LOGOUT]: 'bg-amber-100 text-amber-800',
  [AuditAction.USER_PASSWORD_CHANGED]: 'bg-amber-100 text-amber-800',

  // Session actions
  [AuditAction.SESSION_CREATED]: 'bg-green-100 text-green-800',
  [AuditAction.SESSION_REVOKED]: 'bg-green-100 text-green-800',
  [AuditAction.SESSION_EXPIRED]: 'bg-green-100 text-green-800',

  // Team actions
  [AuditAction.TEAM_CREATED]: 'bg-cyan-100 text-cyan-800',
  [AuditAction.TEAM_UPDATED]: 'bg-cyan-100 text-cyan-800',
  [AuditAction.TEAM_DELETED]: 'bg-cyan-100 text-cyan-800',
  [AuditAction.TEAM_MEMBER_ADDED]: 'bg-cyan-100 text-cyan-800',
  [AuditAction.TEAM_MEMBER_REMOVED]: 'bg-cyan-100 text-cyan-800',
  [AuditAction.TEAM_OWNER_CHANGED]: 'bg-cyan-100 text-cyan-800',

  // Project actions
  [AuditAction.PROJECT_CREATED]: 'bg-red-100 text-red-800',
  [AuditAction.PROJECT_UPDATED]: 'bg-red-100 text-red-800',
  [AuditAction.PROJECT_DELETED]: 'bg-red-100 text-red-800',
  [AuditAction.PROJECT_MEMBER_ADDED]: 'bg-red-100 text-red-800',
  [AuditAction.PROJECT_MEMBER_REMOVED]: 'bg-red-100 text-red-800',
  [AuditAction.PROJECT_MANAGER_CHANGED]: 'bg-red-100 text-red-800',

  // Task actions
  [AuditAction.TASK_CREATED]: 'bg-blue-100 text-blue-800',
  [AuditAction.TASK_UPDATED]: 'bg-blue-100 text-blue-800',
  [AuditAction.TASK_DELETED]: 'bg-blue-100 text-blue-800',
  [AuditAction.TASK_ASSIGNED]: 'bg-blue-100 text-blue-800',
  [AuditAction.TASK_UNASSIGNED]: 'bg-blue-100 text-blue-800',
  [AuditAction.TASK_STATUS_CHANGED]: 'bg-blue-100 text-blue-800',
  [AuditAction.TASK_PRIORITY_CHANGED]: 'bg-blue-100 text-blue-800',

  // Ticket actions
  [AuditAction.TICKET_CREATED]: 'bg-purple-100 text-purple-800',
  [AuditAction.TICKET_UPDATED]: 'bg-purple-100 text-purple-800',
  [AuditAction.TICKET_STATUS_CHANGED]: 'bg-purple-100 text-purple-800',

  // Report actions
  [AuditAction.REPORT_CREATED]: 'bg-orange-100 text-orange-800',
  [AuditAction.REPORT_UPDATED]: 'bg-orange-100 text-orange-800',
  [AuditAction.REPORT_DELETED]: 'bg-orange-100 text-orange-800',
  [AuditAction.REPORT_ATTACHMENT_UPDATED]: 'bg-orange-100 text-orange-800',
};

export const getActionColor = (action: string) => {
  return actionColorMap[action as AuditAction] ?? 'bg-gray-100 text-gray-800';
};

const actionIconMap: Partial<Record<AuditAction, LucideIcon>> = {
  // User actions
  [AuditAction.USER_CREATED]: User,
  [AuditAction.USER_UPDATED]: User,
  [AuditAction.USER_DELETED]: User,
  [AuditAction.USER_PROMOTED]: User,
  [AuditAction.USER_BLOCKED]: User,
  [AuditAction.USER_UNBLOCKED]: User,
  [AuditAction.USER_ACTIVATED]: User,
  [AuditAction.USER_LOGIN]: User,
  [AuditAction.USER_LOGOUT]: User,
  [AuditAction.USER_PASSWORD_CHANGED]: User,

  // Session actions
  [AuditAction.SESSION_CREATED]: User,
  [AuditAction.SESSION_REVOKED]: User,
  [AuditAction.SESSION_EXPIRED]: User,

  // Team actions
  [AuditAction.TEAM_CREATED]: Users,
  [AuditAction.TEAM_UPDATED]: Users,
  [AuditAction.TEAM_DELETED]: Users,
  [AuditAction.TEAM_MEMBER_ADDED]: Users,
  [AuditAction.TEAM_MEMBER_REMOVED]: Users,
  [AuditAction.TEAM_OWNER_CHANGED]: Users,

  // Project actions
  [AuditAction.PROJECT_CREATED]: FolderKanban,
  [AuditAction.PROJECT_UPDATED]: FolderKanban,
  [AuditAction.PROJECT_DELETED]: FolderKanban,
  [AuditAction.PROJECT_MEMBER_ADDED]: FolderKanban,
  [AuditAction.PROJECT_MEMBER_REMOVED]: FolderKanban,
  [AuditAction.PROJECT_MANAGER_CHANGED]: FolderKanban,

  // Task actions
  [AuditAction.TASK_CREATED]: CheckSquare,
  [AuditAction.TASK_UPDATED]: CheckSquare,
  [AuditAction.TASK_DELETED]: CheckSquare,
  [AuditAction.TASK_ASSIGNED]: CheckSquare,
  [AuditAction.TASK_UNASSIGNED]: CheckSquare,
  [AuditAction.TASK_STATUS_CHANGED]: CheckSquare,
  [AuditAction.TASK_PRIORITY_CHANGED]: CheckSquare,

  // Ticket actions
  [AuditAction.TICKET_CREATED]: AlertCircle,
  [AuditAction.TICKET_UPDATED]: AlertCircle,
  [AuditAction.TICKET_STATUS_CHANGED]: AlertCircle,

  // Report actions
  [AuditAction.REPORT_CREATED]: FileText,
  [AuditAction.REPORT_UPDATED]: FileText,
  [AuditAction.REPORT_DELETED]: FileText,
  [AuditAction.REPORT_ATTACHMENT_UPDATED]: FileText,
};

export const getActionIcon = (action: string): LucideIcon => {
  return actionIconMap[action as AuditAction] ?? Settings;
};
