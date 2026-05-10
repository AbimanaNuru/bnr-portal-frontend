import { client } from "@/src/core/api/client";
import {
  AuditLogFilters,
  AuditLogResponse,
  AuditLogDetail,
} from "../types/audit-log.types";

export const getAuditLogs = async (
  filters: AuditLogFilters
): Promise<AuditLogResponse> => {
  const response = await client.get("/audit-logs", { params: filters });
  return response.data;
};

export const getAuditLog = async (logId: string): Promise<AuditLogDetail> => {
  const response = await client.get(`/audit-logs/${logId}`);
  return response.data;
};
