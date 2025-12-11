'use client';

import type { Product } from '../models/product.ui.model';

import { ProductTableHeader } from './ProductTableHeader';
import { ProductTableRow } from './ProductTableRow';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  itemsPerPage: number;
  expandedRows: Set<number>;
  onToggleRowExpansion: (productId: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onRunScript: (product: Product) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
}

export function ProductTable({
  products,
  loading,
  itemsPerPage,
  expandedRows,
  onToggleRowExpansion,
  onEditProduct,
  onDeleteProduct,
  onRunScript,
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  setCurrentPage,
  setItemsPerPage,
}: ProductTableProps) {
  const renderPaginationNumbers = () => {
    return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
      let pageNum;
      if (totalPages <= 5) {
        pageNum = i + 1;
      } else if (currentPage <= 3) {
        pageNum = i + 1;
      } else if (currentPage >= totalPages - 2) {
        pageNum = totalPages - 4 + i;
      } else {
        pageNum = currentPage - 2 + i;
      }

      return (
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? 'default' : 'outline'}
          size='sm'
          onClick={() => setCurrentPage(pageNum)}
          disabled={loading}
          className='px-3 min-w-10'
        >
          {pageNum}
        </Button>
      );
    });
  };

  const renderLoadingSkeleton = () => {
    return Array.from({ length: itemsPerPage }, (_, i) => (
      <tr key={`loading-${i}`}>
        {/* Expand Column */}
        <td className='px-6 py-4 whitespace-nowrap text-foreground'>
          <Skeleton className='h-4 w-4' />
        </td>
        {/* ID Column */}
        <td className='px-6 py-4 whitespace-nowrap text-foreground'>
          <Skeleton className='h-4 w-12' />
        </td>
        {/* Product Column */}
        <td className='px-6 py-4 whitespace-nowrap text-foreground'>
          <div className='flex items-center'>
            <Skeleton className='h-8 w-8 rounded mr-3' />
            <div>
              <Skeleton className='h-4 w-24 mb-2' />
              <Skeleton className='h-3 w-16' />
            </div>
          </div>
        </td>
        {/* Status Column */}
        <td className='px-6 py-4 whitespace-nowrap text-foreground'>
          <Skeleton className='h-6 w-20 rounded-full' />
        </td>
        {/* Last Run Column */}
        <td className='px-6 py-4 whitespace-nowrap text-foreground'>
          <Skeleton className='h-4 w-24' />
        </td>
        {/* Enabled Column */}
        <td className='px-6 py-4 whitespace-nowrap text-foreground'>
          <div className='flex items-center'>
            <Skeleton className='h-2 w-2 rounded-full mr-2' />
            <Skeleton className='h-4 w-8' />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className='bg-card border border-border shadow-md rounded-lg overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <ProductTableHeader />
          <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600'>
            {loading
              ? renderLoadingSkeleton()
              : products.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    isExpanded={expandedRows.has(product.id)}
                    onToggleExpansion={onToggleRowExpansion}
                    onEditProduct={onEditProduct}
                    onDeleteProduct={onDeleteProduct}
                    onRunScript={onRunScript}
                    loading={loading}
                  />
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className='px-6 py-4 border-t border-border'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className={`text-sm text-muted-foreground`}>
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}{' '}
                products
              </div>
              <div className='flex items-center gap-2'>
                <span className={`text-sm text-muted-foreground`}>Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className='px-2 py-1 border border-border rounded-md bg-background text-foreground text-sm'
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || loading}
                className='px-3'
              >
                First
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1 || loading}
                className='px-3'
              >
                Previous
              </Button>

              {/* Page numbers */}
              <div className='flex items-center gap-1 mx-2'>{renderPaginationNumbers()}</div>

              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className='px-3'
              >
                Next
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || loading}
                className='px-3'
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
