/**
 * Execution Utilities
 *
 * Utility functions for execution history management
 */

import { Execution, ExecutionStatus, StepRun } from '../models/execution.ui.model';

/**
 * Status configuration for execution states
 */
export const EXECUTION_STATUS_CONFIGS = {
  success: {
    label: 'Success',
    variant: 'default' as const,
    className: 'text-green-600 dark:text-green-400',
    icon: 'CheckCircle',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive' as const,
    className: 'text-red-600 dark:text-red-400',
    icon: 'XCircle',
  },
  running: {
    label: 'Running',
    variant: 'secondary' as const,
    className: 'text-blue-600 dark:text-blue-400',
    icon: 'Play',
  },
  pending: {
    label: 'Pending',
    variant: 'outline' as const,
    className: 'text-yellow-600 dark:text-yellow-400',
    icon: 'Clock',
  },
  skipped: {
    label: 'Skipped',
    variant: 'secondary' as const,
    className: 'text-gray-600 dark:text-gray-400',
    icon: 'SkipForward',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'outline' as const,
    className: 'text-orange-600 dark:text-orange-400',
    icon: 'StopCircle',
  },
} as const;

/**
 * Get status configuration for execution status
 */
export const getExecutionStatusConfig = (status: ExecutionStatus) => {
  return EXECUTION_STATUS_CONFIGS[status] || EXECUTION_STATUS_CONFIGS.pending;
};

/**
 * Get status text for execution status
 */
export const getExecutionStatusText = (status: ExecutionStatus): string => {
  return getExecutionStatusConfig(status).label;
};

/**
 * Format execution duration
 */
export const formatDuration = (startTime?: string | number, endTime?: string | number): string => {
  if (!startTime) return 'N/A';

  let duration: number;
  if (typeof startTime === 'number') {
    // Duration provided directly
    duration = startTime;
  } else {
    // Calculate duration from start/end times
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : Date.now();
    duration = end - start;
  }

  if (duration < 1000) return `${duration}ms`;
  if (duration < 60000) return `${Math.round(duration / 1000)}s`;
  if (duration < 3600000) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.round((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  const hours = Math.floor(duration / 3600000);
  const minutes = Math.round((duration % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};

/**
 * Calculate execution progress
 */
export const calculateProgress = (completedSteps: number, totalSteps: number): number => {
  if (totalSteps === 0) return 0;
  return Math.round((completedSteps / totalSteps) * 100);
};

/**
 * Calculate pipeline progress from Execution
 */
export const calculatePipelineProgress = (execution: Execution): number => {
  if (execution.totalSteps === 0) return 0;

  const completedSteps = execution.steps.filter(
    (step) => step.status === 'success' || step.status === 'failed' || step.status === 'skipped'
  ).length;

  return Math.round((completedSteps / execution.totalSteps) * 100);
};

/**
 * Get current executing step
 */
export const getCurrentStep = (execution: Execution): StepRun | null => {
  return execution.steps.find((step) => step.status === 'running') || null;
};

/**
 * Convert pipeline run to execution summary
 */
// export const toExecutionSummary = (execution: Execution): ExecutionSummary => {
//   const currentStep = getCurrentStep(execution)

//   return {
//     executionId: execution.executionId,
//     productName: execution.productName,
//     status: execution.status,
//     startedAt: execution.startedAt,
//     duration: execution.duration,
//     totalSteps: execution.totalSteps,
//     currentStep: currentStep?.stepName,
//     progress: calculatePipelineProgress(execution)
//   }
// }

/**
 * Validate step execution order
 */
// export const validateStepOrder = (steps: StepRun[]): boolean => {
//   for (let i = 1; i < steps.length; i++) {
//     if (steps[i].stepIndex !== steps[i - 1].stepIndex + 1) {
//       return false
//     }
//   }
//   return true
// }

/**
 * Get execution health score (0-100)
 */
export const getExecutionHealthScore = (executions: Execution[]): number => {
  if (executions.length === 0) return 100;

  const successfulRuns = executions.filter((exec) => exec.status === 'success').length;
  return Math.round((successfulRuns / executions.length) * 100);
};

/**
 * Group executions by product
 */
export const groupExecutionsByProduct = (executions: Execution[]): Record<string, Execution[]> => {
  return executions.reduce(
    (groups, execution) => {
      const product = execution.productName;
      if (!groups[product]) {
        groups[product] = [];
      }
      groups[product].push(execution);
      return groups;
    },
    {} as Record<string, Execution[]>
  );
};

/**
 * Sort executions by start time (newest first)
 */
export const sortExecutionsByTime = (executions: Execution[]): Execution[] => {
  return [...executions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
};

/**
 * Filter executions by criteria
 */
export const filterExecutions = (
  executions: Execution[],
  filters: Partial<{
    status: ExecutionStatus;
    productName: string;
    dateRange: { start: string; end: string };
  }>
): Execution[] => {
  return executions.filter((execution) => {
    if (filters.status && execution.status !== filters.status) {
      return false;
    }

    if (
      filters.productName &&
      !execution.productName.toLowerCase().includes(filters.productName.toLowerCase())
    ) {
      return false;
    }

    if (filters.dateRange) {
      const execDate = new Date(execution.startedAt);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);

      if (execDate < startDate || execDate > endDate) {
        return false;
      }
    }

    return true;
  });
};
