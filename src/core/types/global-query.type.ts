export interface GlobalQueryParamsType {
  search?: string;
  status?: string;
  role?: string;
  min_amount?: number;
  max_amount?: number;
  start_date?: string; // ISO string format
  end_date?: string;   // ISO string format
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;

}


