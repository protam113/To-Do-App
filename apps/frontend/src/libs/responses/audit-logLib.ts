import type { Filters } from "@/types";
import { useAuditLogList } from "../../hooks/audit-log/useAuditLog";


export const AuditLogList = (
    currentPage: number,
    filters: Filters,
    refreshKey: number
) => {
    const { data, isLoading, isError } = useAuditLogList(
        currentPage,
        filters,
        refreshKey
    );

    const pagination = data?.pagination ?? {
        page: 1,
        total_page: 1,
        total: 0,
    };

    const audit_logs = data?.results ?? [];

    return {
        audit_logs,
        isLoading,
        isError,
        pagination,
    };
};
