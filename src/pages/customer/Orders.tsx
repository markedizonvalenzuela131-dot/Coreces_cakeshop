// ============================================================================
// SweetCrumb Bakery - My Orders Page (Refactored)
// ============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Filter, X, Calendar, Search, Loader2, Package, Truck, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Button, Badge, Input, Select, DropdownMenu, type DropdownItem, Alert } from '@/components/ui';
import { Card, Table, createOrderColumns } from '@/components/ui';
import { Breadcrumb } from '@/components/ui';
import { Modal } from '@/components/ui';
import { formatCurrency, formatDate, cn, getOrderStatusColor } from '@/lib/utils';
import type { OrderFilters } from '@/hooks/useOrders';
import { containerPage } from '@/styles';
import { useAuth } from '@/context';
import type { OrderStatusName } from '@/types';
import { useOrders } from '@/hooks';
import { OrderDetailModal } from '@/components/orders';
import { EmptyState } from '@/components/common';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Preparing', label: 'Preparing' },
  { value: 'Ready for Pickup', label: 'Ready for Pickup' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const sortOptions = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'amount-desc', label: 'Highest Amount' },
  { value: 'amount-asc', label: 'Lowest Amount' },
];

export function Orders() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    paginatedOrders,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    filters,
    setFilters,
    setPage,
    setPageSize,
    clearFilters,
    hasActiveFilters,
  } = useOrders(user?.id);

  const columns = createOrderColumns(
    (order) => {
      setSelectedOrder(order);
      setShowModal(true);
    },
    (order) => {
      setSelectedOrder(order);
      setShowModal(true);
    }
  );

  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    const sortMap: Record<string, string> = {
      'orderDate_desc': 'date-desc',
      'orderDate_asc': 'date-asc',
      'totalAmount_desc': 'amount-desc',
      'totalAmount_asc': 'amount-asc',
    };
    setFilters({ sortBy: sortMap[`${key}_${direction}`] as any });
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container-page py-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'My Orders', current: true },
            ]}
          />
        </div>
      </div>

      <div className="container-page py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-display-md font-display font-medium text-charcoal-900">My Orders</h1>
            <p className="text-body text-text-muted mt-1">Track and manage your cake orders</p>
          </div>
          <Link to="/catalog">
            <Button leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
              Order Again
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="label">Search Orders</label>
              <Input
                type="search"
                placeholder="Search by order ID, cake name..."
                value={filters.search}
                onChange={e => setFilters({ search: e.target.value })}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="flex flex-wrap gap-3 items-end">
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ status: value as OrderStatusName | '' })}
                options={statusOptions}
                className="w-full sm:w-48"
              />

              <Input
                type="date"
                value={filters.dateFrom}
                onChange={e => setFilters({ dateFrom: e.target.value })}
                placeholder="From"
                className="w-full sm:w-40"
                leftIcon={<Calendar className="w-4 h-4" />}
              />

              <Input
                type="date"
                value={filters.dateTo}
                onChange={e => setFilters({ dateTo: e.target.value })}
                placeholder="To"
                className="w-full sm:w-40"
                leftIcon={<Calendar className="w-4 h-4" />}
              />

              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters({ sortBy: value as OrderFilters['sortBy'] })}
                options={sortOptions}
                className="w-full sm:w-48"
              />

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        <Card>
          {paginatedOrders.length === 0 ? (
            <EmptyState
              illustration="orders"
              title={filters.search || hasActiveFilters ? 'No orders found' : 'No orders yet'}
              description={filters.search || hasActiveFilters
                ? 'Try adjusting your filters or search terms'
                : 'Start ordering delicious cakes!'}
              action={filters.search || hasActiveFilters ? {
                label: 'Clear Filters',
                onClick: clearFilters,
                variant: 'outline',
              } : {
                label: 'Browse Cakes',
                onClick: () => window.location.href = '/catalog',
                variant: 'primary',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
              }}
            />
          ) : (
            <>
              <Table
                columns={columns}
                data={paginatedOrders}
                keyExtractor={order => order.orderId}
                striped
                hoverable
                sortable
                onSort={handleSortChange}
                defaultSortKey="orderDate"
                defaultSortDirection="desc"
                emptyMessage="No orders found"
                pagination={{
                  page: currentPage,
                  pageSize,
                  total: totalCount,
                  onPageChange: setPage,
                  onPageSizeChange: setPageSize,
                  pageSizeOptions: [10, 25, 50],
                }}
              />
            </>
          )}
        </Card>

        {/* Order Detail Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setSelectedOrder(null); }}
          title="Order Details"
          size="lg"
        >
          {selectedOrder && <OrderDetailModal order={selectedOrder} isOpen={showModal} onClose={() => { setShowModal(false); setSelectedOrder(null); }} />}
        </Modal>
      </div>
    </div>
  );
}