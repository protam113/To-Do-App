import { RoleResponse } from '@/types/responses/role/data.response.js';
import { PaginationData } from '../base/base.type.js';

export interface FetchRoleListResponse {
  pagination: PaginationData;
  results: RoleResponse[];
}
