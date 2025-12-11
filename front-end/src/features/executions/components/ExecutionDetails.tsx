'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { Execution } from '../models/execution.ui.model';
import {
  calculateProgress,
  formatDuration,
  getExecutionStatusConfig,
  getExecutionStatusText,
} from '../utils/executionUtils';

interface ExecutionDetailsProps {
  execution: Execution | null;
  isLoading?: boolean;
  onClose?: () => void;
}

export function ExecutionDetails({ execution, isLoading, onClose }: ExecutionDetailsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className='p-6 space-y-4'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-6 w-32' />
          <div className='space-y-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-4 w-full' />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!execution) {
    return (
      <Card>
        <CardContent className='p-6'>
          <p className='text-muted-foreground'>No execution selected</p>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = getExecutionStatusConfig(execution.status);
  const progress = calculateProgress(execution.successfulSteps, execution.totalSteps);

  return (
    <Card>
      <CardContent className='p-6 space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-start'>
          <div>
            <h2 className='text-2xl font-semibold text-foreground'>{execution.productName}</h2>
            <p className='text-muted-foreground mt-1'>Execution ID: {execution.executionId}</p>
          </div>
          <div className='flex items-center gap-3'>
            <Badge variant={statusConfig.variant} className={statusConfig.className}>
              {getExecutionStatusText(execution.status)}
            </Badge>
            {onClose && (
              <Button variant='outline' size='sm' onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium text-muted-foreground'>Progress</span>
            <span className='text-sm text-muted-foreground'>
              {execution.successfulSteps} of {execution.totalSteps} steps
            </span>
          </div>
          <div className='w-full bg-muted rounded-full h-3'>
            <div
              className='bg-primary h-3 rounded-full transition-all'
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className='text-sm text-muted-foreground'>{progress}% complete</p>
        </div>

        {/* Timing Information */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <Label className='text-sm font-medium text-muted-foreground'>Started</Label>
            <p className='text-sm'>{new Date(execution.startedAt).toLocaleString()}</p>
          </div>
          {execution.finishedAt && (
            <div>
              <Label className='text-sm font-medium text-muted-foreground'>Completed</Label>
              <p className='text-sm'>{new Date(execution.finishedAt).toLocaleString()}</p>
            </div>
          )}
          <div>
            <Label className='text-sm font-medium text-muted-foreground'>Duration</Label>
            <p className='text-sm'>{formatDuration(execution.startedAt, execution.finishedAt)}</p>
          </div>
        </div>

        {/* Steps */}
        <div className='space-y-3'>
          <h3 className='text-lg font-semibold text-foreground'>Pipeline Steps</h3>
          <div className='space-y-2'>
            {execution.steps.map((step, index) => {
              const stepConfig = getExecutionStatusConfig(step.status);
              return (
                <Card key={step.stepIndex}>
                  <CardContent className='p-4'>
                    <div className='flex justify-between items-start'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium'>
                            Step {index + 1}: {step.stepName}
                          </span>
                          <Badge
                            variant={stepConfig.variant}
                            className={`${stepConfig.className} text-xs`}
                          >
                            {getExecutionStatusText(step.status)}
                          </Badge>
                        </div>
                        {step.errorDetails && (
                          <p className='text-sm text-destructive'>
                            Error:{' '}
                            {typeof step.errorDetails === 'string'
                              ? step.errorDetails
                              : JSON.stringify(step.errorDetails)}
                          </p>
                        )}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {step.finishedAt
                          ? formatDuration(step.startedAt, step.finishedAt)
                          : 'Running...'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Context */}
        {execution.metadata && Object.keys(execution.metadata).length > 0 && (
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold text-foreground'>Execution Metadata</h3>
            <Card>
              <CardContent className='p-4'>
                <pre className='text-xs overflow-auto'>
                  {JSON.stringify(execution.metadata, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Missing Label import fix
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
