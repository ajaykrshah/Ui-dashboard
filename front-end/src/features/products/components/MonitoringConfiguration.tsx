'use client';

import { ProductFormData } from '../models/product.ui.model';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MonitoringConfigurationProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
}

export function MonitoringConfiguration({ formData, setFormData }: MonitoringConfigurationProps) {
  return (
    <div className='space-y-4'>
      <Label className='text-lg font-semibold text-foreground'>Monitoring Configuration</Label>
      <div className='space-y-6'>
        {/* File Size Check */}
        <div className='space-y-3'>
          <div className='flex items-center space-x-3'>
            <input
              type='checkbox'
              checked={formData.needsFileSizeCheck || false}
              onChange={(e) => setFormData({ ...formData, needsFileSizeCheck: e.target.checked })}
              className='w-5 h-5 accent-primary rounded'
            />
            <Label className='text-sm font-medium'>File Size Check</Label>
          </div>
          {formData.needsFileSizeCheck && (
            <div className='ml-8 space-y-2'>
              <Label
                className={`text-xs font-medium text-muted-foreground uppercase tracking-wider`}
              >
                Download URL
              </Label>
              <Input
                value={formData.fileSizeUrl || ''}
                onChange={(e) => setFormData({ ...formData, fileSizeUrl: e.target.value })}
                className='max-w-md'
                placeholder='Enter file size URL'
              />
            </div>
          )}
        </div>

        {/* Vendor Website Check */}
        <div className='space-y-3'>
          <div className='flex items-center space-x-3'>
            <input
              type='checkbox'
              checked={formData.needsVendorWebsiteCheck || false}
              onChange={(e) =>
                setFormData({ ...formData, needsVendorWebsiteCheck: e.target.checked })
              }
              className='w-5 h-5 accent-primary rounded'
            />
            <Label className='text-sm font-medium'>Vendor Website Check</Label>
          </div>
          {formData.needsVendorWebsiteCheck && (
            <div className='ml-8 space-y-4'>
              <div className='space-y-2'>
                <Label
                  className={`text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                >
                  Website URL
                </Label>
                <Input
                  value={formData.vendorWebsiteUrl || ''}
                  onChange={(e) => setFormData({ ...formData, vendorWebsiteUrl: e.target.value })}
                  className='max-w-md'
                  placeholder='Enter vendor website URL'
                />
              </div>
              <div className='space-y-2'>
                <Label
                  className={`text-xs font-medium text-muted-foreground uppercase tracking-wider`}
                >
                  Version Pattern (Regex)
                </Label>
                <Input
                  value={formData.vendorWebsiteRegex || ''}
                  onChange={(e) => setFormData({ ...formData, vendorWebsiteRegex: e.target.value })}
                  className='max-w-md'
                  placeholder='Enter regex pattern (optional)'
                />
              </div>
            </div>
          )}
        </div>

        {/* Ninite Check */}
        <div className='space-y-3'>
          <div className='flex items-center space-x-3'>
            <input
              type='checkbox'
              checked={formData.needsNiniteCheck || false}
              onChange={(e) => setFormData({ ...formData, needsNiniteCheck: e.target.checked })}
              className='w-5 h-5 accent-primary rounded'
            />
            <Label className='text-sm font-medium'>Ninite Check</Label>
          </div>
          {formData.needsNiniteCheck && (
            <div className='ml-8 space-y-2'>
              <Label
                className={`text-xs font-medium text-muted-foreground uppercase tracking-wider`}
              >
                Product Name
              </Label>
              <Input
                value={formData.niniteProductName || ''}
                onChange={(e) => setFormData({ ...formData, niniteProductName: e.target.value })}
                className='max-w-md'
                placeholder='Enter Ninite product name'
              />
            </div>
          )}
        </div>

        {/* Debug Mode */}
        <div className='space-y-3'>
          <div className='flex items-center space-x-3'>
            <input
              type='checkbox'
              checked={formData.debug || false}
              onChange={(e) => setFormData({ ...formData, debug: e.target.checked })}
              className='w-5 h-5 accent-primary rounded'
            />
            <Label className='text-sm font-medium'>Debug Mode</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
