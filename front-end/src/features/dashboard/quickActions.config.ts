import type { QuickAction } from '@/features/dashboard/components/QuickActions'; // import type for strict TS
import { FileText, Package, Play, Users } from 'lucide-react';

// We can add more actions or extract onClick handlers to your dashboard logic/services
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'create-product',
    title: 'Create Product',
    description: 'Add new product to automation',
    icon: Package,
    onClick: () => console.log('Create product clicked'),
  },
  {
    id: 'run-automation',
    title: 'Run Automation',
    description: 'Execute automation pipeline',
    icon: Play,
    onClick: () => console.log('Run automation clicked'),
  },
  {
    id: 'view-reports',
    title: 'View Reports',
    description: 'Access execution reports',
    icon: FileText,
    onClick: () => console.log('View reports clicked'),
  },
  {
    id: 'manage-vendors',
    title: 'Manage Vendors',
    description: 'Configure vendor settings',
    icon: Users,
    onClick: () => console.log('Manage vendors clicked'),
  },
];
