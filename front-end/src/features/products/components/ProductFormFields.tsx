'use client';

import { AlertTriangle, ChevronDown } from 'lucide-react';

import { ProductFormData } from '../models/product.ui.model';
import { getScriptTypeByIndex } from '../scriptTypes.config';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductFormFieldsProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  scripts: string[];
  scriptsLoading: boolean;
  scriptsError: string | null;
}

export function ProductFormFields({
  formData,
  setFormData,
  scripts,
  scriptsLoading,
  scriptsError,
}: ProductFormFieldsProps) {
  // Ensure exactly 4 slots are present in the form state
  const slots = 4;
  const automationScripts = Array.from(
    { length: slots },
    (_, i) => formData.automationScripts?.[i] ?? ''
  );
  const safeScripts = Array.isArray(scripts) ? scripts : [];

  return (
    <>
      {/* Basic Information */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='space-y-2'>
          <Label className='text-sm font-medium text-muted-foreground'>Product</Label>
          <Input
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className='border-2'
          />
        </div>
        <div className='space-y-2'>
          <Label className='text-sm font-medium text-muted-foreground'>Vendor</Label>
          <Input
            value={formData.vendor || ''}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            className='border-2'
          />
        </div>
        <div className='space-y-2'>
          <Label className='text-sm font-medium text-muted-foreground'>Cron</Label>
          <Input
            value={formData.cron || ''}
            onChange={(e) => setFormData({ ...formData, cron: e.target.value })}
            className='border-2'
          />
        </div>
        <div className='space-y-2'>
          <Label className='text-sm font-medium text-muted-foreground'>Enabled</Label>
          <div className='flex items-center space-x-2 pt-2'>
            <input
              type='checkbox'
              checked={formData.enabled || false}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className='w-5 h-5 accent-primary rounded'
            />
          </div>
        </div>
      </div>

      {/* Automation Scripts */}
      <div className='space-y-4'>
        <Label className='text-sm font-medium text-muted-foreground'>Automation Scripts</Label>
        <div className='space-y-3'>
          {automationScripts.map((script, index) => {
            const scriptType = getScriptTypeByIndex(index);
            const Icon = scriptType.icon;

            return (
              <div key={index} className='space-y-2'>
                <Label className={`text-sm text-muted-foreground flex items-center gap-2`}>
                  <Icon className='w-4 h-4 text-sm' />
                  {scriptType.description}
                </Label>
                <div className='relative'>
                  <select
                    value={script}
                    onChange={(e) => {
                      const newScripts = [...automationScripts];
                      newScripts[index] = e.target.value;
                      setFormData({ ...formData, automationScripts: newScripts });
                    }}
                    className='w-full px-3 py-2 border-2 rounded-md bg-background text-foreground appearance-none'
                    disabled={scriptsLoading}
                  >
                    <option value=''>Select {scriptType.name}...</option>
                    {safeScripts.map((scriptPath, idx) => (
                      <option key={idx} value={scriptPath}>
                        {scriptPath}
                      </option>
                    ))}
                  </select>
                  {scriptsLoading && (
                    <div className='absolute right-8 top-1/2 transform -translate-y-1/2'>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary'></div>
                    </div>
                  )}
                  <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none' />
                </div>
              </div>
            );
          })}

          {/* Scripts API Error */}
          {scriptsError && (
            <Card className='border-destructive bg-destructive/10'>
              <CardContent className='p-3'>
                <div className='flex items-center'>
                  <AlertTriangle className='h-4 w-4 text-destructive mr-2' />
                  <span className='text-sm text-destructive'>
                    Failed to load scripts: {scriptsError}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
