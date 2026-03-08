import { MonitorResponse } from '../../responses/monitor/data.response';
import { PaginationData } from '../base/base.type';

// API Response Types
export interface FetchMonitorListResponse {
  pagination: PaginationData;
  results: MonitorResponse[];
}
