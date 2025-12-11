'use client';

import { getStatusColorClass, getStatusDisplayText } from '@/shared/lib/status-mapper';

interface StatusBadgeProps {
  status: string; // Accept any string status - will be normalized internally
  children?: React.ReactNode; // Optional - can use auto-generated display text
  showOriginal?: boolean; // If true, show original status text instead of normalized
}

export function StatusBadge({ status, children, showOriginal = false }: StatusBadgeProps) {
  const displayText = children || (showOriginal ? status : getStatusDisplayText(status));

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(status)}`}
    >
      {displayText}
    </span>
  );
}
