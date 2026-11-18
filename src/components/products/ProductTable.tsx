// ============================================================================
// SweetCrumb Bakery - Product Table Columns
// ============================================================================

import React from 'react';
import { Image, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { Table, type Column } from '@/components/ui';
import { DropdownMenu, type DropdownItem } from '@/components/ui';
import { Badge } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';
import type { ProductRecord } from '@/data/mockData.types';

export interface ProductTableActions {
  onView?: (product: ProductRecord) => void;
  onEdit?: (product: ProductRecord) => void;
  onDelete?: (product: ProductRecord) => void;
  onToggleAvailability?: (product: ProductRecord) => void;
  onToggleFeatured?: (product: ProductRecord) => void;
}

export function createProductColumns(actions: ProductTableActions): Column<ProductRecord>[] {
  return [
    {
      key: 'image',
      header: '',
      width: '60px',
      accessor: (product) => (
        <div className="w-12 h-12 rounded-lg bg-warm-50 overflow-hidden flex-shrink-0">
          <img
            src={product.imageReference}
            alt={product.productName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ),
    },
    {
      key: 'productName',
      header: 'Product',
      accessor: (product) => (
        <div>
          <p className="font-medium text-charcoal-900">{product.productName}</p>
          <p className="text-body-sm text-text-muted truncate max-w-xs">{product.description}</p>
        </div>
      ),
    },
    {
      key: 'categoryName',
      header: 'Category',
      width: '140px',
      accessor: (product) => (
        <span className="text-body text-charcoal-900">{product.categoryName}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      width: '100px',
      align: 'right',
      accessor: (product) => (
        <span className="font-semibold text-primary">{formatCurrency(product.price)}</span>
      ),
    },
    {
      key: 'availabilityStatus',
      header: 'Status',
      width: '120px',
      accessor: (product) => (
        <Badge
          variant={
            product.availabilityStatus === 'Available' ? 'success' :
            product.availabilityStatus === 'Limited' ? 'warning' : 'error'
          }
          size="sm"
        >
          {product.availabilityStatus}
        </Badge>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      width: '80px',
      align: 'center',
      accessor: (product) => (
        <Badge variant={product.featured ? 'primary' : 'secondary'} size="sm">
          {product.featured ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '100px',
      align: 'center',
      accessor: (product) => (
        <DropdownMenu
          trigger={
            <button
              type="button"
              className="p-2 rounded-lg text-charcoal-400 hover:text-charcoal-900 hover:bg-charcoal-100 transition-colors"
              aria-label="More actions"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          }
          onSelect={() => {}}
          items={[
            {
              label: 'View',
              value: 'view',
              icon: <Eye className="w-4 h-4" />,
              onClick: () => actions.onView?.(product),
            },
            {
              label: 'Edit',
              value: 'edit',
              icon: <Edit className="w-4 h-4" />,
              onClick: () => actions.onEdit?.(product),
            },
            {
              label: product.featured ? 'Remove from Featured' : 'Mark as Featured',
              value: 'toggleFeatured',
              icon: product.featured ? <Image className="w-4 h-4" /> : <Image className="w-4 h-4" />,
              onClick: () => actions.onToggleFeatured?.(product),
            },
            {
              label: product.availabilityStatus === 'Available' ? 'Mark Unavailable' : 'Mark Available',
              value: 'toggleAvailability',
              icon: <Image className="w-4 h-4" />,
              onClick: () => actions.onToggleAvailability?.(product),
            },
            { divider: true },
            {
              label: 'Delete',
              value: 'delete',
              icon: <Trash2 className="w-4 h-4" />,
              className: 'text-red-600',
              onClick: () => actions.onDelete?.(product),
            },
          ]}
        />
      ),
    },
  ];
}

// Simplified version for customer-facing product table
export function createCustomerProductColumns(onView: (product: ProductRecord) => void): Column<ProductRecord>[] {
  return [
    {
      key: 'image',
      header: '',
      width: '60px',
      accessor: (product) => (
        <div className="w-12 h-12 rounded-lg bg-warm-50 overflow-hidden flex-shrink-0">
          <img
            src={product.imageReference}
            alt={product.productName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ),
    },
    {
      key: 'productName',
      header: 'Product',
      accessor: (product) => (
        <div>
          <p className="font-medium text-charcoal-900 cursor-pointer hover:text-primary" onClick={() => onView(product)}>
            {product.productName}
          </p>
          <p className="text-body-sm text-text-muted truncate max-w-xs">{product.description}</p>
        </div>
      ),
    },
    {
      key: 'categoryName',
      header: 'Category',
      width: '140px',
      accessor: (product) => (
        <span className="text-body text-charcoal-900">{product.categoryName}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      width: '100px',
      align: 'right',
      accessor: (product) => (
        <span className="font-semibold text-primary">{formatCurrency(product.price)}</span>
      ),
    },
    {
      key: 'availabilityStatus',
      header: 'Status',
      width: '120px',
      accessor: (product) => (
        <Badge
          variant={
            product.availabilityStatus === 'Available' ? 'success' :
            product.availabilityStatus === 'Limited' ? 'warning' : 'error'
          }
          size="sm"
        >
          {product.availabilityStatus}
        </Badge>
      ),
    },
  ];
}