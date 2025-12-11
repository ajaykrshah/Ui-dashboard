/**
 * Dashboard Mapping Functions
 * Transform API models to UI models
 */

import { ApiActivityItem, ApiDashboardStats } from './models/dashboard.api.model';
import { ActivityItem, DashboardStats } from './models/dashboard.ui.model';

// Stats mapping
export function mapDashboardStats(api: ApiDashboardStats): DashboardStats {
  return {
    totalProducts: api.total_products,
    activeProducts: api.active_products,
    patchNotifications: api.patch_notifications,
    patchesCreated: api.patches_created,
    failedPatches: api.failed_patches,
    patchesReady: api.patches_ready,
  };
}

// Activities mapping
export function mapActivities(apiList: ApiActivityItem[]): ActivityItem[] {
  return apiList.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description ?? '',
    timestamp: item.timestamp,
  }));
}
