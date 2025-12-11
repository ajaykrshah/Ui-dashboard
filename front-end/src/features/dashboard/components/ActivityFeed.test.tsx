import { render, screen } from '@testing-library/react';
import { ActivityFeed, ActivityItem } from './ActivityFeed';

describe('ActivityFeed', () => {
  it('renders list items', () => {
    const items: ActivityItem[] = [
      { id: 1, title: 'Fixed patch', timestamp: '2024-06-01T12:00:00Z' },
      { id: 2, title: 'Deployed new script', timestamp: '2024-06-02T08:30:00Z' },
    ];
    render(<ActivityFeed title='Recent' items={items} />);
    expect(screen.getByText('Fixed patch')).toBeInTheDocument();
    expect(screen.getByText('Deployed new script')).toBeInTheDocument();
  });

  // it("renders loading skeletons when loading", () => {
  //     render(<ActivityFeed title="Working..." items={[]} isLoading={true} />);
  //     // Check for any status role or skeleton nodes
  //     expect(screen.queryAllByRole("status").length).toBeGreaterThan(0);
  // });
});
