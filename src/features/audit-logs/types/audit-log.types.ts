export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  user_role: string;
  user_full_name: string;
  action: string;
  resource: string;
  resource_id: string;
  status: string;
  created_at: string;
}

export interface AuditLogDetail extends AuditLog {
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  extra: Record<string, any> | null;
  ip_address: string;
  user_agent: string;
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
  device: string;
}

export interface AuditLogFilters {
  search?: string;
  action?: string;
  resource?: string;
  user_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface AuditLogResponse {
  items: AuditLog[];
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  message: string;
}
