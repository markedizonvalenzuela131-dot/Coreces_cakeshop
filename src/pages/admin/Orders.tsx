// ============================================================================
// SweetCrumb Bakery - Admin Orders Page (Refactored)
// ============================================================================

import React, { useState } from 'react';
import { Search, Calendar, Truck, AlertTriangle, Download, MoreHorizontal, ShoppingCart, Minus, Plus, Package } from 'lucide-react';
import {
  Button,
  Input,
  Select,
  Card,
  Modal,
  Table,
  createOrderColumns,
  StatusBadge,
  Badge,
  DropdownMenu,
} from '@/components/ui';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { OrderStatusName } from '@/types';
import type { OrderFilters } from '@/hooks/useOrders';
import { useAdminOrders } from '@/hooks';
import { OrderDetailModal, StatusUpdateModal } from '@/components/orders';
import { EmptyState } from '@/components/common';
import { StatCard } from '@/components/common';

const statusOptions: Array<{ value: OrderStatusName | ''; label: string }> = [
  { value: '', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Preparing', label: 'Preparing' },
  { value: 'Ready for Pickup', label: 'Ready for Pickup' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const sortOptions: Array<{ value: NonNullable<OrderFilters['sortBy']>; label: string }> = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'amount-desc', label: 'Highest Amount' },
  { value: 'amount-asc', label: 'Lowest Amount' },
];

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

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
    updateOrderStatus,
  } = useAdminOrders();

  // Stats calculations
  const allOrders = useAdminOrders().filteredOrders; // Get all filtered orders for stats
  const pendingCount = allOrders.filter((o) => o.statusName === 'Pending').length;
  const preparingCount = allOrders.filter((o) => o.statusName === 'Preparing').length;
  const readyCount = allOrders.filter((o) => o.statusName === 'Ready for Pickup').length;

  const columns = createOrderColumns(
    (order) => {
      setSelectedOrder(order);
      setShowDetailModal(true);
    },
    (order) => {
      setSelectedOrder(order);
      setShowStatusModal(true);
    }
  );

  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    const sortMap: Record<string, OrderFilters['sortBy']> = {
      'orderDate_desc': 'date-desc',
      'orderDate_asc': 'date-asc',
      'totalAmount_desc': 'amount-desc',
      'totalAmount_asc': 'amount-asc',
    };
    setFilters({ sortBy: sortMap[`${key}_${direction}`] });
  };

  const handleStatusUpdate = async (newStatus: OrderStatusName) => {
    if (!selectedOrder) return;
    try {
      await updateOrderStatus(selectedOrder.orderId, newStatus);
      setShowStatusModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display font-medium text-charcoal-900">Orders</h1>
          <p className="text-body text-text-muted mt-1">Manage and process customer orders</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Orders" value={totalCount} icon={<ShoppingCart className="w-5 h-5" />} changeType="neutral" />
        <StatCard title="Pending" value={pendingCount} icon={<AlertTriangle className="w-5 h-5" />} changeType="neutral" />
        <StatCard title="Preparing" value={preparingCount} icon={<Package className="w-5 h-5" />} changeType="neutral" />
        <StatCard title="Ready" value={readyCount} icon={<Truck className="w-5 h-5" />} changeType="neutral" />
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="label">Search Orders</label>
            <Input
              type="search"
              placeholder="Search by order ID, customer, email..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap gap-3 items-end">
            <Select
              value={filters.status}
              onValueChange={(value) => {
                const selected = statusOptions.find((option) => option.value === value);
                if (selected) setFilters({ status: selected.value });
              }}
              options={statusOptions}
              className="w-full sm:w-40"
            />

            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ dateFrom: e.target.value })}
              placeholder="From"
              className="w-full sm:w-36"
              leftIcon={<Calendar className="w-4 h-4" />}
            />

            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ dateTo: e.target.value })}
              placeholder="To"
              className="w-full sm:w-36"
              leftIcon={<Calendar className="w-4 h-4" />}
            />

            <Select
              value={filters.sortBy}
              onValueChange={(value) => {
                const selected = sortOptions.find((option) => option.value === value);
                if (selected) setFilters({ sortBy: selected.value });
              }}
              options={sortOptions}
              className="w-full sm:w-40"
            />

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
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
            title="No orders found"
            description="Try adjusting your filters or search terms"
            action={hasActiveFilters ? {
              label: 'Clear Filters',
              onClick: clearFilters,
              variant: 'outline',
            } : undefined}
          />
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedOrders}
              keyExtractor={(order) => order.orderId}
              striped
              hoverable
              sortable
              onSort={handleSortChange}
              defaultSortKey="orderDate"
              defaultSortDirection="desc"
              pagination={{
                page: currentPage,
                pageSize,
                total: totalCount,
                onPageChange: setPage,
                onPageSizeChange: setPageSize,
              }}
            />
          </>
        )}
      </Card>

      {/* Order Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedOrder(null); }}
        title="Order Details"
        size="xl"
      >
        {selectedOrder && <OrderDetailModal isOpen={showDetailModal} order={selectedOrder} onClose={() => { setShowDetailModal(false); setSelectedOrder(null); }} />}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => { setShowStatusModal(false); setSelectedOrder(null); }}
        title="Update Order Status"
        size="md"
      >
        {selectedOrder && (
          <StatusUpdateModal
            isOpen={showStatusModal}
            onClose={() => { setShowStatusModal(false); setSelectedOrder(null); }}
            orderId={selectedOrder.orderId}
            currentStatus={selectedOrder.statusName}
            onUpdate={handleStatusUpdate}
          />
        )}
      </Modal>
    </div>
  );
}