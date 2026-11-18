// ============================================================================
// SweetCrumb Bakery - StatCard Component
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/charts';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  trend?: number[];
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon,
  trend,
  className,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className={cn('p-6 bg-white rounded-2xl border border-border', className)}>
        <div className="h-4 w-1/3 bg-charcoal-100 rounded animate-pulse mb-4" />
        <div className="h-8 w-1/2 bg-charcoal-100 rounded animate-pulse" />
        {change && <div className="h-3 w-1/4 bg-charcoal-100 rounded animate-pulse mt-2" />}
      </div>
    );
  }

  return (
    <div className={cn('p-6 bg-white rounded-2xl border border-border transition-shadow hover:shadow-md', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-caption text-text-muted uppercase tracking-wider">{title}</p>
          <p className={cn(
            'mt-1 text-display-sm font-semibold text-charcoal-900 truncate',
            changeType === 'negative' && 'text-red-600'
          )}>
            {value}
          </p>
          {subtitle && <p className="mt-1 text-caption text-text-muted">{subtitle}</p>}
          {change && (
            <div className="mt-2 flex items-center gap-1">
              <span className={cn(
                'text-body-sm font-medium',
                changeType === 'positive' ? 'text-green-600' :
                changeType === 'negative' ? 'text-red-600' :
                'text-text-muted'
              )}>
                {change}
              </span>
              {trend && trend.length > 0 && (
                <Sparkline
                  data={trend}
                  color={changeType === 'positive' ? 'hsl(var(--green))' : changeType === 'negative' ? 'hsl(var(--red))' : 'hsl(var(--muted))'}
                  height={24}
                  className="w-24 ml-2"
                />
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
            changeType === 'positive' ? 'bg-green-100 text-green-600' :
            changeType === 'negative' ? 'bg-red-100 text-red-600' :
            'bg-warm-100 text-warm-600'
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}