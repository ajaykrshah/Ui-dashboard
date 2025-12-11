'use client';

import { ChevronDown, ChevronRight, Package } from 'lucide-react';

import { Product } from '../models/product.ui.model';

import { ProductExpandedRow } from './ProductExpandedRow';

import { StatusBadge } from '@/shared/components/StatusBadge';

interface ProductTableRowProps {
  product: Product;
  isExpanded: boolean;
  onToggleExpansion: (productId: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onRunScript: (product: Product) => void;
  loading: boolean;
}

export function ProductTableRow({
  product,
  isExpanded,
  onToggleExpansion,
  onEditProduct,
  onDeleteProduct,
  onRunScript,
  loading,
}: ProductTableRowProps) {
  return (
    <>
      {/* Main Row */}
      <tr
        className='border-b border-border hover:bg-accent transition-all
         duration-200 ease-out cursor-pointer'
        onClick={() => onToggleExpansion(product.id)}
      >
        {/* Expand/Collapse Button */}
        <td className='px-6 py-4 whitespace-nowrap'>
          <div className='p-1 rounded'>
            {isExpanded ? (
              <ChevronDown className={`h-4 w-4 text-foreground`} />
            ) : (
              <ChevronRight className={`h-4 w-4 text-foreground}`} />
            )}
          </div>
        </td>

        {/* Product ID */}
        <td className='px-6 py-4 whitespace-nowrap'>
          <div className='text-sm font-mono text-muted-foreground'>#{product.id}</div>
        </td>

        {/* Product Info */}
        <td className='px-6 py-4 whitespace-nowrap'>
          <div className='flex items-center'>
            <Package className={`h-8 w-8 text-blue-600 dark:text-blue-400 mr-3 shrink-0`} />
            <div>
              <div className={`text-sm font-medium text-foreground`}>
                {product.name || 'Unnamed Product'}
              </div>
              <div className={`text-sm text-muted-foreground`}>
                {product.metadata.vendor || 'Unknown'} •{' '}
                {product.metadata.automationScripts?.length || 0} scripts
              </div>
            </div>
          </div>
        </td>

        {/* Status */}
        <td className='px-6 py-4 whitespace-nowrap'>
          <StatusBadge status={product.metadata.lastRanStatus}>
            {product.metadata.lastRanStatus}
          </StatusBadge>
        </td>

        {/* Last Run */}
        <td className='px-6 py-4 whitespace-nowrap text-foreground'>
          <div className='text-foreground'>
            {product.metadata.lastRanAt
              ? new Date(product.metadata.lastRanAt).toLocaleDateString()
              : 'Never'}
          </div>
          <div className='text-muted-foreground'>
            {product.metadata.lastRanAt
              ? new Date(product.metadata.lastRanAt).toLocaleTimeString()
              : ''}
          </div>
        </td>

        {/* Enabled */}
        <td className='px-6 py-4 whitespace-nowrap text-foreground'>
          <div className='flex items-center'>
            <div
              className={`w-2 h-2 rounded-full ${product.metadata.enabled ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <span
              className={`ml-2 text-sm ${product.metadata.enabled ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
            >
              {product.metadata.enabled ? 'Yes' : 'No'}
            </span>
          </div>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {isExpanded && (
        <ProductExpandedRow
          product={product}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
          onRunScript={onRunScript}
          loading={loading}
        />
      )}
    </>
  );
}
