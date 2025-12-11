import { describe, expect, it } from 'vitest';

// Simple test to verify setup works
describe('API Setup', () => {
  it('should have working test setup', () => {
    expect(1 + 1).toBe(2);
  });

  it('should render without crashing', () => {
    const div = document.createElement('div');
    expect(div).toBeDefined();
  });
});
