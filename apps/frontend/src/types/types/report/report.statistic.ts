interface Severity {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

interface Status {
  open: number;
  in_progress: number;
  resolved: number;
  canceled: number;
}

interface Activity {
  created: number;
  resolved: number;
  avgResolutionTime: any;
}

export interface ReportDailyStat {
  count: number;
  date: string | Date;
  bySeverity: Severity;
  byStatus: Status;
}

export interface ReportSumaryStat {
  total: number;
  date: string | Date;
  bySeverity: Severity;
  byStatus: Status;
  recentActivity: Activity;
}

export interface ReportTrendStat {
  total: number;
  period: string | Date;
  bySeverity: Severity;
  byStatus: Status;
}
