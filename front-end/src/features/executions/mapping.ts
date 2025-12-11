import { ApiExecution, ApiStepRun } from './models/execution.api.model';
import { Execution, StepRun } from './models/execution.ui.model';

// Snake_case API → camelCase UI
export function mapStepRun(api: ApiStepRun): StepRun {
  return {
    stepIndex: api.step_index,
    stepName: api.step_name,
    scriptPath: api.script_path,
    scriptUrl: api.script_url ?? '',
    status: api.status,
    input: api.step_input ?? null,
    output: api.step_output ?? null,
    errorDetails: api.error_details ?? '',
    startedAt: api.started_at ?? '',
    finishedAt: api.finished_at ?? '',
    duration: api.duration ?? 0,
    retryCount: api.retry_count ?? 0,
    metadata: api.metadata ?? {},
  };
}

export function mapExecution(api: ApiExecution): Execution {
  return {
    executionId: api.execution_id,
    productId: api.product_id,
    productName: api.product_name,
    pipelineName: api.pipeline_name ?? '',
    status: api.status,
    startedAt: api.started_at,
    finishedAt: api.finished_at ?? '',
    duration: api.duration ?? 0,
    triggeredBy: api.triggered_by ?? '',
    environment: api.environment ?? '',
    steps: (api.steps || []).map(mapStepRun),
    totalSteps: api.total_steps,
    successfulSteps: api.successful_steps,
    failedSteps: api.failed_steps,
    skippedSteps: api.skipped_steps,
    currentStep: String(api.current_step ?? 0),
    progress: api.progress ?? 0,
    metadata: api.metadata ?? {},
  };
}

export function mapExecutions(api: ApiExecution[]): Execution[] {
  return api.map(mapExecution);
}
