// ============================================================================
// SweetCrumb Bakery - useOrders Hook
// ============================================================================

import { useState, useMemo, useCallback } from 'react';
import type { OrderRecord } from '@/data/mockData.types';
import type { OrderStatusName } from '@/types';
import {
  MOCK_ORDERS,
  getOrdersByCustomerId,
  getOrderById,
} from '@/data/mockData';
import type { StoredOrder } from '@/utils/orderStore';
import { getStoredOrders } from '@/utils/orderStore';

export interface OrderFilters {
  search?: string;
  status?: OrderStatusName | '';
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}

interface OrderPaginationOptions {
  page: number;
  pageSize: number;
}

export interface UseOrdersResult {
  orders: OrderRecord[];
  filteredOrders: OrderRecord[];
  paginatedOrders: OrderRecord[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  filters: OrderFilters;
  setFilters: (filters: Partial<OrderFilters>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  getOrderById: (id: string) => OrderRecord | undefined;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const DEFAULT_FILTERS: OrderFilters = {
  search: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date-desc',
};

const DEFAULT_PAGE_SIZE = 10;

function toOrderRecord(order: StoredOrder): OrderRecord {
  return {
    orderId: order.orderId,
    customerId: order.customer.email,
    customerName: order.customerName,
    customerEmail: order.customer.email,
    customerPhone: order.customer.contactNumber,
    orderDate: order.orderDate,
    totalAmount: order.totalAmount,
    statusName: order.statusName,
    pickupDate: order.pickupDate,
    pickupTime: order.pickupTime,
    itemCount: order.itemCount,
    remarks: order.remarks,
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPriceAtOrder: item.unitPriceAtOrder,
      lineTotal: item.lineTotal,
      imageReference: item.imageReference,
    })),
  };
}

export function useOrders(customerId?: string): UseOrdersResult {
  const [filters, setFiltersState] = useState<OrderFilters>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState<OrderPaginationOptions>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // Get all orders (mock + stored)
  const allOrders = useMemo(() => {
    const storedOrders = getStoredOrders().map(toOrderRecord);
    const mockOrders = customerId
      ? getOrdersByCustomerId(customerId)
      : MOCK_ORDERS;
    return [...storedOrders, ...mockOrders];
  }, [customerId]);

  // Apply filters
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesSearch =
        !filters.search ||
        order.orderId.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(filters.search!.toLowerCase())
        );

      const matchesStatus = !filters.status || order.statusName === filters.status;

      const orderDate = order.orderDate.slice(0, 10);
      const matchesDateFrom = !filters.dateFrom || orderDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || orderDate <= filters.dateTo;

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [allOrders, filters]);

  // Apply sorting
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];
    switch (filters.sortBy) {
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
        break;
      case 'amount-desc':
        sorted.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case 'amount-asc':
        sorted.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      default:
        sorted.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }
    return sorted;
  }, [filteredOrders, filters.sortBy]);

  // Pagination
  const totalCount = sortedOrders.length;
  const totalPages = Math.ceil(totalCount / pagination.pageSize);
  const currentPage = Math.min(Math.max(pagination.page, 1), totalPages || 1);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pagination.pageSize;
    return sortedOrders.slice(start, start + pagination.pageSize);
  }, [sortedOrders, currentPage, pagination.pageSize]);

  const setFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page on filter change
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page: Math.max(1, Math.min(page, totalPages || 1)) }));
  }, [totalPages]);

  const setPageSize = useCallback((pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.dateFrom || filters.dateTo
  );

  return {
    orders: allOrders,
    filteredOrders: sortedOrders,
    paginatedOrders,
    totalCount,
    totalPages,
    currentPage,
    pageSize: pagination.pageSize,
    filters,
    setFilters,
    setPage,
    setPageSize,
    getOrderById,
    clearFilters,
    hasActiveFilters,
  };
}

// Admin-specific hook with additional features
export function useAdminOrders(): UseOrdersResult & {
  updateOrderStatus: (orderId: string, status: OrderStatusName) => void;
  deleteOrder: (orderId: string) => void;
} {
  const base = useOrders();
  const [orders, setOrders] = useState<OrderRecord[]>(MOCK_ORDERS);

  // Combine mock orders with any stored orders
  const allOrders = useMemo(() => {
    const storedOrders = getStoredOrders().map(toOrderRecord);
    return [...orders, ...storedOrders];
  }, [orders]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatusName) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, statusName: status } : order
      )
    );
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
  }, []);

  return {
    ...base,
    orders: allOrders,
    filteredOrders: base.filteredOrders,
    updateOrderStatus,
    deleteOrder,
  };
}