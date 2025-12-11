'use client';

import { Package, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ProductEmptyStateProps {
  searchQuery: string;
  onCreateProduct: () => void;
}

export function ProductEmptyState({ searchQuery, onCreateProduct }: ProductEmptyStateProps) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg border shadow-sm'>
      <div className='text-center py-12'>
        <Package className='mx-auto h-12 w-12 text-gray-400 mb-4' />
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
          No products found
        </h3>
        <p className='text-gray-500 dark:text-gray-400 mb-4'>
          {searchQuery
            ? `No products match "${searchQuery}". Try adjusting your search.`
            : 'Get started by creating your first automation product.'}
        </p>
        <Button onClick={onCreateProduct}>
          <Plus className='mr-2 h-4 w-4' />
          Create Product
        </Button>
      </div>
    </div>
  );
}
