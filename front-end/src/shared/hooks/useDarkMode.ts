'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      let shouldBeDark = false;

      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'light') {
        shouldBeDark = false;
      } else {
        // system
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(shouldBeDark);

      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setLightMode = () => {
    setTheme('light');
    localStorage.setItem('theme', 'light');
  };

  const setDarkMode = () => {
    setTheme('dark');
    localStorage.setItem('theme', 'dark');
  };

  const setSystemMode = () => {
    setTheme('system');
    localStorage.setItem('theme', 'system');
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setDarkMode();
    } else if (theme === 'dark') {
      setSystemMode();
    } else {
      setLightMode();
    }
  };

  return {
    theme,
    isDark,
    setLightMode,
    setDarkMode,
    setSystemMode,
    toggleTheme,
  };
}
