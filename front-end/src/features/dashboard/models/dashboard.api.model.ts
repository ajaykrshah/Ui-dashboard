export type Period = 'day' | 'week' | 'month' | 'year';

export interface DashboardQueryParams {
  period?: Period;
  [key: string]: string | number | boolean | undefined;
}
export interface ApiDashboardStats {
  total_products: number;
  active_products: number;
  patch_notifications: number;
  patches_created: number;
  failed_patches: number;
  patches_ready: number;
}

export interface DashboardStatsResponse {
  stats: ApiDashboardStats;
}

export interface ApiActivityItem {
  id: number;
  type: string; // e.g., "patch_created", "execution_success"
  title: string;
  description?: string;
  timestamp: string;
}

export interface ActivitiesListResponse {
  activities: ApiActivityItem[];
}
