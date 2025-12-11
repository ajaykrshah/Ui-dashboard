'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { LucideIcon } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  variant?: string;
  className?: string;
  isLoading?: boolean;
}

const STATS_VARIANTS = {
  products: {
    card: '',
    value: 'text-2xl font-bold text-blue-600 dark:text-blue-400',
    icon: 'h-5 w-5 text-blue-600 dark:text-blue-400',
    subtitle: 'text-xs text-muted-foreground',
  },
  activeProducts: {
    card: '',
    value: 'text-2xl font-bold text-green-600 dark:text-green-400',
    icon: 'h-5 w-5 text-green-600 dark:text-green-400',
    subtitle: 'text-xs text-muted-foreground',
  },
  notifications: {
    card: '',
    value: 'text-2xl font-bold text-yellow-600 dark:text-yellow-400',
    icon: 'h-5 w-5 text-yellow-600 dark:text-yellow-400',
    subtitle: 'text-xs text-muted-foreground',
  },
  patchesCreated: {
    card: '',
    value: 'text-2xl font-bold text-green-600 dark:text-green-400',
    icon: 'h-5 w-5 text-green-600 dark:text-green-400',
    subtitle: 'text-xs text-muted-foreground',
  },
  failedPatches: {
    card: '',
    value: 'text-2xl font-bold text-red-600 dark:text-red-400',
    icon: 'h-5 w-5 text-red-600 dark:text-red-400',
    subtitle: 'text-xs text-muted-foreground',
  },
  patchesReady: {
    card: '',
    value: 'text-2xl font-bold text-blue-600 dark:text-blue-400',
    icon: 'h-5 w-5 text-blue-600 dark:text-blue-400',
    subtitle: 'text-xs text-muted-foreground',
  },
  performance: {
    card: 'bg-emerald-50 dark:bg-emerald-950/20 border-border',
    value: 'text-2xl font-bold text-emerald-600 dark:text-emerald-400',
    icon: 'h-5 w-5 text-emerald-600 dark:text-emerald-400',
    subtitle: 'text-xs text-emerald-600/80 dark:text-emerald-400/80',
  },
} as const;

// Only spread subtitle if defined and string
export function StatsCard(props: StatsCardProps) {
  const {
    title,
    value,
    icon: Icon,
    subtitle,
    variant = 'products',
    className = '',
    isLoading = false,
  } = props;
  const styles = STATS_VARIANTS[variant as keyof typeof STATS_VARIANTS] || STATS_VARIANTS.products;

  if (isLoading) {
    return (
      <Card className={`${styles.card} ${className}`}>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium animate-pulse bg-muted h-4 w-24 rounded'></CardTitle>
          <div className='h-5 w-5 animate-pulse bg-muted rounded'></div>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse bg-muted h-8 w-16 rounded mb-2'></div>
          <div className='animate-pulse bg-muted h-3 w-20 rounded'></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`${styles.card} ${className} transition-all duration-200 ease-out shadow-md hover:bg-accent`}
      tabIndex={0}
    >
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className={`text-sm font-medium text-foreground`}>{title}</CardTitle>
        <Icon className={styles.icon} />
      </CardHeader>
      <CardContent>
        <div className={styles.value}>{value}</div>
        {typeof subtitle === 'string' && <p className={styles.subtitle}>{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
