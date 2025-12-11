import { mapActivities, mapDashboardStats } from './mapping';
import { ApiActivityItem, ApiDashboardStats } from './models/dashboard.api.model';
import { ActivityItem, DashboardStats } from './models/dashboard.ui.model';

describe('mapDashboardStats', () => {
  it('maps API (snake_case) stats to UI (camelCase)', () => {
    const apiStats: ApiDashboardStats = {
      total_products: 10,
      active_products: 9,
      patch_notifications: 1,
      patches_created: 2,
      failed_patches: 0,
      patches_ready: 2,
    };
    const uiStats: DashboardStats = mapDashboardStats(apiStats);
    expect(uiStats).toEqual({
      totalProducts: 10,
      activeProducts: 9,
      patchNotifications: 1,
      patchesCreated: 2,
      failedPatches: 0,
      patchesReady: 2,
    });
  });
});

describe('mapActivities', () => {
  it('maps API activities correctly', () => {
    const apiList: ApiActivityItem[] = [
      { id: 1, type: 'patch_created', title: 'Patch created', timestamp: '2024-06-01T10:00:00Z' },
    ];
    const ui: ActivityItem[] = mapActivities(apiList);
    expect(ui[0]).toMatchObject({
      id: 1,
      title: 'Patch created',
      type: 'patch_created',
      timestamp: '2024-06-01T10:00:00Z',
    });
  });
});
