// ============================================================================
// SweetCrumb Bakery - Type Definitions
// Based on the database schema provided
// ============================================================================

// -----------------------------------------------------------------------------
// Base Types
// -----------------------------------------------------------------------------

export type UUID = string;
export type ISODateString = string;
export type OrderStatusName = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
export type AccountStatus = 'Active' | 'Inactive' | 'Suspended';
export type AvailabilityStatus = 'Available' | 'Limited' | 'Out of Stock' | 'Discontinued';
export type NotificationType = 'Order Confirmation' | 'Status Update' | 'Ready for Pickup' | 'Promotion' | 'System';

// -----------------------------------------------------------------------------
// 1. Customer
// -----------------------------------------------------------------------------
export interface Customer {
  customerId: UUID;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  username: string;
  passwordHash: string; // Never expose in client state
  registrationDate: ISODateString;
  accountStatus: AccountStatus;
}

// Customer profile (safe for client)
export interface CustomerProfile {
  customerId: UUID;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  username: string;
  registrationDate: ISODateString;
  accountStatus: AccountStatus;
}

export interface CustomerRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CustomerLoginData {
  username: string;
  password: string;
}

// -----------------------------------------------------------------------------
// 2. Admin
// -----------------------------------------------------------------------------
export interface Admin {
  adminId: UUID;
  fullName: string;
  email: string;
  contactNumber: string;
  username: string;
  passwordHash: string;
  roleAccess: 'Super Admin' | 'Manager' | 'Staff';
  assignedDate: ISODateString;
}

export interface AdminProfile {
  adminId: UUID;
  fullName: string;
  email: string;
  contactNumber: string;
  username: string;
  roleAccess: 'Super Admin' | 'Manager' | 'Staff';
  assignedDate: ISODateString;
}

export interface AdminLoginData {
  username: string;
  password: string;
}

// -----------------------------------------------------------------------------
// 3. Cake Category
// -----------------------------------------------------------------------------
export interface CakeCategory {
  categoryId: UUID;
  categoryName: string;
  description: string;
  sortOrder: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CakeCategoryFormData {
  categoryName: string;
  description: string;
  sortOrder: number;
}

// -----------------------------------------------------------------------------
// 4. Cake Product
// -----------------------------------------------------------------------------
export interface CakeProduct {
  productId: UUID;
  categoryId: UUID;
  productName: string;
  description: string;
  price: number; // in cents or decimal
  availabilityStatus: AvailabilityStatus;
  imageReference: string; // URL or path
  dateAdded: ISODateString;
  lastUpdated: ISODateString;
  // Relations (populated when needed)
  category?: CakeCategory;
}

export interface CakeProductFormData {
  categoryId: UUID;
  productName: string;
  description: string;
  price: number;
  availabilityStatus: AvailabilityStatus;
  imageReference: string;
}

export interface CakeProductWithCategory extends CakeProduct {
  category: CakeCategory;
}

// For display in catalog
export interface ProductCardData {
  productId: UUID;
  productName: string;
  description: string;
  price: number;
  imageReference: string;
  availabilityStatus: AvailabilityStatus;
  categoryName: string;
}

// -----------------------------------------------------------------------------
// 5. Cart
// -----------------------------------------------------------------------------
export interface Cart {
  cartId: UUID;
  customerId: UUID;
  sessionIdentifier: string;
  createdDate: ISODateString;
  lastModified: ISODateString;
  items?: CartItem[];
}

export interface CartSummary {
  cartId: UUID;
  itemCount: number;
  subtotal: number;
}

// -----------------------------------------------------------------------------
// 6. Cart Item
// -----------------------------------------------------------------------------
export interface CartItem {
  cartItemId: UUID;
  cartId: UUID;
  productId: UUID;
  quantity: number;
  subtotalCalculation: number; // price * quantity
  // Relations
  product?: CakeProduct;
}

export interface CartItemFormData {
  productId: UUID;
  quantity: number;
}

export interface CartItemWithProduct extends CartItem {
  product: CakeProduct;
}

// -----------------------------------------------------------------------------
// 7. Pickup Schedule
// -----------------------------------------------------------------------------
export interface PickupSchedule {
  pickupScheduleId: UUID;
  preferredDate: ISODateString; // Date only (YYYY-MM-DD)
  preferredTime: string; // Time range (e.g., "10:00-11:00")
  availabilityFlag: boolean;
  notes: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PickupScheduleFormData {
  preferredDate: string;
  preferredTime: string;
  availabilityFlag: boolean;
  notes: string;
}

export interface PickupTimeSlot {
  startTime: string;
  endTime: string;
  label: string;
  isAvailable: boolean;
}

// -----------------------------------------------------------------------------
// 8. Order Status
// -----------------------------------------------------------------------------
export interface OrderStatus {
  orderStatusId: UUID;
  statusName: OrderStatusName;
  statusDescription: string;
  sortOrder: number;
}

export const ORDER_STATUSES: OrderStatus[] = [
  { orderStatusId: '1', statusName: 'Pending', statusDescription: 'Order received, awaiting confirmation', sortOrder: 1 },
  { orderStatusId: '2', statusName: 'Confirmed', statusDescription: 'Order confirmed by admin', sortOrder: 2 },
  { orderStatusId: '3', statusName: 'Preparing', statusDescription: 'Cake is being prepared', sortOrder: 3 },
  { orderStatusId: '4', statusName: 'Ready for Pickup', statusDescription: 'Order ready for customer pickup', sortOrder: 4 },
  { orderStatusId: '5', statusName: 'Completed', statusDescription: 'Order picked up and completed', sortOrder: 5 },
  { orderStatusId: '6', statusName: 'Cancelled', statusDescription: 'Order cancelled', sortOrder: 6 },
];

export function getOrderStatusById(id: UUID): OrderStatus | undefined {
  return ORDER_STATUSES.find(s => s.orderStatusId === id);
}

export function getOrderStatusByName(name: OrderStatusName): OrderStatus | undefined {
  return ORDER_STATUSES.find(s => s.statusName === name);
}

export function getNextOrderStatus(currentStatusId: UUID): OrderStatus | undefined {
  const current = getOrderStatusById(currentStatusId);
  if (!current) return undefined;
  return ORDER_STATUSES.find(s => s.sortOrder === current.sortOrder + 1);
}

export function getOrderStatusColor(statusName: OrderStatusName): string {
  switch (statusName) {
    case 'Pending': return 'badge-warning';
    case 'Confirmed': return 'badge-primary';
    case 'Preparing': return 'badge-secondary';
    case 'Ready for Pickup': return 'badge-success';
    case 'Completed': return 'badge-neutral';
    case 'Cancelled': return 'badge-neutral';
    default: return 'badge-neutral';
  }
}

// -----------------------------------------------------------------------------
// 9. Order
// -----------------------------------------------------------------------------
export interface Order {
  orderId: UUID;
  customerId: UUID;
  pickupScheduleId: UUID;
  orderStatusId: UUID;
  orderDate: ISODateString;
  totalAmount: number;
  remarks: string;
  // Relations
  customer?: CustomerProfile;
  pickupSchedule?: PickupSchedule;
  orderStatus?: OrderStatus;
  items?: OrderItem[];
}

export interface OrderFormData {
  pickupScheduleId: UUID;
  remarks: string;
}

export interface OrderWithDetails extends Order {
  customer: CustomerProfile;
  pickupSchedule: PickupSchedule;
  orderStatus: OrderStatus;
  items: OrderItemWithProduct[];
}

export interface OrderSummary {
  orderId: UUID;
  orderDate: ISODateString;
  totalAmount: number;
  statusName: OrderStatusName;
  itemCount: number;
  pickupDate: string;
  pickupTime: string;
}

// -----------------------------------------------------------------------------
// 10. Order Item
// -----------------------------------------------------------------------------
export interface OrderItem {
  orderItemId: UUID;
  orderId: UUID;
  productId: UUID;
  quantity: number;
  unitPriceAtOrder: number;
  lineTotal: number;
  // Relations
  product?: CakeProduct;
}

export interface OrderItemWithProduct extends OrderItem {
  product: CakeProduct;
}

// -----------------------------------------------------------------------------
// 11. Notification
// -----------------------------------------------------------------------------
export interface Notification {
  notificationId: UUID;
  customerId: UUID;
  orderId: UUID | null;
  messageContent: string;
  notificationType: NotificationType;
  dateTimeCreated: ISODateString;
  isRead: boolean;
}

export interface NotificationSummary {
  notificationId: UUID;
  messageContent: string;
  notificationType: NotificationType;
  dateTimeCreated: ISODateString;
  isRead: boolean;
  orderId?: UUID;
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  categoryId?: UUID;
  availabilityStatus?: AvailabilityStatus;
  statusName?: OrderStatusName;
  dateFrom?: ISODateString;
  dateTo?: ISODateString;
}

// -----------------------------------------------------------------------------
// Form Validation Types (Zod schemas will use these)
// -----------------------------------------------------------------------------
export type CustomerRegistrationForm = CustomerRegistrationData;
export type CustomerLoginForm = CustomerLoginData;
export type AdminLoginForm = AdminLoginData;
export type CakeCategoryForm = CakeCategoryFormData;
export type CakeProductForm = CakeProductFormData;
export type CartItemForm = CartItemFormData;
export type PickupScheduleForm = PickupScheduleFormData;
export type OrderForm = OrderFormData;

// -----------------------------------------------------------------------------
// UI State Types
// -----------------------------------------------------------------------------
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}

// -----------------------------------------------------------------------------
// Dashboard/Analytics Types
// -----------------------------------------------------------------------------
export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatusName, number>;
  revenueByCategory: Record<string, number>;
  topProducts: Array<{ productId: UUID; productName: string; quantity: number; revenue: number }>;
  ordersOverTime: Array<{ date: string; orders: number; revenue: number }>;
}

export interface InventoryStatus {
  productId: UUID;
  productName: string;
  categoryName: string;
  availabilityStatus: AvailabilityStatus;
  totalOrdered: number;
  revenue: number;
}

// -----------------------------------------------------------------------------
// Auth Context Types
// -----------------------------------------------------------------------------
export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: UUID;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: CustomerLoginData | AdminLoginData, role: UserRole) => Promise<void>;
  register: (data: CustomerRegistrationData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

// ============================================================================
// Utility Functions
// ============================================================================

export function formatCurrency(amount: number, currency = 'PHP'): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100); // Assuming amount is in cents
}

export function formatCurrencyRaw(amount: number, currency = 'PHP'): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: ISODateString, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('en-PH', options ?? defaultOptions);
}

export function formatDateTime(dateString: ISODateString): string {
  return new Date(dateString).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(timeString: string): string {
  // Convert 24-hour format to 12-hour with AM/PM
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function calculateCartTotals(items: CartItemWithProduct[]): { subtotal: number; itemCount: number } {
  return items.reduce(
    (acc, item) => ({
      subtotal: acc.subtotal + item.subtotalCalculation,
      itemCount: acc.itemCount + item.quantity,
    }),
    { subtotal: 0, itemCount: 0 }
  );
}

export function calculateOrderTotals(items: OrderItemWithProduct[]): { total: number; itemCount: number } {
  return items.reduce(
    (acc, item) => ({
      total: acc.total + item.lineTotal,
      itemCount: acc.itemCount + item.quantity,
    }),
    { total: 0, itemCount: 0 }
  );
}