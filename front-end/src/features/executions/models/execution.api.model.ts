export type ApiExecutionStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'skipped';

export interface ApiStepRun {
  step_index: number;
  step_name: string;
  script_path: string;
  script_url?: string;
  status: ApiExecutionStatus;
  step_input?: any | null;
  step_output?: any | null;
  error_details?: string;
  started_at?: string;
  finished_at?: string;
  duration?: number;
  retry_count?: number;
  metadata?: Record<string, unknown>;
}

export interface ApiExecution {
  execution_id: string;
  product_id: number;
  product_name: string;
  pipeline_name?: string;
  status: ApiExecutionStatus;
  started_at: string;
  finished_at?: string;
  duration?: number;
  triggered_by?: string;
  environment?: string;
  steps: ApiStepRun[];
  total_steps: number;
  successful_steps: number;
  failed_steps: number;
  skipped_steps: number;
  current_step?: string;
  progress: number;
  metadata?: Record<string, unknown>;
}

export interface ApiExecutionListResponse {
  executions: ApiExecution[];
}
