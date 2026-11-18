// ============================================================================
// SweetCrumb Bakery - Application Constants
// ============================================================================

// -----------------------------------------------------------------------------
// Application Info
// -----------------------------------------------------------------------------

export const APP_INFO = {
  name: 'SweetCrumb Bakery',
  tagline: 'Fresh artisan cakes made with love',
  description: 'Order delicious handcrafted cakes online for pickup at our bakery',
  version: '1.0.0',
  author: 'SweetCrumb Team',
  url: 'https://sweetcrumb.bakery',
  supportEmail: 'support@sweetcrumb.bakery',
  phone: '+63 2 8123 4567',
  address: '123 Baker Street, Manila, Philippines',
} as const;

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

export const ROUTES = {
  // Public
  HOME: '/',
  CATALOG: '/catalog',
  PRODUCT: (id: string) => `/product/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: (id: string) => `/order-success/${id}`,

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Customer Protected
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Admin
  ADMIN_ROOT: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_NEW: '/admin/products/new',
  ADMIN_PRODUCT_EDIT: (id: string) => `/admin/products/${id}/edit`,
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_PICKUP: '/admin/pickup',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// -----------------------------------------------------------------------------
// API Endpoints (for future backend integration)
// -----------------------------------------------------------------------------

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',

  // Customers
  CUSTOMER_PROFILE: '/api/customers/profile',
  CUSTOMER_ORDERS: '/api/customers/orders',
  CUSTOMER_ADDRESS: '/api/customers/addresses',

  // Products
  PRODUCTS: '/api/products',
  PRODUCT: (id: string) => `/api/products/${id}`,
  PRODUCT_SEARCH: '/api/products/search',
  CATEGORIES: '/api/categories',
  CATEGORY: (id: string) => `/api/categories/${id}`,

  // Cart
  CART: '/api/cart',
  CART_ITEM: (id: string) => `/api/cart/items/${id}`,

  // Orders
  ORDERS: '/api/orders',
  ORDER: (id: string) => `/api/orders/${id}`,
  ORDER_STATUS: (id: string) => `/api/orders/${id}/status`,

  // Pickup
  PICKUP_SCHEDULES: '/api/pickup-schedules',
  PICKUP_SCHEDULE: (id: string) => `/api/pickup-schedules/${id}`,

  // Admin
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_ANALYTICS: '/api/admin/analytics',
} as const;

// -----------------------------------------------------------------------------
// User Roles
// -----------------------------------------------------------------------------

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  STAFF: 'staff',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// -----------------------------------------------------------------------------
// Order Statuses
// -----------------------------------------------------------------------------

export const ORDER_STATUSES = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for Pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  ORDER_STATUSES.PENDING,
  ORDER_STATUSES.CONFIRMED,
  ORDER_STATUSES.PREPARING,
  ORDER_STATUSES.READY_FOR_PICKUP,
  ORDER_STATUSES.COMPLETED,
];

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [ORDER_STATUSES.PENDING]: 'warning',
  [ORDER_STATUSES.CONFIRMED]: 'primary',
  [ORDER_STATUSES.PREPARING]: 'secondary',
  [ORDER_STATUSES.READY_FOR_PICKUP]: 'success',
  [ORDER_STATUSES.COMPLETED]: 'neutral',
  [ORDER_STATUSES.CANCELLED]: 'error',
};

// -----------------------------------------------------------------------------
// Product Availability
// -----------------------------------------------------------------------------

export const AVAILABILITY_STATUSES = {
  AVAILABLE: 'Available',
  OUT_OF_STOCK: 'Out of Stock',
  DISCONTINUED: 'Discontinued',
} as const;

export type AvailabilityStatus = typeof AVAILABILITY_STATUSES[keyof typeof AVAILABILITY_STATUSES];

// -----------------------------------------------------------------------------
// Account Status
// -----------------------------------------------------------------------------

export const ACCOUNT_STATUSES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
} as const;

export type AccountStatus = typeof ACCOUNT_STATUSES[keyof typeof ACCOUNT_STATUSES];

// -----------------------------------------------------------------------------
// Notification Types
// -----------------------------------------------------------------------------

export const NOTIFICATION_TYPES = {
  ORDER_CONFIRMATION: 'Order Confirmation',
  STATUS_UPDATE: 'Status Update',
  READY_FOR_PICKUP: 'Ready for Pickup',
  PROMOTION: 'Promotion',
  SYSTEM: 'System',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// -----------------------------------------------------------------------------
// Form Validation
// -----------------------------------------------------------------------------

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_REMARKS_LENGTH: 500,
  PHONE_MIN_LENGTH: 10,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
} as const;

// -----------------------------------------------------------------------------
// Currency
// -----------------------------------------------------------------------------

export const CURRENCY = {
  CODE: 'PHP',
  SYMBOL: '₱',
  LOCALE: 'en-PH',
  DECIMAL_PLACES: 2,
} as const;

// -----------------------------------------------------------------------------
// Date/Time
// -----------------------------------------------------------------------------

export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  WITH_TIME: 'MMM d, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
  TIME_ONLY: 'h:mm a',
} as const;

// -----------------------------------------------------------------------------
// File Upload
// -----------------------------------------------------------------------------

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

// -----------------------------------------------------------------------------
// Time Slots for Pickup
// -----------------------------------------------------------------------------

export const PICKUP_TIME_SLOTS = [
  '08:00-09:00',
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
  '17:00-18:00',
] as const;

export const PICKUP_MAX_ORDERS_PER_SLOT = 5;
export const PICKUP_ADVANCE_DAYS = 14; // How many days in advance customers can book

// -----------------------------------------------------------------------------
// Tax
// -----------------------------------------------------------------------------

export const TAX = {
  VAT_RATE: 0.12, // 12% VAT in Philippines
} as const;

// -----------------------------------------------------------------------------
// Shipping/Pickup
// -----------------------------------------------------------------------------

export const SHIPPING = {
  PICKUP_FEE: 0, // Free pickup
  FREE_SHIPPING_THRESHOLD: 0, // Not applicable for pickup-only
} as const;

// -----------------------------------------------------------------------------
// Storage Keys
// -----------------------------------------------------------------------------

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sweetcrumb_auth_token',
  REFRESH_TOKEN: 'sweetcrumb_refresh_token',
  USER_DATA: 'sweetcrumb_user_data',
  CART: 'sweetcrumb_cart',
  THEME: 'sweetcrumb_theme',
  RECENT_SEARCHES: 'sweetcrumb_recent_searches',
  VIEWED_PRODUCTS: 'sweetcrumb_viewed_products',
} as const;

// -----------------------------------------------------------------------------
// Animation Durations
// -----------------------------------------------------------------------------

export const ANIMATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  EXTRA_SLOW: 500,
} as const;

// -----------------------------------------------------------------------------
// Breakpoints (matching Tailwind)
// -----------------------------------------------------------------------------

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// -----------------------------------------------------------------------------
// Z-Index Scale
// -----------------------------------------------------------------------------

export const Z_INDEX = {
  DROPDOWN: 100,
  STICKY: 200,
  MODAL: 300,
  POPOVER: 400,
  TOOLTIP: 500,
  TOAST: 600,
} as const;

// -----------------------------------------------------------------------------
// Regex Patterns
// -----------------------------------------------------------------------------

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PH: /^(\+63|0)[0-9]{10}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  PH_ZIP: /^\d{4}$/,
} as const;

// -----------------------------------------------------------------------------
// Default Values
// -----------------------------------------------------------------------------

export const DEFAULTS = {
  PRODUCT_IMAGE: '/placeholder-cake.svg',
  USER_AVATAR: null,
  CATEGORY_IMAGE: '/placeholder-category.svg',
  PAGINATION_PAGE: 1,
  PAGINATION_SIZE: 10,
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
} as const;