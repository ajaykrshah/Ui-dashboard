/**
 * Dashboard Query Functions
 * React Query hooks for dashboard data
 *
 * Feature-owned query keys - dashboard domain only
 * Following feature isolation principles for code ownership and modularity
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from './dashboard.service';
import { ActivityItem, DashboardStats } from './models/dashboard.ui.model';

export const DASHBOARD_STATS_QUERY_KEY = ['dashboard', 'stats'] as const;
export const DASHBOARD_ACTIVITIES_QUERY_KEY = ['dashboard', 'activities'] as const;

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: () => dashboardService.getStats(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

export function useRecentActivities(limit = 10) {
  return useQuery<ActivityItem[]>({
    queryKey: [...DASHBOARD_ACTIVITIES_QUERY_KEY, limit],
    queryFn: () => dashboardService.getRecentActivities(limit),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

// Combined dashboard data hook for dashboards/pages
export function useDashboardData() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();

  const isLoading = statsLoading || activitiesLoading;

  const statsData = stats
    ? {
        totalProducts: stats.totalProducts ?? 0,
        activeProducts: stats.activeProducts ?? 0,
        patchNotifications: stats.patchNotifications ?? 0,
        patchesCreated: stats.patchesCreated ?? 0,
        failedPatches: stats.failedPatches ?? 0,
        patchesReady: stats.patchesReady ?? 0,
      }
    : {};

  return {
    statsData,
    recentActivity: activities || [],
    isLoading,
  };
}
