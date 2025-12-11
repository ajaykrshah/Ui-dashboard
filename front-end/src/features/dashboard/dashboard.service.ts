import { apiClient } from '@/shared/lib/api';
import { mapActivities, mapDashboardStats } from './mapping';
import { ActivitiesListResponse, DashboardStatsResponse } from './models/dashboard.api.model';
import { ActivityItem, DashboardStats } from './models/dashboard.ui.model';

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<DashboardStatsResponse>('/dashboard/stats');
    return mapDashboardStats(data.stats);
  }

  async getRecentActivities(limit = 10): Promise<ActivityItem[]> {
    const { data } = await apiClient.get<ActivitiesListResponse>('/dashboard/activities', {
      limit,
    });
    return mapActivities(data.activities);
  }
}
export const dashboardService = new DashboardService();
