'use client';

import { AlertTriangle, Package, Play, Settings, Trash2 } from 'lucide-react';

import { Product } from '../models/product.ui.model';
import { getScriptTypeByIndex } from '../scriptTypes.config';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
interface ProductExpandedRowProps {
  product: Product;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onRunScript: (product: Product) => void;
  loading: boolean;
}

export function ProductExpandedRow({
  product,
  onEditProduct,
  onDeleteProduct,
  onRunScript,
  loading,
}: ProductExpandedRowProps) {
  const monitoringCount = [
    product.metadata.needsFileSizeCheck,
    product.metadata.needsVendorWebsiteCheck,
    product.metadata.needsNiniteCheck,
    product.metadata.debug,
  ].filter(Boolean).length;

  return (
    <tr className='bg-secondary border-b border-border'>
      <td className='px-2'></td>
      <td colSpan={5} className='px-6 py-6'>
        <div className='space-y-6'>
          {/* Action Buttons */}
          <div className='flex items-center gap-4 px-4 py-2 bg-secondary rounded-lg border border-border'>
            <span className='text-sm font-medium text-foreground'>Actions:</span>
            <Button
              size='sm'
              variant='default'
              className='flex items-center gap-1'
              disabled={!product.metadata.enabled || loading}
              onClick={(e) => {
                e.stopPropagation();
                onRunScript(product);
              }}
            >
              <Play className='w-4 h-4' />
              Run
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-1'
              onClick={(e) => {
                e.stopPropagation();
                onEditProduct(product);
              }}
              disabled={loading}
            >
              <Settings className='w-4 h-4' />
              Edit
            </Button>
            <Button
              variant='destructive'
              size='sm'
              className='flex items-center gap-1'
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProduct(product);
              }}
              disabled={loading}
            >
              <Trash2 className='w-4 h-4' />
              Delete
            </Button>
          </div>

          {/* Basic Information */}
          <div className='bg-card p-6 rounded-lg border border-border shadow-sm'>
            <h4 className='text-sm font-semibold text-foreground mb-3 flex items-center'>
              <Package className='w-4 h-4 mr-2 text-blue-600' />
              Product Details
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <span className='text-xs text-gray-500/90 dark:text-gray-400 uppercase tracking-wider block mb-1'>
                  Vendor
                </span>
                <div className='text-sm text-gray-900/90 dark:text-white font-medium'>
                  {product.metadata.vendor}
                </div>
              </div>
              <div>
                <span className='text-xs text-gray-500/90 dark:text-gray-400 uppercase tracking-wider block mb-1'>
                  Cron Schedule
                </span>
                <code className='text-xs bg-gray-100/80 dark:bg-gray-700 px-2 py-1 rounded border'>
                  {product.metadata.cron || 'Not set'}
                </code>
              </div>
            </div>
          </div>

          {/* Automation Scripts */}
          <div className='bg-card p-6 rounded-lg border border-border shadow-sm'>
            <h4 className='text-sm font-semibold text-foreground mb-3 flex items-center'>
              <Settings className='w-4 h-4 mr-2 text-primary' />
              Automation Scripts
            </h4>
            <div className='space-y-3'>
              {product.metadata.automationScripts?.map((script, index) => {
                const scriptType = getScriptTypeByIndex(index);
                const Icon = scriptType.icon;
                return (
                  <div
                    key={index}
                    className='flex items-center justify-between bg-white/80 dark:bg-gray-800 px-3 py-2 rounded border'
                  >
                    <div>
                      <span
                        className={`text-xs ${scriptType.color} dark:text-gray-400 flex items-center gap-2`}
                      >
                        <Icon className='w-4 h-4 text-sm' />
                        {scriptType.name}
                      </span>
                      <div className='text-sm text-gray-900/90 dark:text-white font-mono'>
                        {script.split('/').pop() || script}
                      </div>
                    </div>
                  </div>
                );
              }) || (
                <div className='text-sm text-gray-500/90 dark:text-gray-400 italic'>
                  No scripts configured
                </div>
              )}
            </div>
          </div>

          {/* Monitoring Configuration */}
          <div className='bg-card p-6 rounded-lg border border-border shadow-sm'>
            <h4 className='text-sm font-semibold text-foreground mb-3 flex items-center'>
              <AlertTriangle className='w-4 h-4 mr-2 text-orange-600' />
              Monitoring Configuration
            </h4>
            <div className='flex flex-wrap gap-2'>
              {product.metadata.needsFileSizeCheck && (
                <Badge
                  variant='secondary'
                  className='text-xs cursor-help'
                  title={`File Size Check: ${product.metadata.fileSizeUrl || 'No URL configured'}`}
                >
                  File Size
                </Badge>
              )}
              {product.metadata.needsVendorWebsiteCheck && (
                <Badge
                  variant='outline'
                  className='text-xs cursor-help'
                  title={`Website Check: ${product.metadata.vendorWebsiteUrl || 'No URL configured'}\nVersion Pattern: ${product.metadata.vendorWebsiteRegex || 'No pattern configured'}`}
                >
                  Website
                </Badge>
              )}
              {product.metadata.needsNiniteCheck && (
                <Badge
                  variant='default'
                  className='text-xs cursor-help'
                  title='Ninite Check: Enabled for package validation'
                >
                  Ninite
                </Badge>
              )}
              {product.metadata.debug && (
                <Badge
                  className='text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 cursor-help'
                  title='Debug Mode: Detailed logging enabled'
                >
                  Debug
                </Badge>
              )}
              {monitoringCount === 0 && (
                <span className='text-xs text-gray-400'>None configured</span>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
