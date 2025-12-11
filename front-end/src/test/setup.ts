import { apiClient } from '@/shared/lib/api';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { setupTestServer } from './mocks/server';

// --- 1. MSW API mocking: always initialize FIRST
setupTestServer();

// --- 2. Globally initialize the apiClient for ALL tests
beforeAll(() => {
  apiClient.initialize({
    apiBaseUrl: 'http://localhost/api',
    environment: 'tst',
    features: { debugMode: true, enableMockData: true, enableAnalytics: false },
    app: { name: 'Test App', version: '0.0.1', description: 'Test' },
    auth: { tokenKey: 'access_token', refreshTokenKey: 'refresh_token', sessionTimeout: 999999 },
    navigation: [],
    theme: { storageKey: 'test-theme', defaultTheme: 'light' },
  });
});

// --- 3. Mock Next.js App Router for all tests
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    query: {},
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// --- 4. Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// --- 5. Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// --- 6. Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

// --- 7. (IMPORTANT!) DO NOT mock global.fetch if using MSW!
// If you set fetch here, MSW cannot intercept it. Only mock it for pure unit tests NOT using MSW.
// REMOVE or comment out the next line for prod-ready/feature-driven MSW mocks:
// global.fetch = vi.fn(); // <--- REMOVE/COMMENT OUT!

// --- 8. (Optional) Mock config.json, for SSR/dev tests
// vi.mock("/config.json", () => ({
//   default: {
//     apiBaseUrl: "http://localhost:3001/api",
//     environment: "test",
//     features: {
//       debugMode: true,
//       enableMockData: true,
//       enableAnalytics: false,
//     },
//   },
// }));
