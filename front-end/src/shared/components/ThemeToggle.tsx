'use client';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/shared/providers/theme.provider';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useCallback } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const cycleTheme = useCallback(() => {
    const themes = ['light', 'dark', 'system'] as const;
    const idx = themes.indexOf(theme as (typeof themes)[number]);
    const nextTheme = themes[(idx + 1) % themes.length];
    if (nextTheme) {
      setTheme(nextTheme);
    }
  }, [theme, setTheme]);
  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className='h-4 w-4' />;
      case 'system':
        return <Monitor className='h-4 w-4' />;
      case 'light':
      default:
        return <Sun className='h-4 w-4' />;
    }
  };
  return (
    <Button
      variant='ghost'
      size='sm'
      className='w-9 px-0'
      onClick={cycleTheme}
      title={`Current theme: ${theme}. Click to change.`}
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      {getIcon()}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
