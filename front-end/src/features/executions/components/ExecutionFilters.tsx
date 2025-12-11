'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExecutionFilterState, ExecutionStatus } from '../models/execution.ui.model';
import { getExecutionStatusConfig, getExecutionStatusText } from '../utils/executionUtils';

interface ExecutionFiltersProps {
  filters: ExecutionFilterState;
  onFilterChange: (filters: Partial<ExecutionFilterState>) => void;
  onStatusFilter: (status: ExecutionStatus | '') => void;
  onDateRangeFilter: (start: string, end: string) => void;
}

const EXECUTION_STATUSES: ExecutionStatus[] = [
  'running',
  'success',
  'failed',
  'cancelled',
  'pending',
];

export function ExecutionFilters({
  filters,
  onFilterChange,
  onStatusFilter,
  onDateRangeFilter,
}: ExecutionFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({
      status: '',
      template: '',
      dateRange: { start: '', end: '' },
    });
  };

  const hasActiveFilters =
    filters.status || filters.template || filters.dateRange.start || filters.dateRange.end;

  return (
    <div className='space-y-4'>
      {/* Status Filter */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium text-muted-foreground'>Status</Label>
        <div className='flex flex-wrap gap-2'>
          <Badge
            variant={!filters.status ? 'default' : 'outline'}
            className='cursor-pointer'
            onClick={() => onStatusFilter('')}
          >
            All
          </Badge>
          {EXECUTION_STATUSES.map((status) => {
            const config = getExecutionStatusConfig(status);
            const isActive = filters.status === status;
            return (
              <Badge
                key={status}
                variant={isActive ? config.variant : 'outline'}
                className={`cursor-pointer ${isActive ? config.className : ''}`}
                onClick={() => onStatusFilter(status)}
              >
                {getExecutionStatusText(status)}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='start-date' className='text-sm font-medium text-muted-foreground'>
            Start Date
          </Label>
          <Input
            id='start-date'
            type='datetime-local'
            value={filters.dateRange.start}
            onChange={(e) => onDateRangeFilter(e.target.value, filters.dateRange.end)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='end-date' className='text-sm font-medium text-muted-foreground'>
            End Date
          </Label>
          <Input
            id='end-date'
            type='datetime-local'
            value={filters.dateRange.end}
            onChange={(e) => onDateRangeFilter(filters.dateRange.start, e.target.value)}
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className='flex justify-end'>
          <Button variant='outline' onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
