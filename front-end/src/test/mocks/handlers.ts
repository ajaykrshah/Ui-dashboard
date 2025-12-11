import { http } from 'msw';
import { activity, dashboardStats } from './fixtures/data'; // global mock objects

export const handlers = [
  http.get(/\/api\/dashboard\/stats(\?.*)?$/, () => {
    return Response.json({ stats: dashboardStats });
  }),
  http.get(/\/api\/dashboard\/activities($|\?)/, () => {
    return Response.json({ activities: activity });
  }),
  // Add more for /products, /executions, /vendors, /auth, etc as needed
];
