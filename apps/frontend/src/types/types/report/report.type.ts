import { ReportResponse } from '../../responses/report/report.response';
import { IssueResponse } from '../../responses/issue/data.response';
import { PaginationData } from '../base/base.type';

export interface FetchIssueListResponse {
  pagination: PaginationData;
  results: IssueResponse[];
}

// API Response Types
export interface FetchReportListResponse {
  pagination: PaginationData;
  results: ReportResponse[];
}

export interface FetchReportByIdResponse {
  data: IssueResponse;
}

export interface CreateReportResponse {
  success: boolean;
  data: Report;
}

export interface UpdateReportResponse {
  success: boolean;
  data: Report;
}

// Request Types
export interface CreateIssueRequest {
  name: string;
  expiresAt: string; // YYYY-MM-DD format
  medias: any[];
}

export interface UpdateIssueMediaRequest {
  medias: any[];
}
