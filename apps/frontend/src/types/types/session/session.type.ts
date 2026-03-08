import { PaginationData } from '../base/base.type';

export interface SessionUserInfo {
  id: string;
  username: string;
  fullName?: string;
}

export interface SessionResponse {
  id: string;
  userId: string;
  user?: SessionUserInfo;
  token: string;
  refreshToken: string;
  expiresAt: Date | string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SessionLogResponse {
  id: string;
  userId: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: Date | string;
}

export interface FetchSessionListResponse {
  pagination: PaginationData;
  results: SessionResponse[];
}

export interface FetchSessionLogListResponse {
  pagination: PaginationData;
  results: SessionLogResponse[];
}
