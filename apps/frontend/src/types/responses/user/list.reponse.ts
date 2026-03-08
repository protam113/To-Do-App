import { Provider } from '../../enum/provider.enum.js';

export interface UserListData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone_number?: string;
  isActive: boolean;
  isBlocked: boolean;
  lastLogin: Date;
  avatarUrl?: string;
  role: string;
  provider: Provider;
  providerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthUserListData {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
}
