import { z } from 'zod';

export const StepRunSchema = z.object({
  stepIndex: z.number(),
  stepName: z.string(),
  scriptPath: z.string(),
  status: z.string(),
  input: z.any().optional(),
  output: z.any().optional(),
  errorDetails: z.string().optional(),
  startedAt: z.string().optional(),
  finishedAt: z.string().optional(),
  duration: z.number().optional(),
  retryCount: z.number().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const ExecutionSchema = z.object({
  executionId: z.string(),
  productId: z.number(),
  productName: z.string(),
  pipelineName: z.string().optional(),
  status: z.string(),
  startedAt: z.string(),
  finishedAt: z.string().optional(),
  duration: z.number().optional(),
  triggeredBy: z.string().optional(),
  environment: z.string().optional(),
  steps: z.array(StepRunSchema),
  totalSteps: z.number(),
  successfulSteps: z.number(),
  failedSteps: z.number(),
  skippedSteps: z.number(),
  currentStep: z.string().optional(),
  progress: z.number(),
  metadata: z.record(z.unknown()).optional(),
});
