import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// Test setup - only executed when imported in test files
export const setupTestServer = () => {
  // These globals are provided by vitest in test environment
  if (typeof global !== 'undefined' && 'beforeAll' in global) {
    (global as any).beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
    (global as any).afterEach(() => server.resetHandlers());
    (global as any).afterAll(() => server.close());
  }
};
