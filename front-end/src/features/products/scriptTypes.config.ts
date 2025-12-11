import { Bell, CheckCircle, Package as PackageIcon, Rocket } from 'lucide-react';

export type ScriptTypeConfig = {
  id: 'NOTIFICATION' | 'CREATE_PATCH' | 'CREATE_BUILD' | 'DEPLOY_VALIDATION';
  index: number;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
};

export const SCRIPT_TYPES: ScriptTypeConfig[] = [
  {
    id: 'NOTIFICATION',
    index: 0,
    name: 'Gather Notification',
    description: 'Monitor vendor channels and collect patch release notifications',
    icon: Bell,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    id: 'CREATE_PATCH',
    index: 1,
    name: 'Create Patch',
    description: 'Download vendor releases and generate patches',
    icon: PackageIcon,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  {
    id: 'CREATE_BUILD',
    index: 2,
    name: 'Generate QA Build',
    description: 'Prepare the build by QA testing environment',
    icon: Rocket,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    id: 'DEPLOY_VALIDATION',
    index: 3,
    name: 'Deploy & Validate Build',
    description: 'Deploy & Execute test, and verify installation',
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950',
  },
];

export function getScriptTypeByIndex(index: number) {
  const ordered = [...SCRIPT_TYPES].sort((a, b) => a.index - b.index);
  return (
    ordered[index] ?? {
      id: 'DEPLOY_VALIDATION',
      index: -1,
      name: 'Script',
      description: 'Automation Script',
      icon: PackageIcon,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
    }
  );
}
