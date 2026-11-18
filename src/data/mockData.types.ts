// ============================================================================
// SweetCrumb Bakery - Mock Data Type Definitions
// ============================================================================

import type { OrderStatusName, AvailabilityStatus } from '@/types';

// -----------------------------------------------------------------------------
// Order Types
// -----------------------------------------------------------------------------

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPriceAtOrder: number;
  lineTotal: number;
  imageReference?: string;
  categoryName?: string;
}

export interface OrderRecord {
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  totalAmount: number;
  statusName: OrderStatusName;
  pickupDate: string;
  pickupTime: string;
  itemCount: number;
  remarks: string;
  items: OrderItem[];
}

// -----------------------------------------------------------------------------
// Product Types
// -----------------------------------------------------------------------------

export interface ProductRecord {
  productId: string;
  categoryId: string;
  categoryName: string;
  productName: string;
  description: string;
  price: number;
  availabilityStatus: AvailabilityStatus;
  imageReference: string;
  featured: boolean;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  dateAdded: string;
  lastUpdated: string;
}

// -----------------------------------------------------------------------------
// Category Types
// -----------------------------------------------------------------------------

export interface CategoryRecord {
  categoryId: string;
  categoryName: string;
  description: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  productCount: number;
}

// -----------------------------------------------------------------------------
// Pickup Schedule Types
// -----------------------------------------------------------------------------

export interface PickupScheduleRecord {
  pickupScheduleId: string;
  preferredDate: string;
  preferredTime: string;
  availabilityFlag: boolean;
  notes: string;
  maxOrders: number;
  currentOrders: number;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Customer Types
// -----------------------------------------------------------------------------

export interface CustomerRecord {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  username: string;
  registrationDate: string;
  accountStatus: 'Active' | 'Inactive' | 'Suspended';
}

// -----------------------------------------------------------------------------
// Admin Dashboard Stats
// -----------------------------------------------------------------------------

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockProducts: number;
  avgOrderValue: number;
  revenueGrowth: number;
}

export interface RecentOrder {
  orderId: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  statusName: OrderStatusName;
}

export interface TopProduct {
  productId: string;
  productName: string;
  orders: number;
  revenue: number;
}

export interface PendingPickup {
  orderId: string;
  customerName: string;
  pickupDate: string;
  pickupTime: string;
  itemCount: number;
}

export interface LowStockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
}

// -----------------------------------------------------------------------------
// Analytics Types
// -----------------------------------------------------------------------------

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrdersByStatus {
  name: string;
  value: number;
  color: string;
}

export interface RevenueByCategory {
  name: string;
  revenue: number;
  orders: number;
}

export interface TopProductAnalytics {
  name: string;
  orders: number;
  revenue: number;
  avgRating: number;
}

export interface CustomerMetrics {
  name: string;
  value: number | string;
  change: string;
  trend: 'up' | 'down';
}

export interface WeeklyComparison {
  name: string;
  week: string;
  revenue: number;
  orders: number;
}

// -----------------------------------------------------------------------------
// Time Slots
// -----------------------------------------------------------------------------

export interface TimeSlot {
  value: string;
  label: string;
}

// -----------------------------------------------------------------------------
// Mock Data Collections Type
// -----------------------------------------------------------------------------

export interface MockDataCollections {
  orders: OrderRecord[];
  products: ProductRecord[];
  categories: CategoryRecord[];
  pickupSchedules: PickupScheduleRecord[];
  customers: CustomerRecord[];
  timeSlots: TimeSlot[];
  dashboardStats: DashboardStats;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  pendingPickups: PendingPickup[];
  lowStockAlerts: LowStockAlert[];
  revenueData: RevenueDataPoint[];
  ordersByStatus: OrdersByStatus[];
  revenueByCategory: RevenueByCategory[];
  topProductsAnalytics: TopProductAnalytics[];
  customerMetrics: CustomerMetrics[];
  weeklyComparison: WeeklyComparison[];
}