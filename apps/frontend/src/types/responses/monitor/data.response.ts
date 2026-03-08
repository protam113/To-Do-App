import { MonitorType } from '../../enum/monitor.enum';

export interface MonitorUserAction {
  type: string;
  userId: string;
  actionAt: Date | string;
}

interface AuthConfigType {
  username?: string;
  password?: string;
  token?: string;
  apiKey?: string;
}

export interface MonitorResponse {
  id: string;
  title: string;
  url: string;
  type: MonitorType;
  refreshInterval: number;
  isActive: boolean;
  users: MonitorUserAction[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface MonitorAuthConfigResponse {
  id: string;
  title: string;
  url: string;
  type: MonitorType;
  refreshInterval: number;
  isActive: boolean;
  authConfig: AuthConfigType;
  users: MonitorUserAction[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AccessCode {
  accessCode: string;
  expiresAt: string | Date;
  monitorId: string;
}

export interface AccessCodeResponese {
  id: string;
  title: string;
  url: string;
  type: string;
  isActive: boolean;
  refreshInterval: number;
  authConfig: AccessCode;
}

export interface AccessCodeResponse {
  success: boolean;
  code: number;
  message: string;
  data: AccessCode;
}
