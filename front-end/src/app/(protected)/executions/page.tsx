// src/app/(protected)/executions/page.tsx

'use client';

import { ExecutionAccordion, ExecutionFilters } from '@/features/executions/components';
import { useExecutionHistory } from '@/features/executions/execution.query';
import { ExecutionFilterState } from '@/features/executions/models/execution.ui.model';
import { useState } from 'react';

export default function ExecutionHistoryPage() {
  const [filters, setFilters] = useState<ExecutionFilterState>({
    status: '',
    template: '',
    dateRange: { start: '', end: '' },
  });
  const {
    data: executions = [],
    isLoading: loading,
    error,
    refetch: reloadExecutions,
  } = useExecutionHistory(filters);

  const handleFilterChange = (updates: Partial<ExecutionFilterState>) =>
    setFilters((old) => ({ ...old, ...updates }));

  if (error) {
    return (
      <>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center py-12'>
            <h1 className={`text-3xl font-bold text-foreground mb-4`}>Error Loading Executions</h1>
            <p className='text-red-600 dark:text-red-400'>{error.message}</p>
            <button
              onClick={() => reloadExecutions()}
              className='mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className='max-w-7xl mx-auto space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className={`text-3xl font-bold text-foreground mb-2`}>Execution History</h1>
            <p className='text-muted-foreground'>
              Track and monitor pipeline execution status and results
            </p>
          </div>
          <button
            onClick={() => reloadExecutions()}
            disabled={loading}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50'
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <ExecutionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onStatusFilter={(status) => handleFilterChange({ status })}
          onDateRangeFilter={(start, end) => handleFilterChange({ dateRange: { start, end } })}
        />
        <div className='space-y-4'>
          {loading ? (
            <div className='text-center py-12'>
              <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
              <p className={`$"text-muted-foreground" mt-4`}>Loading executions...</p>
            </div>
          ) : executions.length === 0 ? (
            <div className='text-center py-12'>
              <h3 className={`text-lg font-semibold text-foreground mb-2`}>No Executions Found</h3>
              <p className='text-muted-foreground'>
                No execution history matches your current filters.
              </p>
            </div>
          ) : (
            <>
              <div className='flex justify-between items-center'>
                <p className='text-muted-foreground'>
                  Showing {executions.length} execution{executions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className='space-y-3'>
                <ExecutionAccordion
                  executions={executions}
                  isLoading={loading}
                  onRefresh={reloadExecutions}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
