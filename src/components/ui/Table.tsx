// ============================================================================
// SweetCrumb Bakery - Table Components
// ============================================================================

import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { StatusBadge } from './Badge';
import type { OrderStatusName, AvailabilityStatus } from '@/types';

// -----------------------------------------------------------------------------
// Column Definition
// -----------------------------------------------------------------------------

export interface ColumnDef<T> {
  key: string;
  header: string | React.ReactNode;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  render?: (value: React.ReactNode, row: T) => React.ReactNode;
}

// Alias for backward compatibility
export type Column<T> = ColumnDef<T>;

export interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  sortable?: boolean;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
  };
  selection?: {
    selectedKeys: Set<string>;
    onSelectionChange: (keys: Set<string>) => void;
  };
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  className?: string;
  caption?: string;
}

// -----------------------------------------------------------------------------
// Table Component
// -----------------------------------------------------------------------------

export function Table<T>({
  columns,
  data,
  keyExtractor,
  striped = true,
  hoverable = true,
  bordered = true,
  compact = false,
  sortable = false,
  defaultSortKey,
  defaultSortDirection = 'asc',
  onSort,
  pagination,
  selection,
  loading = false,
  emptyMessage = 'No data available',
  emptyAction,
  className,
  caption,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(
    defaultSortKey ? { key: defaultSortKey, direction: defaultSortDirection } : null
  );

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = columns.find(c => c.key === sortConfig.key)?.accessor(a);
      const bVal = columns.find(c => c.key === sortConfig.key)?.accessor(b);
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, columns]);

  const handleSort = (key: string) => {
    if (!sortable) return;
    const column = columns.find(c => c.key === key);
    if (!column?.sortable) return;

    const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selection) return;
    if (checked) {
      const newKeys = new Set(selection.selectedKeys);
      sortedData.forEach(row => newKeys.add(keyExtractor(row)));
      selection.onSelectionChange(newKeys);
    } else {
      const newKeys = new Set(selection.selectedKeys);
      sortedData.forEach(row => newKeys.delete(keyExtractor(row)));
      selection.onSelectionChange(newKeys);
    }
  };

  const handleRowSelect = (key: string, checked: boolean) => {
    if (!selection) return;
    const newKeys = new Set(selection.selectedKeys);
    if (checked) {
      newKeys.add(key);
    } else {
      newKeys.delete(key);
    }
    selection.onSelectionChange(newKeys);
  };

  if (loading) {
    return (
      <div className="table-container" role="status" aria-live="polite">
        <table className="table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} scope="col" style={getColumnStyle(col)}>
                  <div className="flex items-center gap-2">
                    <span>{col.header}</span>
                    <div className="h-4 w-4 animate-pulse-soft bg-charcoal-200 rounded" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col.key} style={getColumnStyle(col)}>
                    <div className="h-4 w-3/4 animate-pulse-soft bg-charcoal-200 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={clsx('table-container', bordered && 'border border-border', className)}>
      <table className="table" role={selection ? 'grid' : 'table'}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {selection && (
              <th scope="col" className="w-12" style={{ width: '3rem', minWidth: '3rem', maxWidth: '3rem' }}>
                <Checkbox
                  checked={sortedData.length > 0 && sortedData.every(row => selection.selectedKeys.has(keyExtractor(row)))}
                  indeterminate={sortedData.some(row => selection.selectedKeys.has(keyExtractor(row))) &&
                    !sortedData.every(row => selection.selectedKeys.has(keyExtractor(row)))}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map(column => (
              <th
                key={column.key}
                scope="col"
                style={getColumnStyle(column)}
                className={clsx(
                  column.sortable && sortable && 'cursor-pointer select-none hover:bg-warm-100',
                  column.headerClassName
                )}
                onClick={() => column.sortable && sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-1.5">
                  <span>{column.header}</span>
                  {column.sortable && sortable && (
                    <span className="flex flex-col items-center gap-0">
                      {sortConfig?.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                        )
                      ) : (
                        <>
                          <ChevronUp className="w-3.5 h-3.5 text-charcoal-300" aria-hidden="true" />
                          <ChevronDown className="w-3.5 h-3.5 text-charcoal-300" aria-hidden="true" />
                        </>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selection ? 1 : 0)} className="py-12 text-center">
                <div className="flex flex-col items-center gap-3 text-text-muted">
                  <svg className="w-12 h-12 text-charcoal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-body">{emptyMessage}</p>
                  {emptyAction && <div className="mt-3">{emptyAction}</div>}
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => {
              const rowKey = keyExtractor(row);
              const isSelected = selection?.selectedKeys.has(rowKey);

              return (
                <tr
                  key={rowKey}
                  className={clsx(
                    striped && rowIndex % 2 === 1 && 'bg-warm-50/50',
                    hoverable && 'hover:bg-warm-50/50',
                    isSelected && 'bg-primary-light/50',
                    compact && 'compact-row'
                  )}
                  style={isSelected ? { boxShadow: 'inset 3px 0 0 0 var(--color-primary)' } : undefined}
                >
                  {selection && (
                    <td className="px-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={checked => handleRowSelect(rowKey, checked as boolean)}
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {columns.map(column => (
                    <td
                      key={column.key}
                      style={getColumnStyle(column)}
                      className={clsx(
                        'align-top',
                        column.align && `text-${column.align}`,
                        column.cellClassName
                      )}
                    >
                      {column.render
                        ? column.render(column.accessor(row), row)
                        : column.accessor(row)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {pagination && (
        <TablePagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={pagination.pageSizeOptions}
        />
      )}
    </div>
  );
}

function getColumnStyle(column: ColumnDef<any>) {
  return {
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
    textAlign: column.align,
  };
}

// -----------------------------------------------------------------------------
// Table Pagination
// -----------------------------------------------------------------------------

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-warm-50/50">
      <div className="flex items-center gap-3">
        <span className="text-body-sm text-text-secondary">
          Showing {start} to {end} of {total} results
        </span>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          className="input w-auto px-3 py-1.5 text-body-sm"
          aria-label="Results per page"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-body-sm text-text-secondary w-24 text-center">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Checkbox (re-export from Input for Table)
// -----------------------------------------------------------------------------

import { Checkbox } from './Input';

// -----------------------------------------------------------------------------
// Data Table Helpers - Pre-configured columns for common entities
// -----------------------------------------------------------------------------

import { formatCurrency, formatDate } from '@/types';

export function createProductColumns<T extends { productId: string; productName: string; categoryName: string; price: number; availabilityStatus: AvailabilityStatus; imageReference?: string }>(
  onEdit?: (product: T) => void,
  onDelete?: (product: T) => void,
  onView?: (product: T) => void
): ColumnDef<T>[] {
  return [
    {
      key: 'image',
      header: '',
      accessor: (row) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-warm-50 flex-shrink-0">
          <img src={row.imageReference || '/placeholder-cake.svg'} alt={row.productName} className="w-full h-full object-cover" />
        </div>
      ),
      width: '60px',
      sortable: false,
    },
    {
      key: 'productName',
      header: 'Product',
      accessor: (row) => (
        <div>
          <p className="font-medium text-text-primary">{row.productName}</p>
          <p className="text-body-sm text-text-muted">{row.categoryName}</p>
        </div>
      ),
      sortable: true,
      minWidth: '200px',
    },
    {
      key: 'price',
      header: 'Price',
      accessor: (row) => <span className="font-medium text-primary">{formatCurrency(row.price)}</span>,
      sortable: true,
      align: 'right',
      width: '120px',
    },
    {
      key: 'availability',
      header: 'Status',
      accessor: (row) => <AvailabilityBadge status={row.availabilityStatus} size="sm" />,
      sortable: true,
      width: '130px',
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-1">
          {onView && <Button variant="ghost" size="icon" onClick={() => onView(row)} aria-label="View">👁</Button>}
          {onEdit && <Button variant="ghost" size="icon" onClick={() => onEdit(row)} aria-label="Edit">✏️</Button>}
          {onDelete && <Button variant="ghost" size="icon" onClick={() => onDelete(row)} aria-label="Delete" className="text-rose-600 hover:bg-rose-50">🗑</Button>}
        </div>
      ),
      sortable: false,
      width: '120px',
      align: 'center',
    },
  ];
}

export function createOrderColumns<T extends { orderId: string; orderDate: string; totalAmount: number; statusName: OrderStatusName; customerName?: string; pickupDate?: string; itemCount: number }>(
  onView?: (order: T) => void,
  onUpdateStatus?: (order: T) => void
): ColumnDef<T>[] {
  return [
    {
      key: 'orderId',
      header: 'Order ID',
      accessor: (row) => <code className="text-body-sm font-mono text-charcoal-600">{row.orderId.slice(0, 8)}...</code>,
      sortable: true,
      width: '130px',
    },
    {
      key: 'customer',
      header: 'Customer',
      accessor: (row) => row.customerName ? (
        <p className="font-medium text-text-primary">{row.customerName}</p>
      ) : (
        <span className="text-text-muted">Guest</span>
      ),
      sortable: true,
      minWidth: '150px',
    },
    {
      key: 'date',
      header: 'Date',
      accessor: (row) => <span className="text-body-sm">{formatDate(row.orderDate)}</span>,
      sortable: true,
      width: '150px',
    },
    {
      key: 'items',
      header: 'Items',
      accessor: (row) => <span className="text-body-sm text-text-secondary">{row.itemCount} item{row.itemCount !== 1 ? 's' : ''}</span>,
      sortable: true,
      width: '80px',
      align: 'center',
    },
    {
      key: 'total',
      header: 'Total',
      accessor: (row) => <span className="font-semibold text-primary">{formatCurrency(row.totalAmount)}</span>,
      sortable: true,
      width: '120px',
      align: 'right',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.statusName} size="sm" />,
      sortable: true,
      width: '160px',
    },
    {
      key: 'pickup',
      header: 'Pickup',
      accessor: (row) => row.pickupDate ? (
        <span className="text-body-sm text-text-secondary">{formatDate(row.pickupDate)}</span>
      ) : (
        <span className="text-text-muted text-body-sm">Not scheduled</span>
      ),
      sortable: true,
      width: '140px',
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-1">
          {onView && <Button variant="ghost" size="icon" onClick={() => onView(row)} aria-label="View">👁</Button>}
          {onUpdateStatus && <Button variant="ghost" size="icon" onClick={() => onUpdateStatus(row)} aria-label="Update Status">🔄</Button>}
        </div>
      ),
      sortable: false,
      width: '100px',
      align: 'center',
    },
  ];
}

export function createCustomerColumns<T extends { customerId: string; firstName: string; lastName: string; email: string; contactNumber: string; registrationDate: string; accountStatus: 'Active' | 'Inactive' | 'Suspended' }>(
  onView?: (customer: T) => void,
  onEdit?: (customer: T) => void
): ColumnDef<T>[] {
  return [
    {
      key: 'name',
      header: 'Name',
      accessor: (row) => (
        <div>
          <p className="font-medium text-text-primary">{row.firstName} {row.lastName}</p>
          <p className="text-body-sm text-text-muted">{row.email}</p>
        </div>
      ),
      sortable: true,
      minWidth: '200px',
    },
    {
      key: 'contact',
      header: 'Contact',
      accessor: (row) => <span className="text-body-sm text-text-secondary">{row.contactNumber}</span>,
      sortable: false,
      width: '150px',
    },
    {
      key: 'registered',
      header: 'Registered',
      accessor: (row) => <span className="text-body-sm">{formatDate(row.registrationDate)}</span>,
      sortable: true,
      width: '150px',
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => <AccountStatusBadge status={row.accountStatus} size="sm" />,
      sortable: true,
      width: '120px',
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-1">
          {onView && <Button variant="ghost" size="icon" onClick={() => onView(row)} aria-label="View">👁</Button>}
          {onEdit && <Button variant="ghost" size="icon" onClick={() => onEdit(row)} aria-label="Edit">✏️</Button>}
        </div>
      ),
      sortable: false,
      width: '100px',
      align: 'center',
    },
  ];
}

// Re-export badges
import { AvailabilityBadge, AccountStatusBadge } from './Badge';