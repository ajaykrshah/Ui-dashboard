import { apiClient } from '@/shared/lib/api';

import { mapExecutions } from './mapping';
import { ApiExecutionListResponse } from './models/execution.api.model';
import { Execution } from './models/execution.ui.model';

export class ExecutionService {
  private static readonly BASE_PATH = '/executions';

  /**
   * Get all executions with optional filtering and pagination
   */
  // static async getExecutions(params?: {
  //     filters?: ExecutionFilters;
  //     page?: number;
  //     pageSize?: number;
  //     sort?: string;
  //     order?: 'asc' | 'desc';
  // }): Promise<ApiListResponse<Execution>> {
  //     const response = await apiClient.get<ApiListResponse<Execution>>(this.BASE_PATH, params);
  //     return response.data;
  // }

  static async getExecutionHistory(filters: Record<string, any>): Promise<Execution[]> {
    const { data } = await apiClient.get<ApiExecutionListResponse>('/executions', filters);
    return mapExecutions(data.executions);
  }

  /**
   * Get a single execution by ID
   */
  static async getExecution(id: string): Promise<Execution> {
    const response = await apiClient.get<Execution>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  // /**
  //  * Create a new execution (trigger)
  //  */
  // static async createExecution(execution: CreateExecutionRequest): Promise<Execution> {
  //     const response = await apiClient.post<Execution>(this.BASE_PATH, execution);
  //     return response.data;
  // }

  // /**
  //  * Update an existing execution
  //  */
  // static async updateExecution(execution: UpdateExecutionRequest): Promise<Execution> {
  //     const response = await apiClient.patch<Execution>(`${this.BASE_PATH}/${execution.id}`, execution);
  //     return response.data;
  // }

  /**
   * Cancel a running execution
   */
  static async cancelExecution(id: string): Promise<Execution> {
    const response = await apiClient.patch<Execution>(`${this.BASE_PATH}/${id}/cancel`);
    return response.data;
  }

  /**
   * Retry a failed execution
   */
  static async retryExecution(id: string): Promise<Execution> {
    const response = await apiClient.post<Execution>(`${this.BASE_PATH}/${id}/retry`);
    return response.data;
  }

  /**
   * Get execution logs
   */
  static async getExecutionLogs(
    id: string,
    stepId?: string
  ): Promise<{ logs: string[]; hasMore: boolean }> {
    const params = stepId ? { stepId } : undefined;
    const response = await apiClient.get<{ logs: string[]; hasMore: boolean }>(
      `${this.BASE_PATH}/${id}/logs`,
      params
    );
    return response.data;
  }

  // /**
  //  * Get execution statistics
  //  */
  // static async getExecutionStats(filters?: {
  //     dateRange?: { start: string; end: string };
  //     productId?: number;
  // }): Promise<ExecutionStats> {
  //     const response = await apiClient.get<ExecutionStats>(`${this.BASE_PATH}/stats`, filters);
  //     return response.data;
  // }

  /**
   * Get recent executions for dashboard
   */
  static async getRecentExecutions(limit = 10): Promise<Execution[]> {
    const response = await apiClient.get<{ executions: Execution[] }>(`${this.BASE_PATH}/recent`, {
      limit,
    });
    return response.data.executions;
  }

  /**
   * Get execution timeline data for charts
   */
  static async getExecutionTimeline(params: {
    dateRange: { start: string; end: string };
    granularity: 'hour' | 'day' | 'week';
    productId?: number;
  }): Promise<{ labels: string[]; success: number[]; failed: number[] }> {
    const response = await apiClient.get<{ labels: string[]; success: number[]; failed: number[] }>(
      `${this.BASE_PATH}/timeline`,
      params
    );
    return response.data;
  }

  /**
   * Download execution report
   */
  static async downloadExecutionReport(
    id: string,
    format: 'pdf' | 'json' | 'csv' = 'pdf'
  ): Promise<Blob> {
    const response = await fetch(
      apiClient['buildUrl'](`${this.BASE_PATH}/${id}/report?format=${format}`),
      {
        headers: {
          Authorization: `Bearer ${apiClient.getAuthToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to download report');
    }

    return await response.blob();
  }

  /**
   * Get execution queue status
   */
  static async getQueueStatus(): Promise<{
    pending: number;
    running: number;
    maxConcurrent: number;
    estimatedWaitTime: number;
  }> {
    const response = await apiClient.get<{
      pending: number;
      running: number;
      maxConcurrent: number;
      estimatedWaitTime: number;
    }>(`${this.BASE_PATH}/queue/status`);
    return response.data;
  }
}
