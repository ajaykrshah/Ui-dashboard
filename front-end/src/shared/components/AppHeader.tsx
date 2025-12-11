'use client';

import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/providers/auth.provider';
import { useAppConfig } from '@/shared/providers/config.provider';
import { BarChart3, History, LogOut, Menu, Package, Shield, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

/** Navigation icon mapping, keys must match config */
const iconMap = {
  BarChart3,
  Package,
  History,
} as const;

/**
 * AppHeader: Modular, config-driven, uses context and hooks
 */
export function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const config = useAppConfig();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = useMemo(() => config.navigation, [config.navigation]);

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [logout, router]);

  const handleNavigation = useCallback(
    (href: string) => {
      router.push(href);
      setIsMobileMenuOpen(false);
    },
    [router]
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((open) => !open);
  }, []);

  // User display logic
  const displayName =
    user?.display_name || user?.full_name || user?.username || user?.email || 'User';
  // Navigation active helper (consider moving to /config/app-config.ts if needed globally)
  const isActiveNavigation = (pathname: string, href: string) =>
    (href === '/dashboard' && pathname === '/') || pathname === href;

  return (
    <header
      className='sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm'
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          {/* Brand */}
          <div className='flex items-center'>
            <Shield className='h-8 w-8 text-primary mr-3' aria-hidden='true' />
            <h1 className='text-xl font-bold text-foreground'>{config.app.name}</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-1' role='navigation' aria-label='Main'>
            {navigationItems.map((item: any) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap];
              return (
                <Button
                  key={item.href}
                  variant='ghost'
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActiveNavigation(pathname, item.href)
                      ? 'bg-primary/10 text-primary border border-primary/20 font-semibold'
                      : 'text-muted-foreground hover:text-primary hover:bg-accent'
                  }`}
                  onClick={() => handleNavigation(item.href)}
                  title={item.description}
                >
                  {IconComponent && <IconComponent className='h-4 w-4 mr-2' aria-hidden='true' />}
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Actions (user, theme, sign-out, mobile menu) */}
          <div className='flex items-center space-x-2'>
            {/* User info, desktop */}
            <div className='hidden md:flex items-center space-x-2 text-sm text-muted-foreground mr-2'>
              <User className='h-4 w-4' aria-hidden='true' />
              <span>{displayName}</span>
            </div>
            {/* Theme toggle */}
            <ThemeToggle />
            {/* Sign out */}
            <Button
              variant='outline'
              size='sm'
              onClick={handleSignOut}
              className='hidden sm:flex items-center space-x-2'
              title='Sign out'
            >
              <LogOut className='h-4 w-4' aria-hidden='true' />
              <span>Sign Out</span>
            </Button>
            {/* Mobile menu toggle */}
            <Button
              variant='ghost'
              size='sm'
              className='md:hidden'
              onClick={toggleMobileMenu}
              aria-label='Toggle mobile menu'
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t'>
            <nav className='space-y-2' role='navigation' aria-label='Mobile'>
              {navigationItems.map((item: any) => {
                const IconComponent = iconMap[item.icon as keyof typeof iconMap];
                return (
                  <Button
                    key={item.href}
                    variant='ghost'
                    className={`w-full justify-start px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActiveNavigation(pathname, item.href)
                        ? 'bg-primary/10 text-primary border border-primary/20 font-semibold'
                        : 'text-muted-foreground hover:text-primary hover:bg-accent'
                    }`}
                    onClick={() => handleNavigation(item.href)}
                    title={item.description}
                  >
                    {IconComponent && <IconComponent className='h-4 w-4 mr-2' aria-hidden='true' />}
                    {item.label}
                  </Button>
                );
              })}

              {/* Mobile user info and sign out */}
              <div className='pt-2 mt-2 border-t'>
                <div className='flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground'>
                  <User className='h-4 w-4' aria-hidden='true' />
                  <span>{displayName}</span>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleSignOut}
                  className='w-full mt-2 flex items-center justify-center space-x-2'
                >
                  <LogOut className='h-4 w-4' aria-hidden='true' />
                  <span>Sign Out</span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
