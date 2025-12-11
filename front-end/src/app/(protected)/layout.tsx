'use client';

import { AppHeader } from '@/shared/components/AppHeader';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useRequireAuth();

  if (isLoading) {
    // Still checking authentication
    return (
      <div className='flex h-screen items-center justify-center'>
        <span className='text-muted-foreground'>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect will happen in useRequireAuth, so don't render protected content.
    return null;
  }

  // Authenticated: Show the real UI
  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0 space-y-6'>{children}</div>
      </main>
    </div>
  );
}
