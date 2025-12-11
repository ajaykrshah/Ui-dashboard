export type Environment = 'dev' | 'tst' | 'sit' | 'prd';

export interface AppConfig {
  apiBaseUrl: string;
  environment: Environment;
  features: { debugMode: boolean; enableMockData: boolean; enableAnalytics: boolean };
  app: { name: string; version: string; description: string };
  auth: { tokenKey: string; refreshTokenKey: string; sessionTimeout: number };
  navigation: Array<{ href: string; label: string; description: string; icon: string }>;
  theme: { storageKey: string; defaultTheme: 'light' | 'dark' | 'system' };
}

export const defaultConfig: AppConfig = {
  apiBaseUrl: 'http://localhost:3001/api',
  environment: 'dev',
  features: { debugMode: true, enableMockData: true, enableAnalytics: false },
  app: {
    name: 'ESG Content Automation Portal',
    version: '1.0.0',
    description: 'Dashboard for managing automated content pipelines',
  },
  auth: {
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    sessionTimeout: 3600000,
  },
  navigation: [
    { href: '/dashboard', label: 'Dashboard', description: 'Stats', icon: 'BarChart3' },
    { href: '/products', label: 'Products', description: 'Manage products', icon: 'Package' },
    { href: '/executions', label: 'History', description: 'Execution history', icon: 'History' },
  ],
  theme: { storageKey: 'automation-portal-theme', defaultTheme: 'system' },
};

export async function loadConfig(): Promise<AppConfig> {
  try {
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load runtime config');
    const runtimeConfig = await response.json();
    return { ...defaultConfig, ...runtimeConfig };
  } catch (error) {
    console.warn('Error loading runtime config (using defaults):', error);
    return defaultConfig;
  }
}
