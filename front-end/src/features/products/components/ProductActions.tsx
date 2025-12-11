'use client';

import { Plus, RefreshCw } from 'lucide-react';

import { Product } from '../models/product.ui.model';

import { Button } from '@/components/ui/button';

interface ProductActionsProps {
  onAddProduct: () => void;
  onReload: () => void;
  loading: boolean;
  products: Product[];
  updateProductMutation: {
    mutate: (data: any) => void;
    mutateAsync: (data: any) => Promise<any>;
    isPending: boolean;
  };
}

export function ProductActions({ onAddProduct, onReload, loading }: ProductActionsProps) {
  return (
    <div className='flex flex-col sm:flex-row gap-4'>
      <Button onClick={onAddProduct} disabled={loading}>
        <Plus className='w-4 h-4 mr-2' />
        Add Product
      </Button>

      {/* API Controls */}
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={onReload}
          disabled={loading}
          className='h-8 px-3 text-xs'
        >
          {loading ? (
            <RefreshCw className='w-3 h-3 animate-spin mr-1' />
          ) : (
            <RefreshCw className='w-3 h-3 mr-1' />
          )}
          Refresh
        </Button>
      </div>
    </div>
  );
}
