'use client';

import { Search } from 'lucide-react';

import type { Product } from '../models/product.ui.model';

import { Input } from '@/components/ui/input';

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  enabledFilter: string;
  setEnabledFilter: (filter: string) => void;
  vendorFilter: string;
  setVendorFilter: (filter: string) => void;
  products: Product[];
}

export function ProductFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  enabledFilter,
  setEnabledFilter,
  vendorFilter,
  setVendorFilter,
  products,
}: ProductFiltersProps) {
  const uniqueVendors = Array.from(new Set(products.map((p) => p.metadata.vendor))).filter(Boolean);

  return (
    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <Input
            placeholder='Search products...'
            className='pl-10'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <option value=''>All Statuses</option>
          <option value='completed'>Completed</option>
          <option value='failed'>Failed</option>
          <option value='running'>Running</option>
          <option value='pending'>Pending</option>
          <option value='cancelled'>Cancelled</option>
        </select>

        {/* Enabled Filter */}
        <select
          value={enabledFilter}
          onChange={(e) => setEnabledFilter(e.target.value)}
          className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <option value=''>All Products</option>
          <option value='enabled'>Enabled Only</option>
          <option value='disabled'>Disabled Only</option>
        </select>

        {/* Vendor Filter */}
        <select
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
          className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <option value=''>All Vendors</option>
          {uniqueVendors.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
