import type { ApiActivityItem, ApiDashboardStats } from '../models/dashboard.api.model';

export const mockApiDashboardStats: ApiDashboardStats = {
  total_products: 101,
  active_products: 99,
  patch_notifications: 10,
  patches_created: 5,
  failed_patches: 1,
  patches_ready: 4,
};

export const mockApiActivityItems: ApiActivityItem[] = [
  { id: 1, type: 'patch_created', title: 'Patch created', timestamp: '2024-06-01T09:00:00Z' },
  {
    id: 2,
    type: 'execution_success',
    title: 'Pipeline success',
    timestamp: '2024-06-01T10:00:00Z',
  },
];

// Optionally export for direct feature tests/stories
export default {
  stats: mockApiDashboardStats,
  activities: mockApiActivityItems,
};
