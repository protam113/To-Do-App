import { Provider } from '../../enum/provider.enum.js';

export interface UserData {
  id: string;
  username?: string;
  lastName: string;
  firstName?: string;
  email?: string;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  username: string;
  phone_number?: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin: Date;
  role: string;
  isBlocked: boolean;
  isDeleted?: boolean;
  provider: Provider;
  createdAt?: Date;
  updatedAt?: Date;
  fullName?: string;
}

export interface UserDataResponse {
  success: boolean;
  code: number;
  message: string;
  data: AuthUserResponse | null;
}
