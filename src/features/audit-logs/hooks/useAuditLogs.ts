import { useQuery } from "@tanstack/react-query";
import { getAuditLogs, getAuditLog } from "../api/audit-log.api";
import { AuditLogFilters } from "../types/audit-log.types";

export const useAuditLogs = (filters: AuditLogFilters) => {
  return useQuery({
    queryKey: ["auditLogs", filters],
    queryFn: () => getAuditLogs(filters),
  });
};

export const useAuditLog = (logId: string) => {
  return useQuery({
    queryKey: ["auditLogs", logId],
    queryFn: () => getAuditLog(logId),
    enabled: !!logId,
  });
};
