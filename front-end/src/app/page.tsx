'use client';

import { useAuth } from '@/shared/providers/auth.provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Start() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(isAuthenticated ? '/dashboard' : '/auth/signin');
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className='flex h-screen items-center justify-center'>
      <span className='text-muted-foreground animate-pulse'>Loading...</span>
    </div>
  );
}
