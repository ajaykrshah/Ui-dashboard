'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import type { LucideIcon } from 'lucide-react';

export interface QuickAction {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  disabled?: boolean;
}

export interface QuickActionsProps {
  title: string;
  description?: string;
  actions: QuickAction[];
  className?: string;
  isLoading?: boolean;
}

export function QuickActions({
  title,
  description,
  actions,
  className = '',
  isLoading = false,
}: QuickActionsProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className='animate-pulse bg-muted h-5 w-32 rounded' />
          {typeof description === 'string' ? (
            <div className='animate-pulse bg-muted h-4 w-48 rounded' />
          ) : null}
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='animate-pulse bg-muted h-10 rounded'></div>
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
        {typeof description === 'string' ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {actions.map((action) => {
            const { id, title, description, icon: Icon, onClick, variant, disabled } = action;
            return (
              <Button
                key={id}
                variant={variant || 'outline'}
                className={`
                  justify-start h-auto p-3 transition-all duration-200
                  ${
                    !disabled
                      ? 'cursor-pointer hover:scale-[1.02] hover:shadow-md active:scale-[0.98]'
                      : 'cursor-not-allowed opacity-50'
                  }
                `}
                onClick={onClick}
                disabled={disabled}
                role='button'
                tabIndex={disabled ? -1 : 0}
              >
                {Icon ? <Icon className='w-4 h-4 mr-2 shrink-0' /> : null}
                <div className='text-left flex-1'>
                  <div className='text-sm font-medium'>{title}</div>
                  {typeof description === 'string' ? (
                    <div className='text-xs text-muted-foreground'>{description}</div>
                  ) : null}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
