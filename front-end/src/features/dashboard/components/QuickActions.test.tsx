import { fireEvent, render, screen } from '@testing-library/react';
import { Package } from 'lucide-react';
import { QuickActions } from './QuickActions';

describe('QuickActions', () => {
  it('renders action buttons', () => {
    const actions = [
      {
        id: 'test',
        title: 'Run Task',
        icon: Package,
        onClick: vitest.fn(),
        description: 'Do a thing',
      },
    ];
    render(<QuickActions title='QActions' actions={actions} />);
    expect(screen.getByText('Run Task')).toBeInTheDocument();
    expect(screen.getByText('Do a thing')).toBeInTheDocument();
  });

  it('action button triggers callback when clicked', () => {
    const mock = vitest.fn();
    render(
      <QuickActions
        title='QActions'
        actions={[{ id: 'go', title: 'Go!', onClick: mock, icon: Package }]}
      />
    );
    fireEvent.click(screen.getByText('Go!'));
    expect(mock).toHaveBeenCalled();
  });
});
