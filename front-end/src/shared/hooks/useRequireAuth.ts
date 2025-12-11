'use client';
import { useAuth } from '@/shared/providers/auth.provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRequireAuth(redirectTo = '/auth/signin') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}
