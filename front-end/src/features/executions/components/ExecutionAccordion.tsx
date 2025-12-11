'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronRight, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Execution, ExecutionStatus, StepRun } from '../models/execution.ui.model';
import {
  formatDuration,
  getExecutionStatusConfig,
  getExecutionStatusText,
} from '../utils/executionUtils';
import { StepIOCard } from './StepIOCard';

// Step status utility following enterprise patterns
const getStepStatusIndicator = (status: string) => {
  const config = getExecutionStatusConfig(status as ExecutionStatus);
  const colorClass = config.className.includes('green')
    ? 'bg-green-500'
    : config.className.includes('red')
      ? 'bg-red-500'
      : config.className.includes('blue')
        ? 'bg-blue-500'
        : config.className.includes('yellow')
          ? 'bg-yellow-500'
          : 'bg-gray-500';

  return <div className={`w-3 h-3 rounded-full ${colorClass}`} />;
};

// Step actions component
const StepActions = ({ step }: { step: StepRun }) => {
  const handleDownloadOutput = () => {
    if (step.output) {
      const data = JSON.stringify(step.output, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${step.stepName}_output.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleViewScript = () => {
    const scriptUrl =
      step.scriptUrl ||
      `https://github.com/ivantiinc/ESG-Content.PatchAutomations/blob/master/${step.scriptPath}`;
    window.open(scriptUrl, '_blank');
  };

  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={handleDownloadOutput}
        disabled={!step.output}
        className='text-xs'
      >
        <Download className='w-3 h-3 mr-1' />
        Output
      </Button>
      <Button variant='outline' size='sm' onClick={handleViewScript} className='text-xs'>
        <ExternalLink className='w-3 h-3 mr-1' />
        Script
      </Button>
    </div>
  );
};

// Individual pipeline step component
const PipelineStep = ({ step, index }: { step: StepRun; index: number }) => {
  const statusConfig = getExecutionStatusConfig(step.status as ExecutionStatus);

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex items-start gap-4'>
          {/* Step Number & Status */}
          <div className='flex items-center gap-3 min-w-0'>
            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium'>
              {index + 1}
            </div>
            {getStepStatusIndicator(step.status)}
          </div>

          {/* Step Details */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
              <span className={`text-foreground font-medium`}>{step.stepName}</span>
              <Badge variant={statusConfig.variant} className='text-xs'>
                {getExecutionStatusText(step.status)}
              </Badge>
            </div>

            <div className={`text-muted-foreground text-sm mb-2`}>{step.scriptPath}</div>

            {step.errorDetails && (
              <div className='text-sm text-destructive mb-2'>
                Error:{' '}
                {typeof step.errorDetails === 'string'
                  ? step.errorDetails
                  : JSON.stringify(step.errorDetails)}
              </div>
            )}

            {/* Input/Output Data - Professional, theme-compliant UI */}
            <div className='mt-3 space-y-3'>
              {/* {step.input && (
                <StepIOCard label="Input" data={step.input} />
              )} */}
              {step.output && <StepIOCard label='Output' data={step.output} />}
            </div>
          </div>

          {/* Timing & Actions */}
          <div className='flex flex-col items-end gap-3'>
            <div className='text-right'>
              <div className={`text-foreground text-sm font-medium`}>
                {step.finishedAt
                  ? formatDuration(step.startedAt, step.finishedAt)
                  : step.status === 'running'
                    ? 'Running...'
                    : 'Pending...'}
              </div>
              {step.startedAt && (
                <div className={`text-muted-foreground text-xs`}>
                  {new Date(step.startedAt).toLocaleTimeString()}
                </div>
              )}
            </div>
            <StepActions step={step} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ExecutionAccordionProps {
  executions: Execution[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function ExecutionAccordion({ executions, isLoading, onRefresh }: ExecutionAccordionProps) {
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);

  const toggleExpansion = (executionId: string) => {
    // Only one execution can be expanded at a time
    setExpandedExecution(expandedExecution === executionId ? null : executionId);
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-semibold text-foreground'>Executions</h3>
          <Button variant='outline' onClick={onRefresh} disabled>
            Refresh
          </Button>
        </div>
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-20 w-full' />
          ))}
        </div>
      </div>
    );
  }

  if (executions.length === 0) {
    return (
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-semibold text-foreground'>Executions</h3>
          <Button variant='outline' onClick={onRefresh}>
            Refresh
          </Button>
        </div>
        <Card>
          <CardContent className='p-8 text-center'>
            <p className='text-muted-foreground'>No executions found</p>
            <p className={`text-muted-foreground text-sm mt-1`}>
              Pipeline executions will appear here once started
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold text-foreground'>Executions ({executions.length})</h3>
        <Button variant='outline' onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      {/* Execution Accordion - Single Open */}
      <div className='space-y-3'>
        {executions.map((execution) => {
          const statusConfig = getExecutionStatusConfig(execution.status as ExecutionStatus);
          const progress = Math.round((execution.successfulSteps / execution.totalSteps) * 100);
          const isExpanded = expandedExecution === execution.executionId;

          return (
            <Card key={execution.executionId} className='overflow-hidden'>
              {/* Main Execution Row */}
              <CardContent
                className='p-4 cursor-pointer hover:bg-accent/5 transition-colors'
                onClick={() => toggleExpansion(execution.executionId)}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    {/* Expand/Collapse Icon */}
                    {isExpanded ? (
                      <ChevronDown className='w-5 h-5 text-muted-foreground' />
                    ) : (
                      <ChevronRight className='w-5 h-5 text-muted-foreground' />
                    )}

                    {/* Pipeline Info */}
                    <div>
                      <div className={`text-foreground font-medium`}>{execution.productName}</div>
                      <div className={`text-muted-foreground text-sm`}>
                        ID: {execution.executionId.slice(0, 8)}... • Started:{' '}
                        {new Date(execution.startedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    {/* Status Badge */}
                    <Badge variant={statusConfig.variant}>
                      {getExecutionStatusText(execution.status)}
                    </Badge>

                    {/* Duration & Progress */}
                    <div className='text-right'>
                      <div className={`text-foreground text-sm font-medium`}>
                        {formatDuration(execution.startedAt, execution.finishedAt)}
                      </div>
                      <div className={`text-muted-foreground text-xs`}>
                        {execution.successfulSteps}/{execution.totalSteps} steps • {progress}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className='w-24 bg-muted rounded-full h-2'>
                      <div
                        className='bg-primary h-2 rounded-full transition-all duration-300'
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Expandable Steps Section */}
              {isExpanded && (
                <div className='border-t border-border bg-muted/20'>
                  <div className='p-6'>
                    <h4 className={`text-sm font-semibold text-foreground mb-4`}>Pipeline Steps</h4>
                    <div className='space-y-4'>
                      {execution.steps.map((step, index) => (
                        <PipelineStep key={step.stepIndex} step={step} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
