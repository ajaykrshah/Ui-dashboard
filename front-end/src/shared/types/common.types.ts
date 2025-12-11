// // Product types
// export interface ProductMetadata {
//     cron: string;
//     name: string;
//     debug: boolean;
//     vendor: string;
//     enabled: boolean;
//     lastRanAt: string;
//     lastRanStatus: string;
//     automationScripts: string[];
//     needsNiniteCheck: boolean;
//     niniteProductName: string;
//     needsFileSizeCheck: boolean;
//     fileSizeUrl: string;
//     needsVendorWebsiteCheck: boolean;
//     vendorWebsiteRegex: string;
//     vendorWebsiteUrl: string;
// }

// export interface Product {
//     id: number;
//     name: string;
//     lastUpdated: string;
//     lastModifiedBy: string;
//     metadata: ProductMetadata;
// }

// // Execution types
// export interface ExecutionStep {
//     id: string;
//     stepId: string;
//     name: string;
//     status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
//     startTime: string;
//     endTime: string;
//     duration: number;
//     exitCode: number;
//     order: number;
//     context: {
//         environment: Record<string, string>;
//         retryCount: number;
//         maxRetries: number;
//     };
// }

// export interface Execution {
//     id: string;
//     productId: number;
//     productName: string;
//     pipelineId: string;
//     pipelineName: string;
//     status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
//     startTime: string;
//     endTime: string;
//     duration: number;
//     triggeredBy: string;
//     triggerType: 'manual' | 'scheduled' | 'webhook' | 'api';
//     branch: string;
//     commit: string;
//     steps: ExecutionStep[];
// }

// // Dashboard types
// export interface DashboardStatss {
//     totalProducts: number;
//     activeProducts: number;
//     totalExecutions: number;
//     successfulExecutions: number;
//     failedExecutions: number;
//     successRate: number;
//     averageExecutionTime: number;
//     executionsToday: number;
//     executionsThisWeek: number;
//     executionsThisMonth: number;
// }

// export interface Activity {
//     id: string;
//     type: 'execution_started' | 'execution_completed' | 'execution_failed' | 'product_updated' | 'product_created';
//     title: string;
//     description: string;
//     timestamp: string;
//     productId?: number;
//     productName?: string;
//     executionId?: string;
//     status?: 'success' | 'failed' | 'warning' | 'info';
// }

// // Vendor types
// export interface Vendor {
//     id: number;
//     name: string;
//     website: string;
//     description?: string;
//     logoUrl?: string;
//     contactEmail?: string;
//     products: Product[];
//     isActive: boolean;
//     createdAt: string;
//     updatedAt: string;
// }

// // Vendor creation/update interfaces
// export interface CreateVendorRequest {
//     name: string;
//     website: string;
//     description?: string;
//     logoUrl?: string;
//     contactEmail?: string;
// }

// export interface UpdateVendorRequest extends Partial<CreateVendorRequest> {
//     id: number;
// }

// // Vendor list filters
// export interface VendorFilters {
//     search?: string;
//     isActive?: boolean;
//     hasProducts?: boolean;
// }

// // Vendor statistics
// export interface VendorStats {
//     total: number;
//     active: number;
//     inactive: number;
//     withProducts: number;
//     totalProducts: number;
// }

// Common UI types
export interface TableColumn<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface SortOption {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  key: string;
  value: any;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'select'
    | 'checkbox'
    | 'textarea'
    | 'date'
    | 'time';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: any }[];
  validation?: any; // Zod schema
}

// Status types
export type Status = 'success' | 'error' | 'warning' | 'info' | 'pending';

export interface StatusBadgeProps {
  status: Status;
  text?: string;
  className?: string;
}
