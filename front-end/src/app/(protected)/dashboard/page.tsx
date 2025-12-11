'use client';

import { ActivityFeed } from '@/features/dashboard/components/ActivityFeed';
import { QuickActions } from '@/features/dashboard/components/QuickActions';
import { StatsCard } from '@/features/dashboard/components/StatsCard';
import { useDashboardData } from '@/features/dashboard/dashboard.query';
import { QUICK_ACTIONS } from '@/features/dashboard/quickActions.config';
import { STATS_CARD_CONFIG } from '@/features/dashboard/statsCards.config';

export default function DashboardPage() {
  const { statsData, recentActivity, isLoading } = useDashboardData();
  return (
    <>
      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Overview of automation portal activity and system health
        </p>
      </div>

      {/* Stats Grid - Using API data with variants */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8'>
        {STATS_CARD_CONFIG.map(({ key, icon, variant, title, subtitle, fallbackValue }) => (
          <StatsCard
            key={key}
            title={title}
            value={statsData[key] ?? fallbackValue}
            icon={icon}
            variant={variant}
            subtitle={subtitle}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className='text-2xl grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8'>
        <QuickActions
          title='Quick Actions'
          description='Common automation tasks and operations'
          actions={QUICK_ACTIONS}
          isLoading={isLoading}
        />

        <ActivityFeed
          title='Recent Activity'
          description='Latest automation executions and events'
          items={recentActivity}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
