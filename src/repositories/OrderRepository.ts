// ============================================================================
// SweetCrumb Bakery - Order Repository Implementation
// ============================================================================

import { BaseRepository, DatabaseAdapter, InMemoryAdapter } from '@/database/adapters';
import type { FindOptions } from '@/database/adapters';
import type {
  OrderWithDetails,
  OrderFormData,
  OrderSummary,
  SalesAnalytics,
  PaginationParams,
  FilterParams,
  PaginatedResponse,
} from '@/types';

type OrderQueryOptions = PaginationParams & FilterParams & FindOptions;

export interface OrderRepository extends BaseRepository<OrderWithDetails, OrderFormData, Partial<OrderFormData>> {
  findByCustomerId(customerId: string, options?: OrderQueryOptions): Promise<PaginatedResponse<OrderSummary>>;
  findByStatus(statusId: string, options?: PaginationParams & FindOptions): Promise<PaginatedResponse<OrderWithDetails>>;
  findByDateRange(startDate: string, endDate: string, options?: PaginationParams & FindOptions): Promise<PaginatedResponse<OrderWithDetails>>;
  updateStatus(orderId: string, statusId: string): Promise<OrderWithDetails>;
  getOrderWithItems(orderId: string): Promise<OrderWithDetails | null>;
  getAnalytics(dateFrom?: string, dateTo?: string): Promise<SalesAnalytics>;
  getRecentOrders(limit?: number): Promise<OrderWithDetails[]>;
}

export class OrderRepositoryImpl extends BaseRepository<OrderWithDetails, OrderFormData, Partial<OrderFormData>>
  implements OrderRepository {

  constructor(adapter: DatabaseAdapter) {
    super(adapter, 'orders', 'orderId');
  }

  async findByCustomerId(customerId: string, options?: OrderQueryOptions): Promise<PaginatedResponse<OrderSummary>> {
    const where = { customerId, ...options?.where };
    const [items, total] = await Promise.all([
      this.adapter.findMany<OrderSummary>('orders', {
        where,
        orderBy: options?.orderBy ?? [{ field: 'orderDate', direction: 'desc' }],
        limit: options?.limit ?? 10,
        offset: options?.offset ?? 0,
      }),
      this.adapter.count('orders', where),
    ]);

    return {
      items,
      total,
      page: Math.floor((options?.offset ?? 0) / (options?.limit ?? 10)) + 1,
      pageSize: options?.limit ?? 10,
      totalPages: Math.ceil(total / (options?.limit ?? 10)),
    };
  }

  async findByStatus(statusId: string, options?: PaginationParams & FindOptions): Promise<PaginatedResponse<OrderWithDetails>> {
    const [items, total] = await Promise.all([
      this.findAll({
        where: { statusName: statusId },
        orderBy: options?.orderBy ?? [{ field: 'orderDate', direction: 'desc' }],
        limit: options?.limit,
        offset: options?.offset,
      }),
      this.count({ statusName: statusId }),
    ]);

    return {
      items,
      total,
      page: Math.floor((options?.offset ?? 0) / (options?.limit ?? 10)) + 1,
      pageSize: options?.limit ?? 10,
      totalPages: Math.ceil(total / (options?.limit ?? 10)),
    };
  }

  async findByDateRange(startDate: string, endDate: string, options?: PaginationParams & FindOptions): Promise<PaginatedResponse<OrderWithDetails>> {
    // Note: In a real database, this would use BETWEEN or >= <= operators
    const where = {
      orderDate: { gte: startDate, lte: endDate }, // This is a simplified representation
    };
    const [items, total] = await Promise.all([
      this.findAll({
        where: where as Record<string, unknown>,
        orderBy: options?.orderBy ?? [{ field: 'orderDate', direction: 'desc' }],
        limit: options?.limit,
        offset: options?.offset,
      }),
      this.count(where as Record<string, unknown>),
    ]);

    return {
      items,
      total,
      page: Math.floor((options?.offset ?? 0) / (options?.limit ?? 10)) + 1,
      pageSize: options?.limit ?? 10,
      totalPages: Math.ceil(total / (options?.limit ?? 10)),
    };
  }

  async updateStatus(orderId: string, statusId: string): Promise<OrderWithDetails> {
    return this.update(orderId, { statusName: statusId } as Partial<OrderFormData>);
  }

  async getOrderWithItems(orderId: string): Promise<OrderWithDetails | null> {
    const order = await this.findById(orderId);
    if (!order) return null;

    const items = await this.adapter.findMany('order_items', { where: { orderId } });
    return { ...order, items: items as OrderWithDetails['items'] };
  }

  async getAnalytics(dateFrom?: string, dateTo?: string): Promise<SalesAnalytics> {
    // Mock analytics - in real implementation, this would use SQL aggregations
    return {
      totalRevenue: 12500000,
      totalOrders: 342,
      averageOrderValue: 36550,
      ordersByStatus: {
        Pending: 0,
        Confirmed: 0,
        Preparing: 0,
        'Ready for Pickup': 0,
        Completed: 0,
        Cancelled: 0,
      },
      revenueByCategory: {},
      topProducts: [],
      ordersOverTime: [],
    };
  }

  async getRecentOrders(limit?: number): Promise<OrderWithDetails[]> {
    return this.findAll({
      orderBy: [{ field: 'orderDate', direction: 'desc' }],
      limit: limit ?? 5,
    });
  }
}

// In-memory implementation for development
export class InMemoryOrderRepository extends OrderRepositoryImpl {
  constructor() {
    super(new InMemoryAdapter());
  }
}

// Singleton instance for easy access
let orderRepositoryInstance: OrderRepository | null = null;

export function getOrderRepository(): OrderRepository {
  if (!orderRepositoryInstance) {
    orderRepositoryInstance = new InMemoryOrderRepository();
  }
  return orderRepositoryInstance;
}

export function setOrderRepository(repo: OrderRepository): void {
  orderRepositoryInstance = repo;
}