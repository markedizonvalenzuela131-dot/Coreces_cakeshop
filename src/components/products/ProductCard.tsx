// ============================================================================
// SweetCrumb Bakery - ProductCard Component
// ============================================================================

import React from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';
import type { ProductRecord } from '@/data/mockData.types';

interface ProductCardProps {
  product: ProductRecord;
  variant?: 'grid' | 'list' | 'featured';
  onAddToCart?: (product: ProductRecord) => void;
  onViewDetails?: (product: ProductRecord) => void;
  onToggleFavorite?: (product: ProductRecord) => void;
  isFavorite?: boolean;
  showActions?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  variant = 'grid',
  onAddToCart,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
  showActions = true,
  className,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(product);
  };

  if (variant === 'list') {
    return (
      <div className={cn('flex items-center gap-4 p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow', className)}>
        <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-warm-50 overflow-hidden">
          <img
            src={product.imageReference}
            alt={product.productName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-charcoal-900 truncate">{product.productName}</h3>
              <p className="text-body-sm text-text-muted truncate mt-1">{product.description}</p>
            </div>
            {product.featured && (
              <Badge variant="secondary" size="sm">Featured</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={product.availabilityStatus === 'Available' ? 'success' :
                     product.availabilityStatus === 'Limited' ? 'warning' : 'error'}
              size="sm"
            >
              {product.availabilityStatus}
            </Badge>
            <span className="text-caption text-text-muted">{product.categoryName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-heading-sm font-semibold text-primary whitespace-nowrap">
            {formatCurrency(product.price)}
          </p>
          {showActions && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={cn('w-5 h-5', isFavorite ? 'fill-primary text-primary' : 'text-charcoal-400')}
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
              >
                View
              </Button>
              {product.availabilityStatus === 'Available' && onAddToCart && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <article className={cn('group bg-white rounded-2xl border border-border overflow-hidden transition-all hover:shadow-lg', className)}>
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageReference}
          alt={product.productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          {product.featured && (
            <Badge variant="secondary" className="shadow-md">Featured</Badge>
          )}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all',
              isFavorite
                ? 'bg-primary text-white'
                : 'bg-white/90 text-charcoal-600 hover:bg-white hover:text-primary'
            )}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn('w-5 h-5', isFavorite ? 'fill-current' : '')}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Badge
            variant={product.availabilityStatus === 'Available' ? 'success' :
                   product.availabilityStatus === 'Limited' ? 'warning' : 'error'}
          >
            {product.availabilityStatus}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-charcoal-900 line-clamp-1">{product.productName}</h3>
          <p className="text-body-sm text-text-muted line-clamp-2 mt-1">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-heading-sm font-semibold text-primary">{formatCurrency(product.price)}</p>
          <span className="text-caption text-text-muted">{product.categoryName}</span>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleViewDetails}
              leftIcon={<Eye className="w-4 h-4" />}
            >
              View Details
            </Button>
            {product.availabilityStatus === 'Available' && onAddToCart && (
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                leftIcon={<ShoppingCart className="w-4 h-4" />}
              >
                Add to Cart
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}