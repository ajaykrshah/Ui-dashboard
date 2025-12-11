/**
 * Execution Query Functions
 * React Query hooks for execution data
 *
 * Feature-owned query keys - executions domain only
 * Following feature isolation principles for code ownership and modularity
 */

import { useQuery } from '@tanstack/react-query';
import { ExecutionService } from './execution.service';
import { Execution } from './models/execution.ui.model';

// Execution query params type - combining filter params with API params
type ExecutionsQueryParams = {
  search?: string | undefined;
  productId?: number | undefined; // API expects number
  vendorId?: string | undefined;
  status?: string | undefined;
  triggerType?: string | undefined;
  dateFrom?: string | undefined;
  dateTo?: string | undefined;
  dateRange?:
    | {
        start: string;
        end: string;
      }
    | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
  limit?: number | undefined;
};

// Query keys - centralized and exported
export const EXECUTIONS_QUERY_KEY = ['executions'] as const;
export const EXECUTION_DETAIL_QUERY_KEY = (id: string) => ['executions', 'detail', id] as const;
export const EXECUTION_HISTORY_QUERY_KEY = ['executions', 'history'] as const;

// Query keys factory
export const executionKeys = {
  all: () => EXECUTIONS_QUERY_KEY,
  lists: () => [...EXECUTIONS_QUERY_KEY, 'list'] as const,
  list: (params?: ExecutionsQueryParams) => [...EXECUTIONS_QUERY_KEY, 'list', params] as const,
  details: () => [...EXECUTIONS_QUERY_KEY, 'detail'] as const,
  detail: (id: string) => EXECUTION_DETAIL_QUERY_KEY(id),
  history: () => EXECUTION_HISTORY_QUERY_KEY,
};

// Executions list query
// export function useExecutions(params?: ExecutionsQueryParams) {
//     return useQuery({
//         queryKey: executionKeys.list(params),
//         queryFn: () => {
//             // Transform params to match service signature
//             if (!params) return ExecutionService.getExecutions();

//             const { page, pageSize, limit, ...filters } = params;

//             // Build service params with only defined values
//             const serviceParams: {
//                 filters?: any;
//                 page?: number;
//                 pageSize?: number;
//                 sort?: string;
//                 order?: 'asc' | 'desc';
//             } = {
//                 filters,
//                 sort: 'createdAt',
//                 order: 'desc'
//             };

//             if (page !== undefined) serviceParams.page = page;
//             if (pageSize !== undefined) serviceParams.pageSize = pageSize;

//             return ExecutionService.getExecutions(serviceParams);
//         },
//         staleTime: 30 * 1000, // 30 seconds (more frequent for real-time data)
//         refetchInterval: 60 * 1000, // 1 minute
//     });
// }

// Execution history query
export function useExecutionHistory(filters = {}) {
  return useQuery<Execution[]>({
    queryKey: ['executions', filters],
    queryFn: () => ExecutionService.getExecutionHistory(filters), // Service handles mapping
    staleTime: 2 * 60 * 1000,
  });
}

// Single execution query
export function useExecution(id: string) {
  return useQuery({
    queryKey: EXECUTION_DETAIL_QUERY_KEY(id),
    queryFn: () => ExecutionService.getExecution(id),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!id,
  });
}
