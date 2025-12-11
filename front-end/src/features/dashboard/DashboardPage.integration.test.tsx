import DashboardPage from '@/app/(protected)/dashboard/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

// Optionally, MSW/server can be set up globally for your test env.
import { server } from '@/test/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('DashboardPage (integration/smoke)', () => {
  it('renders dashboard header and stat cards with data', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <DashboardPage />
      </QueryClientProvider>
    );
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
    // Wait for a stat card to appear (from MSW mock)
    await waitFor(() => expect(screen.getByText(/Total Products/i)).toBeInTheDocument());
    // Checks for at least one quick action (from config)
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
    // Checks for activity feed
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
  });
});
