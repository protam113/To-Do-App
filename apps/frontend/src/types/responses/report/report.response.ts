import {
  ReportDataType,
  ReportSeverity,
  ReportStatus,
  UserActionType,
} from '../../enum/report.enum';

/**
 * User info for report actions
 */
export interface ReportUserInfo {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * User action tracking for report operations
 */
export interface UserAction {
  type: UserActionType;
  userId: string;
  user?: ReportUserInfo;
  actionAt: Date | string;
}

/**
 * Error info for reports
 */
export interface ReportErrorInfo {
  id: string;
  name: string;
  metadata?: Record<string, any>;
}

/**
 * Attachment information for reports
 */
export interface Attachment {
  id: string;
  url: string;
  fileName?: string;
  originalName?: string;
  mimeType?: string;
  fileType?: string;
}

/**
 * Report response interface for API responses
 * Validates: Requirements 3.1
 */
export interface ReportResponse {
  id: string;
  title: string;
  description?: string;
  parentId?: string;
  errors?: ReportErrorInfo[];
  severity: ReportSeverity;
  type: ReportDataType;
  status: ReportStatus;
  incidentTime?: string | Date;
  users: UserAction[];
  attachments: Attachment[];
  isDeleted: boolean;
  deletedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
