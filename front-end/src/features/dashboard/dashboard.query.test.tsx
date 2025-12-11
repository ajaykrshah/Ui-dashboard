import { server } from '@/test/mocks/server';
import { createQueryWrapper } from '@/test/testUtils';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardStats, useRecentActivities } from './dashboard.query';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Dashboard Query Hooks', () => {
  it('fetches and maps dashboard stats', async () => {
    const wrapper = createQueryWrapper();
    const { result } = renderHook(() => useDashboardStats(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.totalProducts).toBeDefined();
    expect(result.current.data?.activeProducts).toBeDefined();
  });

  it('fetches recent activities', async () => {
    const wrapper = createQueryWrapper();
    const { result } = renderHook(() => useRecentActivities(5), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data?.length).toBeGreaterThan(0);
  });
});
