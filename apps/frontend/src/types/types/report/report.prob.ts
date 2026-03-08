import { ReportResponse } from '../../responses/report/report.response';
import { IssueResponse } from '../../responses/issue/data.response';

export interface IssueTableProps {
  issues: IssueResponse[];
  isLoading: boolean;
  isError: boolean;
  refreshKey?: () => void;
}

export interface ReportTableProps {
  reports: ReportResponse[];
  isLoading: boolean;
  isError: boolean;
  refreshKey: () => void;
  onTaskSelect?: (taskId: string) => void;
}
