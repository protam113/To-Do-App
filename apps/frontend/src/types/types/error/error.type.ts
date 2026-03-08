import { ErrorResponse } from '../../responses/error/data.response.js';
import { PaginationData } from '../base/base.type.js';

export interface FetchErrorListResponse {
  pagination: PaginationData;
  results: ErrorResponse[];
}


