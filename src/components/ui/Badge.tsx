// ============================================================================
// SweetCrumb Bakery - Badge & Label Components
// ============================================================================

import React, { forwardRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

// -----------------------------------------------------------------------------
// Badge
// -----------------------------------------------------------------------------

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  dotColor?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', size = 'md', dot, dotColor, className, children, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-primary-light text-primary',
      secondary: 'bg-sage-100 text-sage-700',
      success: 'bg-sage-100 text-sage-700',
      warning: 'bg-warm-100 text-warm-700',
      error: 'bg-rose-100 text-rose-700',
      neutral: 'bg-charcoal-100 text-charcoal-700',
      outline: 'bg-transparent border-2 border-border-strong text-text-secondary',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-[10px] gap-1',
      md: 'px-2.5 py-0.5 text-caption gap-1.5',
      lg: 'px-3 py-1 text-body-sm gap-2',
    };

    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center font-medium rounded-full',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColor ? '' : 'bg-current')}
            style={dotColor ? { backgroundColor: dotColor } : undefined}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// -----------------------------------------------------------------------------
// Status Badge (specific for order statuses)
// -----------------------------------------------------------------------------

import type { OrderStatusName } from '@/types';

interface StatusBadgeProps {
  status: OrderStatusName;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const statusConfig: Record<OrderStatusName, { variant: BadgeProps['variant']; label: string; icon: React.ReactNode }> = {
    Pending: {
      variant: 'warning',
      label: 'Pending',
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    Confirmed: {
      variant: 'primary',
      label: 'Confirmed',
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    Preparing: {
      variant: 'secondary',
      label: 'Preparing',
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    },
    'Ready for Pickup': {
      variant: 'success',
      label: 'Ready for Pickup',
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17 7c.588.677.888 1.485.986 2.36A8 8 0 1122 13c-.5.77-.99 1.583-1.343 2.36a13.977 13.977 0 01-3.657-1.343z" /></svg>,
    },
    Completed: {
      variant: 'neutral',
      label: 'Completed',
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    Cancelled: {
      variant: 'neutral',
      label: 'Cancelled',
      icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <Badge variant={config.variant} size={size} dot={showIcon}>
      {showIcon && <span className="flex-shrink-0">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}

// -----------------------------------------------------------------------------
// Availability Badge
// -----------------------------------------------------------------------------

import type { AvailabilityStatus } from '@/types';

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function AvailabilityBadge({ status, size = 'md' }: AvailabilityBadgeProps) {
  const statusConfig: Record<AvailabilityStatus, { variant: BadgeProps['variant']; label: string }> = {
    Available: { variant: 'success', label: 'Available' },
    Limited: { variant: 'warning', label: 'Limited' },
    'Out of Stock': { variant: 'error', label: 'Out of Stock' },
    Discontinued: { variant: 'neutral', label: 'Discontinued' },
  };

  const config = statusConfig[status] || statusConfig.Available;

  return <Badge variant={config.variant} size={size}>{config.label}</Badge>;
}

// -----------------------------------------------------------------------------
// Account Status Badge
// -----------------------------------------------------------------------------

import type { AccountStatus } from '@/types';

interface AccountStatusBadgeProps {
  status: AccountStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function AccountStatusBadge({ status, size = 'md' }: AccountStatusBadgeProps) {
  const statusConfig: Record<AccountStatus, { variant: BadgeProps['variant']; label: string }> = {
    Active: { variant: 'success', label: 'Active' },
    Inactive: { variant: 'neutral', label: 'Inactive' },
    Suspended: { variant: 'error', label: 'Suspended' },
  };

  const config = statusConfig[status] || statusConfig.Active;

  return <Badge variant={config.variant} size={size}>{config.label}</Badge>;
}

// -----------------------------------------------------------------------------
// Notification Type Badge
// -----------------------------------------------------------------------------

import type { NotificationType } from '@/types';

interface NotificationTypeBadgeProps {
  type: NotificationType;
  size?: 'sm' | 'md' | 'lg';
}

export function NotificationTypeBadge({ type, size = 'md' }: NotificationTypeBadgeProps) {
  const typeConfig: Record<NotificationType, { variant: BadgeProps['variant']; label: string }> = {
    'Order Confirmation': { variant: 'secondary', label: 'Order Confirmation' },
    'Status Update': { variant: 'warning', label: 'Status Update' },
    'Ready for Pickup': { variant: 'primary', label: 'Ready for Pickup' },
    Promotion: { variant: 'error', label: 'Promotion' },
    System: { variant: 'neutral', label: 'System' },
  };

  const config = typeConfig[type] || typeConfig.System;

  return <Badge variant={config.variant} size={size}>{config.label}</Badge>;
}

// -----------------------------------------------------------------------------
// Pill (for tags/filters)
// -----------------------------------------------------------------------------

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  selected?: boolean;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Pill = forwardRef<HTMLSpanElement | HTMLButtonElement, PillProps>(
  ({ selected = false, onClick, removable, onRemove, variant = 'outline', className, children, ...props }, ref) => {
    const variantStyles = {
      primary: selected
        ? 'bg-primary text-white'
        : 'bg-primary-light text-primary hover:bg-primary/80',
      secondary: selected
        ? 'bg-sage-500 text-white'
        : 'bg-sage-100 text-sage-700 hover:bg-sage-200',
      outline: selected
        ? 'bg-primary text-white border-primary'
        : 'bg-transparent border-2 border-border-strong text-text-secondary hover:bg-warm-50',
    };

    const handleClick = () => {
      onClick?.();
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    };

    if (onClick) {
      return (
        <button
          ref={ref as React.ForwardedRef<HTMLButtonElement>}
          type="button"
          className={clsx(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-body-sm font-medium transition-all duration-fast',
            variantStyles[variant],
            removable && 'pr-2',
            'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2',
            className
          )}
          onClick={handleClick}
          {...props}
        >
          {children}
          {removable && (
            <button
              type="button"
              onClick={handleRemove}
              className={clsx(
                'flex items-center justify-center w-5 h-5 rounded-full transition-colors',
                selected ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-text-muted hover:text-text-primary hover:bg-border'
              )}
              aria-label="Remove"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </button>
      );
    }

    return (
      <span
        ref={ref as React.ForwardedRef<HTMLSpanElement>}
        className={clsx(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-body-sm font-medium transition-all duration-fast',
          variantStyles[variant],
          removable && 'pr-2',
          className
        )}
        {...props}
      >
        {children}
        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            className={clsx(
              'flex items-center justify-center w-5 h-5 rounded-full transition-colors',
              selected ? 'text-white/70 hover:text-white hover:bg-white/20' : 'text-text-muted hover:text-text-primary hover:bg-border'
            )}
            aria-label="Remove"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Pill.displayName = 'Pill';

// -----------------------------------------------------------------------------
// Counter Badge (for cart counts, notifications)
// -----------------------------------------------------------------------------

interface CounterBadgeProps {
  count: number;
  max?: number;
  variant?: 'primary' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export function CounterBadge({ count, max = 99, variant = 'primary', size = 'md', className }: CounterBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  const variantStyles = {
    primary: 'bg-primary text-white',
    error: 'bg-rose-500 text-white',
    neutral: 'bg-charcoal-500 text-white',
  };

  const sizeStyles = {
    sm: 'text-[10px] min-w-[16px] h-4',
    md: 'text-caption min-w-[18px] h-5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center px-1.5 rounded-full font-semibold',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      aria-label={`${count} items`}
    >
      {displayCount}
    </span>
  );
}