// Generic Activity Feed Component - Following !ui enterprise patterns
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

export interface ActivityItem {
  id: number | string;
  title: string;
  timestamp: string;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
}

export interface ActivityFeedProps {
  title: string;
  description?: string;
  items: ActivityItem[];
  className?: string;
  isLoading?: boolean;
}

const ACTIVITY_VARIANTS = {
  default: 'w-2 h-2 bg-muted-foreground rounded-full',
  success: 'w-2 h-2 bg-emerald-500 rounded-full',
  error: 'w-2 h-2 bg-red-500 rounded-full',
  warning: 'w-2 h-2 bg-amber-500 rounded-full',
  info: 'w-2 h-2 bg-blue-500 rounded-full',
} as const;

export function ActivityFeed({
  title,
  description,
  items,
  className = '',
  isLoading = false,
}: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className='animate-pulse bg-muted h-5 w-32 rounded'></CardTitle>
          {description && <div className='animate-pulse bg-muted h-4 w-48 rounded'></div>}
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='flex items-center space-x-3'>
                <div className='animate-pulse bg-muted w-2 h-2 rounded-full'></div>
                <div className='flex-1 space-y-1'>
                  <div className='animate-pulse bg-muted h-4 w-40 rounded'></div>
                  <div className='animate-pulse bg-muted h-3 w-20 rounded'></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {items.map((item) => (
            <div key={item.id} className='flex items-center space-x-3'>
              <div className={ACTIVITY_VARIANTS[item.variant || 'default']}></div>
              <div className='flex-1'>
                <p className='text-sm font-medium'>{item.title}</p>
                <p className='text-xs text-muted-foreground'>{item.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
