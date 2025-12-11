'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
interface ProductHeaderProps {
  loading: boolean;
  error: Error | null;
  onReload: () => void;
}

export function ProductHeader({ loading, error, onReload }: ProductHeaderProps) {
  return (
    <div className='mb-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className={`text-3xl font-bold text-foreground mb-2`}>Products</h1>
          <p className='text-muted-foreground'>
            Manage automation products and their associated scripts
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className='mt-6 border-yellow-500/50 bg-yellow-500/10 dark:bg-yellow-500/5'>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <AlertTriangle className='h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2' />
              <div className='flex-1'>
                <p className={`text-sm text-yellow-600 dark:text-yellow-400`}>
                  {error?.message || 'Unknown error'}
                </p>
              </div>
              <Button variant='outline' size='sm' onClick={onReload} className='ml-2'>
                <RefreshCw className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
