import { server } from '@/test/mocks/server';
import { http } from 'msw';
import { dashboardService } from './dashboard.service';
import { ApiDashboardStats } from './models/dashboard.api.model';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('dashboardService', () => {
  it('gets dashboard stats via API and mapping', async () => {
    // MSW v2 handler signature with Response.json
    server.use(
      http.get('/api/dashboard/stats', () =>
        Response.json({
          stats: {
            total_products: 100,
            active_products: 25,
            patch_notifications: 3,
            patches_created: 2,
            failed_patches: 1,
            patches_ready: 1,
          } satisfies ApiDashboardStats,
        })
      )
    );
    const stats = await dashboardService.getStats();
    expect(stats.totalProducts).toBe(101);
    expect(stats.failedPatches).toBe(1);
  });

  it('gets recent activities via API and mapping', async () => {
    server.use(
      http.get('/api/dashboard/activities', () =>
        Response.json({
          activities: [
            {
              id: 1,
              type: 'patch_created',
              title: 'Created',
              timestamp: '2024-05-01T12:00:00Z',
            },
          ],
        })
      )
    );
    const activities = await dashboardService.getRecentActivities(5);
    expect(Array.isArray(activities)).toBe(true);
    expect(activities.length).toBeGreaterThan(0);
    expect(activities[0]?.title).toBe('Patch created');
  });
});
