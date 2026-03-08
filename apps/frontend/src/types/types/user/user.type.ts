import {
  AuthUserListData,
  UserListData,
} from '../../responses/user/list.reponse.js';
import { PaginationData } from '../base/base.type.js';

export interface UsersInactiveData {
  id: string;
  username: string;
  firstName: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface FetchUserListResponse {
  pagination: PaginationData;
  results: UserListData[];
}

export interface FetchAuthUserListResponse {
  pagination: PaginationData;
  results: AuthUserListData[];
}

export interface FetchUserInactiveListResponse {
  pagination: PaginationData;
  results: UserListData[];
}
