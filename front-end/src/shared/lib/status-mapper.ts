/**
 * Centralized status mapping utility
 * Normalizes different status values from various modules/services to consistent internal statuses
 */

// Our internal standard status types
export type StandardStatus =
  | 'success' // Green - completed successfully
  | 'failed' // Red - failed/error
  | 'running' // Blue - in progress
  | 'pending' // Yellow - waiting to start
  | 'cancelled' // Gray - cancelled/stopped
  | 'inactive'; // Gray - not active/disabled

// Status mapping from external/legacy values to our standard
const STATUS_MAPPING: Record<string, StandardStatus> = {
  // Success variants
  success: 'success',
  completed: 'success',
  complete: 'success',
  done: 'success',
  finished: 'success',
  passed: 'success',
  ok: 'success',
  active: 'success',

  // Failed variants
  failed: 'failed',
  error: 'failed',
  failure: 'failed',
  rejected: 'failed',
  denied: 'failed',
  invalid: 'failed',

  // Running variants
  running: 'running',
  processing: 'running',
  executing: 'running',
  in_progress: 'running',
  'in-progress': 'running',
  working: 'running',

  // Pending variants
  pending: 'pending',
  waiting: 'pending',
  queued: 'pending',
  scheduled: 'pending',
  ready: 'pending',

  // Cancelled variants
  cancelled: 'cancelled',
  canceled: 'cancelled',
  stopped: 'cancelled',
  aborted: 'cancelled',
  terminated: 'cancelled',
  skipped: 'cancelled',

  // Inactive variants
  inactive: 'inactive',
  disabled: 'inactive',
  offline: 'inactive',
  paused: 'inactive',
  suspended: 'inactive',
};

/**
 * Maps any status string to our standard status
 */
export function mapToStandardStatus(status: string): StandardStatus {
  if (!status) return 'inactive';

  const normalized = status.toLowerCase().trim();
  return STATUS_MAPPING[normalized] || 'inactive';
}

/**
 * Gets the display color class for a status
 */
export function getStatusColorClass(status: string): string {
  const standardStatus = mapToStandardStatus(status);

  switch (standardStatus) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'running':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
    case 'inactive':
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Gets the display text for a status (capitalizes first letter)
 */
export function getStatusDisplayText(status: string): string {
  const standardStatus = mapToStandardStatus(status);
  return standardStatus.charAt(0).toUpperCase() + standardStatus.slice(1);
}

/**
 * Type guard to check if a status is a success state
 */
export function isSuccessStatus(status: string): boolean {
  return mapToStandardStatus(status) === 'success';
}

/**
 * Type guard to check if a status is a failure state
 */
export function isFailureStatus(status: string): boolean {
  return mapToStandardStatus(status) === 'failed';
}

/**
 * Type guard to check if a status is an active/running state
 */
export function isActiveStatus(status: string): boolean {
  const standardStatus = mapToStandardStatus(status);
  return standardStatus === 'running' || standardStatus === 'pending';
}
