'use client';

import { RefreshCw, Save, X } from 'lucide-react';

import { Product, ProductFormData } from '../models/product.ui.model';

import { MonitoringConfiguration } from './MonitoringConfiguration';
import { ProductFormFields } from './ProductFormFields';

import { Button } from '@/components/ui/button';

interface ProductFormProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  editingProduct: Product | null;
  loading: boolean;
  scripts: string[];
  scriptsLoading: boolean;
  scriptsError: string | null;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({
  formData,
  setFormData,
  editingProduct,
  loading,
  scripts,
  scriptsLoading,
  scriptsError,
  onSave,
  onCancel,
}: ProductFormProps) {
  return (
    <>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className={`text-3xl font-bold text-foreground mb-2`}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className='text-muted-foreground'>Configure automation product settings and scripts</p>
        </div>

        {/* Product Form */}
        <div className='bg-card rounded-lg border shadow-sm'>
          <div className='p-6 space-y-6'>
            {/* Basic Information */}
            <ProductFormFields
              formData={formData}
              setFormData={setFormData}
              scripts={scripts}
              scriptsLoading={scriptsLoading}
              scriptsError={scriptsError}
            />

            {/* Monitoring Configuration */}
            <MonitoringConfiguration formData={formData} setFormData={setFormData} />

            {/* Action Buttons */}
            <div className='flex items-center space-x-4 pt-6 border-t'>
              <Button onClick={onSave} disabled={loading} variant='default' className='px-6'>
                {loading ? (
                  <>
                    <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                    {editingProduct ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className='w-4 h-4 mr-2' />
                    Save
                  </>
                )}
              </Button>
              <Button variant='outline' onClick={onCancel} disabled={loading} className='px-6'>
                <X className='w-4 h-4 mr-2' />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
