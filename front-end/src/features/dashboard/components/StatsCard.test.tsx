import { render, screen } from '@testing-library/react';
import { Package } from 'lucide-react';
import { StatsCard } from './StatsCard';

describe('StatsCard', () => {
  it('renders title and value', () => {
    render(<StatsCard icon={Package} title='Total' value={123} isLoading={false} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  // it("shows loading skeleton when loading", () => {
  //     render(
  //         <StatsCard icon={Package} title="Loading..." value={0} isLoading />
  //     );
  //     // At least one animated status (skeleton) is present
  //     expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  // });
});
