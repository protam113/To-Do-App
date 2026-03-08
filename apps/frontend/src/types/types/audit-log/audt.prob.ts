import { AuditLogResponse } from "./audit.type";

export interface AuditLogTableProps {
    audit_logs: AuditLogResponse[];
    isLoading: boolean;
    isError: boolean;
}
