'use client';
import * as React from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme?: 'dark' | 'light' | undefined;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'automation-portal-theme',
  enableSystem = true,
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = React.useState<'dark' | 'light'>();
  const [mounted, setMounted] = React.useState(false);

  // Listen to OS theme changes if enabled
  React.useEffect(() => {
    if (!enableSystem) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = () => setSystemTheme(media.matches ? 'dark' : 'light');
    updateSystemTheme();
    media.addEventListener('change', updateSystemTheme);
    return () => media.removeEventListener('change', updateSystemTheme);
  }, [enableSystem]);

  // Load theme from localStorage
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(storageKey) as Theme;
      if (stored && ['dark', 'light', 'system'].includes(stored)) {
        setTheme(stored);
      }
    } catch {}
    setMounted(true);
  }, [storageKey]);

  // Apply .dark/.light class and handle transition disabling
  React.useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;
    const root = window.document.documentElement;

    // Prevent flicker (disable all transitions)
    if (disableTransitionOnChange) {
      const css = document.createElement('style');
      css.textContent = `*,*::before,*::after{transition:none!important}`;
      document.head.appendChild(css);
      window.getComputedStyle(document.body); // Force reflow
      setTimeout(() => {
        if (document.head.contains(css)) {
          document.head.removeChild(css);
        }
      }, 1);
    }

    root.classList.remove('light', 'dark');
    const resolvedTheme = theme === 'system' ? systemTheme : theme;
    if (resolvedTheme) {
      root.classList.add(resolvedTheme);
    }
  }, [theme, systemTheme, mounted, disableTransitionOnChange]);

  const value = {
    theme,
    systemTheme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, newTheme);
        } catch {}
      }
    },
  };

  if (!mounted) {
    // Avoid hydration mismatch/flicker (SSR-safe)
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
