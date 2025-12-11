export type ExecutionStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'skipped';

// Each pipeline step
export interface StepRun<TInput = any, TOutput = any> {
  stepIndex: number;
  stepName: string;
  scriptPath: string;
  scriptUrl?: string;
  status: ExecutionStatus;
  input?: TInput | null;
  output?: TOutput | null;
  errorDetails?: string;
  startedAt?: string;
  finishedAt?: string;
  duration?: number;
  retryCount?: number;
  metadata?: Record<string, unknown>;
}

// One execution record (historical row)
export interface Execution {
  executionId: string;
  productId: number;
  productName: string;
  pipelineName?: string;
  status: ExecutionStatus;
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  triggeredBy?: string;
  environment?: string;
  steps: StepRun[];
  totalSteps: number;
  successfulSteps: number;
  failedSteps: number;
  skippedSteps: number;
  currentStep?: string;
  progress: number;
  metadata?: Record<string, unknown>;
}

// Table filter state for UI
export interface ExecutionFilterState {
  status: ExecutionStatus | '';
  template: string;
  dateRange: { start: string; end: string };
}
