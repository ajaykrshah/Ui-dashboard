'use client';

import { AppHeader } from '@/components/AppHeader';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // This will redirect to signin if not authenticated
  useRequireAuth();

  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='space-y-6'>{children}</div>
        </div>
      </main>
    </div>
  );
}
