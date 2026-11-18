// ============================================================================
// SweetCrumb Bakery - EmptyState Component
// ============================================================================

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline' | 'ghost';
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  illustration?: 'orders' | 'products' | 'cart' | 'search' | 'custom';
}

const ILLUSTRATIONS: Record<NonNullable<EmptyStateProps['illustration']>, React.ReactNode> = {
  orders: (
    <svg className="w-16 h-16 mx-auto text-charcoal-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  products: (
    <svg className="w-16 h-16 mx-auto text-charcoal-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  cart: (
    <svg className="w-16 h-16 mx-auto text-charcoal-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 01-2 2h12a2 2 0 002-2v-4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h10M7 11h10M13 15h4M7 15H3" />
    </svg>
  ),
  search: (
    <svg className="w-16 h-16 mx-auto text-charcoal-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  custom: null,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  illustration = 'orders',
}: EmptyStateProps) {
  return (
    <div className={cn('p-12 text-center', className)}>
      {icon ? (
        <div className="w-16 h-16 mx-auto text-charcoal-200 mb-4 flex items-center justify-center">
          {icon}
        </div>
      ) : illustration && illustration !== 'custom' ? (
        ILLUSTRATIONS[illustration]
      ) : null}

      <h2 className="text-heading-lg font-medium text-charcoal-900 mb-2">{title}</h2>
      {description && (
        <p className="text-body text-text-muted mb-6 max-w-md mx-auto">{description}</p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <Button
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}