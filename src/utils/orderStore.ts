import type { OrderStatusName } from '@/types';

export interface StoredOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceAtOrder: number;
  lineTotal: number;
  imageReference?: string;
}

export interface StoredOrder {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  statusName: OrderStatusName;
  customerName: string;
  pickupDate: string;
  pickupTime: string;
  itemCount: number;
  remarks: string;
  items: StoredOrderItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    address: string;
  };
  pickupSchedule: {
    pickupScheduleId: string;
    preferredDate: string;
    preferredTime: string;
    availabilityFlag: boolean;
    notes: string;
  };
  statusHistory: Array<{ status: OrderStatusName; date: string; note: string }>;
}

const STORAGE_KEY = 'sweetcrumb-orders';

export function getStoredOrders(): StoredOrder[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) as StoredOrder[] : [];
  } catch {
    return [];
  }
}

export function getStoredOrder(orderId: string): StoredOrder | undefined {
  return getStoredOrders().find(order => order.orderId === orderId);
}

export function saveStoredOrder(order: StoredOrder): void {
  const orders = getStoredOrders();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...orders.filter(item => item.orderId !== order.orderId)]));
}
