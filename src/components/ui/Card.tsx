// ============================================================================
// SweetCrumb Bakery - Card Components
// ============================================================================

import React, { forwardRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

// -----------------------------------------------------------------------------
// Card
// -----------------------------------------------------------------------------

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white rounded-xl border border-border shadow-card',
      hover: 'bg-white rounded-xl border border-border shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-normal',
      outlined: 'bg-white rounded-xl border-2 border-border-strong',
      elevated: 'bg-white rounded-xl border border-border shadow-elevated',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={clsx(variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// -----------------------------------------------------------------------------
// Card Header
// -----------------------------------------------------------------------------

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, action, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('flex items-start justify-between gap-4 mb-4', className)} {...props}>
        <div className="flex-1 min-w-0">
          {title && <h3 className="text-heading-md font-medium text-text-primary truncate">{title}</h3>}
          {description && <p className="text-body-sm text-text-muted mt-1">{description}</p>}
          {children}
        </div>
        {action && <div className="flex-shrink-0 mt-1">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// -----------------------------------------------------------------------------
// Card Body
// -----------------------------------------------------------------------------

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx('', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

// -----------------------------------------------------------------------------
// Card Footer
// -----------------------------------------------------------------------------

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  divided?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ divided = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'flex items-center gap-3 mt-4 pt-4',
          divided && 'border-t border-border',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

// -----------------------------------------------------------------------------
// Product Card (Specialized for cake products)
// -----------------------------------------------------------------------------

import type { CakeProductWithCategory, ProductCardData } from '@/types';
import { formatCurrency } from '@/types';
import { Button } from './Button';

interface ProductCardProps {
  product: ProductCardData | CakeProductWithCategory;
  variant?: 'grid' | 'list' | 'featured';
  onAddToCart?: (product: ProductCardData | CakeProductWithCategory) => void;
  onQuickView?: (product: ProductCardData | CakeProductWithCategory) => void;
  showActions?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  variant = 'grid',
  onAddToCart,
  onQuickView,
  showActions = true,
  className,
}: ProductCardProps) {
  const isAvailable = product.availabilityStatus === 'Available';
  const imageUrl = product.imageReference || '/placeholder-cake.svg';
  const categoryName = 'categoryName' in product ? product.categoryName : product.category?.categoryName ?? 'Uncategorized';

  if (variant === 'list') {
    return (
      <div className={clsx('card flex flex-row gap-6 p-4', className)}>
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-warm-50">
          <img
            src={imageUrl}
            alt={product.productName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="badge-error">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-heading-sm font-medium text-text-primary truncate">{product.productName}</h3>
                <p className="text-body-sm text-text-muted truncate">{categoryName}</p>
              </div>
              <span className={clsx('badge', isAvailable ? 'badge-success' : 'badge-error')}>
                {product.availabilityStatus}
              </span>
            </div>
            <p className="text-body-sm text-text-secondary mt-2 line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center justify-between gap-4 mt-4">
            <span className="text-heading-md font-medium text-primary">{formatCurrency(product.price)}</span>
            {showActions && isAvailable && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onQuickView?.(product)}>
                  Quick View
                </Button>
                <Button size="sm" onClick={() => onAddToCart?.(product)}>
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <article className={clsx('card-hover overflow-hidden', className)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-slow hover:scale-105"
            loading="lazy"
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="badge badge-error text-body">Out of Stock</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="badge badge-primary">{categoryName}</span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-heading-sm font-medium text-text-primary line-clamp-1">{product.productName}</h3>
          <p className="text-body-sm text-text-muted mt-1 line-clamp-2 flex-1">{product.description}</p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-heading-lg font-semibold text-primary">{formatCurrency(product.price)}</span>
            {showActions && isAvailable && (
              <Button size="sm" onClick={() => onAddToCart?.(product)} className="w-full sm:w-auto">
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Default grid variant
  return (
    <article className={clsx('card-hover flex flex-col', className)}>
      <div className="relative aspect-square overflow-hidden bg-warm-50">
        <img
          src={imageUrl}
          alt={product.productName}
          className="w-full h-full object-cover transition-transform duration-slow hover:scale-105"
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge badge-error">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="badge badge-primary">{categoryName}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-heading-sm font-medium text-text-primary line-clamp-1">{product.productName}</h3>
        <p className="text-body-sm text-text-muted mt-1 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-heading-md font-semibold text-primary">{formatCurrency(product.price)}</span>
          {showActions && isAvailable && (
            <Button size="sm" onClick={() => onAddToCart?.(product)} className="w-full sm:w-auto">
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

// -----------------------------------------------------------------------------
// Stat Card (for dashboard)
// -----------------------------------------------------------------------------

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  trend?: Array<{ x: string; y: number }>;
  className?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, trend, className }: StatCardProps) {
  return (
    <Card className={clsx('overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-body-sm text-text-muted">{title}</p>
          <p className="text-display-sm font-medium text-text-primary mt-1">{value}</p>
          {change && (
            <p className={clsx('text-caption font-medium mt-1 flex items-center gap-1',
              changeType === 'increase' && 'text-sage-600',
              changeType === 'decrease' && 'text-rose-600',
              changeType === 'neutral' && 'text-charcoal-500'
            )}>
              {changeType === 'increase' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
              {changeType === 'decrease' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
              {change}
            </p>
          )}
        </div>
        {icon && <div className="p-3 bg-warm-100 rounded-xl text-primary">{icon}</div>}
      </div>
      {trend && trend.length > 0 && (
        <div className="mt-4 h-16" aria-hidden="true">
          <SimpleSparkline data={trend} color={changeType === 'increase' ? '#3D6B3D' : changeType === 'decrease' ? '#C02447' : '#EC7A4E'} />
        </div>
      )}
    </Card>
  );
}

// Simple sparkline component
function SimpleSparkline({ data, color }: { data: Array<{ x: string; y: number }>; color: string }) {
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const maxY = Math.max(...data.map(d => d.y));
    const minY = Math.min(...data.map(d => d.y));
    const range = maxY - minY || 1;
    const y = 100 - ((point.y - minY) / range) * 80 + 10; // 10% padding top/bottom
    return `${x}%,${y}%`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M${points} L${points.split(' ').pop()} 100% L0% 100% Z`}
        fill="url(#sparkline-gradient)"
        stroke={color}
        strokeWidth="2"
        fillOpacity="0.6"
      />
      <path
        d={`M${points}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}