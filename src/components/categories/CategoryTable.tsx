// ============================================================================
// SweetCrumb Bakery - Category Table Columns
// ============================================================================

import React from 'react';
import { Edit, Trash2, GripVertical, MoreHorizontal, Eye } from 'lucide-react';
import { Table, type Column } from '@/components/ui';
import { DropdownMenu } from '@/components/ui';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { CategoryRecord } from '@/data/mockData.types';

export interface CategoryTableActions {
  onView?: (category: CategoryRecord) => void;
  onEdit?: (category: CategoryRecord) => void;
  onDelete?: (category: CategoryRecord) => void;
  onReorder?: (categories: CategoryRecord[]) => void;
}

export function createCategoryColumns(actions: CategoryTableActions, reorderMode = false): Column<CategoryRecord>[] {
  const columns: Column<CategoryRecord>[] = [
    {
      key: 'sortOrder',
      header: reorderMode ? <GripVertical className="w-5 h-5 text-charcoal-400 cursor-grab" /> : '#',
      width: reorderMode ? '50px' : '60px',
      align: 'center',
      accessor: (category) => (
        <span className={cn('font-mono text-body-sm', reorderMode ? 'text-charcoal-400' : 'text-charcoal-900')}>
          {category.sortOrder}
        </span>
      ),
    },
    {
      key: 'categoryName',
      header: 'Category Name',
      accessor: (category) => (
        <div>
          <p className="font-medium text-charcoal-900">{category.categoryName}</p>
          <p className="text-body-sm text-text-muted truncate max-w-xs">{category.description}</p>
        </div>
      ),
    },
    {
      key: 'productCount',
      header: 'Products',
      width: '100px',
      align: 'center',
      accessor: (category) => (
        <Badge variant="secondary" size="sm">
          {category.productCount} products
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      width: '140px',
      accessor: (category) => (
        <span className="text-body-sm text-text-muted">
          {new Date(category.createdAt).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  if (!reorderMode) {
    columns.push({
      key: 'actions',
      header: 'Actions',
      width: '100px',
      align: 'center',
      accessor: (category) => (
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
              onClick: () => actions.onView?.(category),
            },
            {
              label: 'Edit',
              value: 'edit',
              icon: <Edit className="w-4 h-4" />,
              onClick: () => actions.onEdit?.(category),
            },
            { divider: true },
            {
              label: 'Delete',
              value: 'delete',
              icon: <Trash2 className="w-4 h-4" />,
              className: 'text-red-600',
              onClick: () => actions.onDelete?.(category),
            },
          ]}
        />
      ),
    });
  }

  return columns;
}

// Reorder-specific columns (drag handle + name only)
export function createCategoryReorderColumns(onReorder: (categories: CategoryRecord[]) => void): Column<CategoryRecord>[] {
  return [
    {
      key: 'dragHandle',
      header: '',
      width: '50px',
      align: 'center',
      accessor: () => (
        <GripVertical className="w-5 h-5 text-charcoal-400 cursor-grab hover:text-charcoal-600" />
      ),
    },
    {
      key: 'categoryName',
      header: 'Category Name',
      accessor: (category) => (
        <p className="font-medium text-charcoal-900">{category.categoryName}</p>
      ),
    },
    {
      key: 'productCount',
      header: 'Products',
      width: '100px',
      align: 'center',
      accessor: (category) => (
        <Badge variant="secondary" size="sm">
          {category.productCount}
        </Badge>
      ),
    },
  ];
}