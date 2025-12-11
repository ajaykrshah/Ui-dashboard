import type { DashboardStats } from '@/features/dashboard/models/dashboard.ui.model';
import type { LucideIcon } from 'lucide-react';
import { Bell, CheckCircle2, FilePlus, Package, Rocket, XCircle } from 'lucide-react';

export type StatsCardVariant =
  | 'products'
  | 'activeProducts'
  | 'notifications'
  | 'patchesCreated'
  | 'failedPatches'
  | 'patchesReady';

export interface StatsCardConfigItem {
  key: keyof DashboardStats;
  icon: LucideIcon;
  variant: StatsCardVariant;
  title: string;
  subtitle: string;
  fallbackValue: number;
}

export const STATS_CARD_CONFIG: StatsCardConfigItem[] = [
  {
    key: 'totalProducts',
    icon: Package,
    variant: 'products',
    title: 'Total Products',
    subtitle: 'Number of products in the system',
    fallbackValue: 0,
  },
  {
    key: 'activeProducts',
    icon: CheckCircle2,
    variant: 'activeProducts',
    title: 'Active Products',
    subtitle: 'Currently enabled or in production',
    fallbackValue: 0,
  },
  {
    key: 'patchNotifications',
    icon: Bell,
    variant: 'notifications',
    title: 'Patch Notifications',
    subtitle: 'Notifications received today',
    fallbackValue: 0,
  },
  {
    key: 'patchesCreated',
    icon: FilePlus,
    variant: 'patchesCreated',
    title: 'Patches Created',
    subtitle: 'Patches created today',
    fallbackValue: 0,
  },
  {
    key: 'failedPatches',
    icon: XCircle,
    variant: 'failedPatches',
    title: 'Failed Patches',
    subtitle: 'Patches that failed today',
    fallbackValue: 0,
  },
  {
    key: 'patchesReady',
    icon: Rocket,
    variant: 'patchesReady',
    title: 'Patches Ready',
    subtitle: 'Patches successfully completed today',
    fallbackValue: 0,
  },
];
