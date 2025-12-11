/**
 * Dashboard UI Models
 * Types for UI state and display
 */

export interface DashboardCardData {
  title: string;
  value: string | number;
  change: number;
  color: string;
  bgColor: string;
}

export interface QuickLinkData {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  patchNotifications: number;
  patchesCreated: number;
  failedPatches: number;
  patchesReady: number;
}

export interface ActivityItem {
  id: number;
  type: string;
  title: string;
  description?: string;
  timestamp: string;
}
