// ============================================================================
// SweetCrumb Bakery - Centralized Mock Data
// ============================================================================

import type {
  OrderRecord,
  ProductRecord,
  CategoryRecord,
  PickupScheduleRecord,
  CustomerRecord,
  TimeSlot,
  DashboardStats,
  RecentOrder,
  TopProduct,
  PendingPickup,
  LowStockAlert,
  RevenueDataPoint,
  OrdersByStatus,
  RevenueByCategory,
  TopProductAnalytics,
  CustomerMetrics,
  WeeklyComparison,
  MockDataCollections,
  OrderItem,
} from './mockData.types';

import type { OrderStatusName, AvailabilityStatus } from '@/types';

// -----------------------------------------------------------------------------
// Time Slots
// -----------------------------------------------------------------------------

export const TIME_SLOTS: TimeSlot[] = [
  { value: '08:00-09:00', label: '8:00 AM - 9:00 AM' },
  { value: '09:00-10:00', label: '9:00 AM - 10:00 AM' },
  { value: '10:00-11:00', label: '10:00 AM - 11:00 AM' },
  { value: '11:00-12:00', label: '11:00 AM - 12:00 PM' },
  { value: '12:00-13:00', label: '12:00 PM - 1:00 PM' },
  { value: '13:00-14:00', label: '1:00 PM - 2:00 PM' },
  { value: '14:00-15:00', label: '2:00 PM - 3:00 PM' },
  { value: '15:00-16:00', label: '3:00 PM - 4:00 PM' },
  { value: '16:00-17:00', label: '4:00 PM - 5:00 PM' },
  { value: '17:00-18:00', label: '5:00 PM - 6:00 PM' },
];

// -----------------------------------------------------------------------------
// Orders
// -----------------------------------------------------------------------------

const orderItems: OrderItem[] = [
  { productName: 'Classic Chocolate Fudge Cake', quantity: 1, unitPriceAtOrder: 45000, lineTotal: 45000 },
  { productName: 'Chocolate Chip Cookies (6)', quantity: 1, unitPriceAtOrder: 12000, lineTotal: 12000 },
];

export const MOCK_ORDERS: OrderRecord[] = [
  {
    orderId: 'ORD-1705678901234',
    customerId: 'cust-1',
    customerName: 'Maria Santos',
    customerEmail: 'maria@example.com',
    customerPhone: '+63 912 345 6789',
    orderDate: '2024-01-20T14:30:00Z',
    totalAmount: 50400,
    statusName: 'Confirmed' as OrderStatusName,
    pickupDate: '2024-01-22',
    pickupTime: '10:00-11:00',
    itemCount: 2,
    remarks: 'Please write "Happy Birthday Maria" on the box',
    items: orderItems,
  },
  {
    orderId: 'ORD-1705678801234',
    customerId: 'cust-2',
    customerName: 'Juan Dela Cruz',
    customerEmail: 'juan@example.com',
    customerPhone: '+63 918 765 4321',
    orderDate: '2024-01-20T13:15:00Z',
    totalAmount: 42000,
    statusName: 'Preparing' as OrderStatusName,
    pickupDate: '2024-01-21',
    pickupTime: '14:00-15:00',
    itemCount: 1,
    remarks: '',
    items: [{ productName: 'Red Velvet Dream', quantity: 1, unitPriceAtOrder: 42000, lineTotal: 42000 }],
  },
  {
    orderId: 'ORD-1705678701234',
    customerId: 'cust-3',
    customerName: 'Ana Reyes',
    customerEmail: 'ana@example.com',
    customerPhone: '+63 917 555 1234',
    orderDate: '2024-01-20T11:45:00Z',
    totalAmount: 95000,
    statusName: 'Ready for Pickup' as OrderStatusName,
    pickupDate: '2024-01-20',
    pickupTime: '10:00-11:00',
    itemCount: 1,
    remarks: 'Anniversary cake',
    items: [{ productName: 'Rustic Naked Cake (Wedding)', quantity: 1, unitPriceAtOrder: 95000, lineTotal: 95000 }],
  },
  {
    orderId: 'ORD-1705678601234',
    customerId: 'cust-4',
    customerName: 'Pedro Garcia',
    customerEmail: 'pedro@example.com',
    customerPhone: '+63 915 999 8888',
    orderDate: '2024-01-20T10:30:00Z',
    totalAmount: 38000,
    statusName: 'Pending' as OrderStatusName,
    pickupDate: '2024-01-22',
    pickupTime: '14:00-15:00',
    itemCount: 1,
    remarks: '',
    items: [{ productName: 'Strawberry Shortcake', quantity: 1, unitPriceAtOrder: 38000, lineTotal: 38000 }],
  },
  {
    orderId: 'ORD-1705678501234',
    customerId: 'cust-5',
    customerName: 'Sofia Lopez',
    customerEmail: 'sofia@example.com',
    customerPhone: '+63 920 111 2222',
    orderDate: '2024-01-19T16:20:00Z',
    totalAmount: 48000,
    statusName: 'Completed' as OrderStatusName,
    pickupDate: '2024-01-19',
    pickupTime: '10:00-11:00',
    itemCount: 2,
    remarks: '',
    items: [{ productName: 'Ube Cheesecake', quantity: 1, unitPriceAtOrder: 48000, lineTotal: 48000 }],
  },
  {
    orderId: 'ORD-1705678401234',
    customerId: 'cust-6',
    customerName: 'Miguel Torres',
    customerEmail: 'miguel@example.com',
    customerPhone: '+63 919 333 4444',
    orderDate: '2024-01-19T14:10:00Z',
    totalAmount: 120000,
    statusName: 'Preparing' as OrderStatusName,
    pickupDate: '2024-01-21',
    pickupTime: '14:00-15:00',
    itemCount: 1,
    remarks: 'Wedding cake - 3 tiers',
    items: [{ productName: 'Elegant White Wedding', quantity: 1, unitPriceAtOrder: 120000, lineTotal: 120000 }],
  },
  {
    orderId: 'ORD-1705678301234',
    customerId: 'cust-7',
    customerName: 'Carmen Ruiz',
    customerEmail: 'carmen@example.com',
    customerPhone: '+63 916 777 8888',
    orderDate: '2024-01-18T09:45:00Z',
    totalAmount: 18000,
    statusName: 'Completed' as OrderStatusName,
    pickupDate: '2024-01-18',
    pickupTime: '10:00-11:00',
    itemCount: 1,
    remarks: '',
    items: [{ productName: 'Chocolate Cupcake Box (6)', quantity: 1, unitPriceAtOrder: 18000, lineTotal: 18000 }],
  },
  {
    orderId: 'ORD-1705678201234',
    customerId: 'cust-8',
    customerName: 'Ricardo Santos',
    customerEmail: 'ricardo@example.com',
    customerPhone: '+63 917 222 3333',
    orderDate: '2024-01-18T11:30:00Z',
    totalAmount: 14000,
    statusName: 'Cancelled' as OrderStatusName,
    pickupDate: '2024-01-19',
    pickupTime: '14:00-15:00',
    itemCount: 1,
    remarks: 'Customer cancelled',
    items: [{ productName: 'Fudge Brownies (6)', quantity: 1, unitPriceAtOrder: 14000, lineTotal: 14000 }],
  },
  // Additional orders for customer orders page
  {
    orderId: 'ORD-1705592501234',
    customerId: 'cust-1',
    customerName: 'Maria Santos',
    customerEmail: 'maria@example.com',
    customerPhone: '+63 912 345 6789',
    orderDate: '2024-01-18T10:15:00Z',
    totalAmount: 42000,
    statusName: 'Completed' as OrderStatusName,
    pickupDate: '2024-01-19',
    pickupTime: '14:00-15:00',
    itemCount: 1,
    remarks: '',
    items: [{ productName: 'Red Velvet Dream', quantity: 1, unitPriceAtOrder: 42000, lineTotal: 42000 }],
  },
  {
    orderId: 'ORD-1705506101234',
    customerId: 'cust-1',
    customerName: 'Maria Santos',
    customerEmail: 'maria@example.com',
    customerPhone: '+63 912 345 6789',
    orderDate: '2024-01-17T16:45:00Z',
    totalAmount: 95000,
    statusName: 'Ready for Pickup' as OrderStatusName,
    pickupDate: '2024-01-20',
    pickupTime: '10:00-11:00',
    itemCount: 1,
    remarks: '',
    items: [{ productName: 'Rustic Naked Cake (Wedding)', quantity: 1, unitPriceAtOrder: 95000, lineTotal: 95000 }],
  },
  {
    orderId: 'ORD-1705419701234',
    customerId: 'cust-1',
    customerName: 'Maria Santos',
    customerEmail: 'maria@example.com',
    customerPhone: '+63 912 345 6789',
    orderDate: '2024-01-16T09:30:00Z',
    totalAmount: 38000,
    statusName: 'Completed' as OrderStatusName,
    pickupDate: '2024-01-17',
    pickupTime: '10:00-11:00',
    itemCount: 1,
    remarks: '',
    items: [{ productName: 'Strawberry Shortcake', quantity: 1, unitPriceAtOrder: 38000, lineTotal: 38000 }],
  },
  {
    orderId: 'ORD-1705333301234',
    customerId: 'cust-1',
    customerName: 'Maria Santos',
    customerEmail: 'maria@example.com',
    customerPhone: '+63 912 345 6789',
    orderDate: '2024-01-15T13:20:00Z',
    totalAmount: 48000,
    statusName: 'Cancelled' as OrderStatusName,
    pickupDate: '2024-01-16',
    pickupTime: '14:00-15:00',
    itemCount: 1,
    remarks: '',
    items: [{ productName: 'Ube Cheesecake', quantity: 1, unitPriceAtOrder: 48000, lineTotal: 48000 }],
  },
];

// -----------------------------------------------------------------------------
// Categories
// -----------------------------------------------------------------------------

export const MOCK_CATEGORIES: CategoryRecord[] = [
  { categoryId: '1', categoryName: 'Celebration Cakes', description: 'Birthdays, anniversaries & special occasions', sortOrder: 1, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', productCount: 24 },
  { categoryId: '2', categoryName: 'Wedding Cakes', description: 'Elegant multi-tiered masterpieces', sortOrder: 2, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', productCount: 12 },
  { categoryId: '3', categoryName: 'Cupcakes', description: 'Perfect individual treats', sortOrder: 3, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', productCount: 36 },
  { categoryId: '4', categoryName: 'Pastries', description: 'Fresh baked daily', sortOrder: 4, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', productCount: 18 },
  { categoryId: '5', categoryName: 'Cookies & Brownies', description: 'Assorted cookies, brownies, and bars', sortOrder: 5, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', productCount: 22 },
  { categoryId: '6', categoryName: 'Seasonal Specials', description: 'Limited-time seasonal offerings', sortOrder: 6, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', productCount: 8 },
];

// Category options for forms
export const CATEGORY_OPTIONS = MOCK_CATEGORIES.map(c => ({ value: c.categoryId, label: c.categoryName }));

// -----------------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------------

export const MOCK_PRODUCTS: ProductRecord[] = [
  {
    productId: '1',
    categoryId: '1',
    categoryName: 'Celebration Cakes',
    productName: 'Classic Chocolate Fudge',
    description: 'Rich dark chocolate cake with velvety fudge frosting, layered with chocolate ganache and topped with chocolate curls.',
    price: 45000,
    availabilityStatus: 'Available' as AvailabilityStatus,
    imageReference: '/cakes/chocolate-fudge.jpg',
    featured: true,
    slug: 'classic-chocolate-fudge',
    metaTitle: 'Classic Chocolate Fudge Cake',
    metaDescription: 'Rich dark chocolate cake with velvety fudge frosting. Perfect for celebrations.',
    dateAdded: '2024-01-01T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
  {
    productId: '2',
    categoryId: '1',
    categoryName: 'Celebration Cakes',
    productName: 'Red Velvet Dream',
    description: 'Classic red velvet with cream cheese frosting, delicate layers of velvet sponge.',
    price: 42000,
    availabilityStatus: 'Available' as AvailabilityStatus,
    imageReference: '/cakes/red-velvet.jpg',
    featured: true,
    slug: 'red-velvet-dream',
    metaTitle: 'Red Velvet Dream Cake',
    metaDescription: 'Classic red velvet with cream cheese frosting.',
    dateAdded: '2024-01-01T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
  {
    productId: '3',
    categoryId: '2',
    categoryName: 'Wedding Cakes',
    productName: 'Rustic Naked Cake (Wedding)',
    description: 'Three-tier naked cake with fresh berries and flowers. Perfect for rustic weddings.',
    price: 95000,
    availabilityStatus: 'Available' as AvailabilityStatus,
    imageReference: '/cakes/naked-wedding.jpg',
    featured: true,
    slug: 'rustic-naked-wedding',
    metaTitle: 'Rustic Naked Wedding Cake',
    metaDescription: 'Three-tier naked cake with fresh berries and flowers.',
    dateAdded: '2024-01-01T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
  {
    productId: '4',
    categoryId: '1',
    categoryName: 'Celebration Cakes',
    productName: 'Strawberry Shortcake',
    description: 'Light vanilla sponge layered with fresh strawberries and whipped cream.',
    price: 38000,
    availabilityStatus: 'Available' as AvailabilityStatus,
    imageReference: '/cakes/strawberry-shortcake.jpg',
    featured: false,
    slug: 'strawberry-shortcake',
    metaTitle: 'Strawberry Shortcake',
    metaDescription: 'Light vanilla sponge with fresh strawberries and whipped cream.',
    dateAdded: '2024-01-01T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
  {
    productId: '5',
    categoryId: '1',
    categoryName: 'Celebration Cakes',
    productName: 'Ube Cheesecake',
    description: 'Creamy ube cheesecake with graham cracker crust and ube glaze.',
    price: 48000,
    availabilityStatus: 'Available' as AvailabilityStatus,
    imageReference: '/cakes/ube-cheesecake.jpg',
    featured: true,
    slug: 'ube-cheesecake',
    metaTitle: 'Ube Cheesecake',
    metaDescription: 'Creamy ube cheesecake with graham cracker crust.',
    dateAdded: '2024-01-01T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
  {
    productId: '6',
    categoryId: '2',
    categoryName: 'Wedding Cakes',
    productName: 'Elegant White Wedding',
    description: 'Three-tier fondant wedding cake with intricate piping and sugar flowers.',
    price: 120000,
    availabilityStatus: 'Available' as AvailabilityStatus,
    imageReference: '/cakes/white-wedding.jpg',
    featured: false,
    slug: 'elegant-white-wedding',
    metaTitle: 'Elegant White Wedding Cake',
    metaDescription: 'Three-tier fondant wedding cake with intricate piping.',
    dateAdded: '2024-01-01T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
  {
    productId: '7',
    categoryId: '3',
    categoryName: 'Cupcakes',
    productName: 'Chocolate Cupcake Box (6)',
    description: 'Six rich chocolate cupcakes with buttercream frosting and sprinkles.',
    price: 18000,
    availabilityStatus: 'Available' as AvailabilityStatus,
    imageReference: '/cakes/choc-cupcakes.jpg',
    featured: false,
    slug: 'chocolate-cupcake-box-6',
    metaTitle: 'Chocolate Cupcake Box (6)',
    metaDescription: 'Six rich chocolate cupcakes with buttercream frosting.',
    dateAdded: '2024-01-01T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
  {
    productId: '8',
    categoryId: '5',
    categoryName: 'Cookies & Brownies',
    productName: 'Fudge Brownies (6)',
    description: 'Six dense, fudgy brownies with chocolate chips and walnuts.',
    price: 14000,
    availabilityStatus: 'Available' as AvailabilityStatus,
    imageReference: '/cakes/fudge-brownies.jpg',
    featured: false,
    slug: 'fudge-brownies-6',
    metaTitle: 'Fudge Brownies (6)',
    metaDescription: 'Six dense, fudgy brownies with chocolate chips.',
    dateAdded: '2024-01-01T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
  {
    productId: '9',
    categoryId: '5',
    categoryName: 'Cookies & Brownies',
    productName: 'Chocolate Chip Cookies (6)',
    description: 'Six classic chocolate chip cookies, crispy edges with chewy centers.',
    price: 12000,
    availabilityStatus: 'Available' as AvailabilityStatus,
    imageReference: '/cakes/cookies-chocchip.jpg',
    featured: false,
    slug: 'chocolate-chip-cookies-6',
    metaTitle: 'Chocolate Chip Cookies (6)',
    metaDescription: 'Six classic chocolate chip cookies.',
    dateAdded: '2024-01-01T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
  },
];

// -----------------------------------------------------------------------------
// Pickup Schedules
// -----------------------------------------------------------------------------

export const MOCK_PICKUP_SCHEDULES: PickupScheduleRecord[] = [
  { pickupScheduleId: '1', preferredDate: '2024-01-22', preferredTime: '10:00-11:00', availabilityFlag: true, notes: 'Morning slot', maxOrders: 5, currentOrders: 3, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { pickupScheduleId: '2', preferredDate: '2024-01-22', preferredTime: '14:00-15:00', availabilityFlag: true, notes: 'Afternoon slot', maxOrders: 5, currentOrders: 5, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { pickupScheduleId: '3', preferredDate: '2024-01-23', preferredTime: '10:00-11:00', availabilityFlag: true, notes: 'Morning slot', maxOrders: 5, currentOrders: 2, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { pickupScheduleId: '4', preferredDate: '2024-01-23', preferredTime: '14:00-15:00', availabilityFlag: false, notes: 'Fully booked', maxOrders: 5, currentOrders: 5, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { pickupScheduleId: '5', preferredDate: '2024-01-24', preferredTime: '10:00-11:00', availabilityFlag: true, notes: 'Morning slot', maxOrders: 5, currentOrders: 1, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { pickupScheduleId: '6', preferredDate: '2024-01-24', preferredTime: '14:00-15:00', availabilityFlag: true, notes: 'Afternoon slot', maxOrders: 5, currentOrders: 0, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { pickupScheduleId: '7', preferredDate: '2024-01-25', preferredTime: '10:00-11:00', availabilityFlag: true, notes: 'Morning slot', maxOrders: 5, currentOrders: 0, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { pickupScheduleId: '8', preferredDate: '2024-01-25', preferredTime: '14:00-15:00', availabilityFlag: true, notes: 'Afternoon slot', maxOrders: 5, currentOrders: 0, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
];

// -----------------------------------------------------------------------------
// Customers
// -----------------------------------------------------------------------------

export const MOCK_CUSTOMERS: CustomerRecord[] = [
  { customerId: 'cust-1', firstName: 'Maria', lastName: 'Santos', email: 'maria@example.com', contactNumber: '+63 912 345 6789', address: '123 Main St, Quezon City, Metro Manila 1100', username: 'mariasweet', registrationDate: '2023-06-15T10:00:00Z', accountStatus: 'Active' },
  { customerId: 'cust-2', firstName: 'Juan', lastName: 'Dela Cruz', email: 'juan@example.com', contactNumber: '+63 918 765 4321', address: '456 Oak Ave, Makati, Metro Manila 1200', username: 'juandc', registrationDate: '2023-07-20T10:00:00Z', accountStatus: 'Active' },
  { customerId: 'cust-3', firstName: 'Ana', lastName: 'Reyes', email: 'ana@example.com', contactNumber: '+63 917 555 1234', address: '789 Elm St, Taguig, Metro Manila 1634', username: 'anareyes', registrationDate: '2023-08-10T10:00:00Z', accountStatus: 'Active' },
];

// -----------------------------------------------------------------------------
// Dashboard Stats
// -----------------------------------------------------------------------------

export const DASHBOARD_STATS: DashboardStats = {
  totalRevenue: 12500000,
  totalOrders: 342,
  totalCustomers: 284,
  totalProducts: 120,
  pendingOrders: 12,
  lowStockProducts: 5,
  avgOrderValue: 36550,
  revenueGrowth: 12.5,
};

// -----------------------------------------------------------------------------
// Recent Orders (for dashboard)
// -----------------------------------------------------------------------------

export const RECENT_ORDERS: RecentOrder[] = [
  { orderId: 'ORD-1705678901234', customerName: 'Maria Santos', orderDate: '2024-01-20T14:30:00Z', totalAmount: 50400, statusName: 'Confirmed' },
  { orderId: 'ORD-1705678801234', customerName: 'Juan Dela Cruz', orderDate: '2024-01-20T13:15:00Z', totalAmount: 42000, statusName: 'Preparing' },
  { orderId: 'ORD-1705678701234', customerName: 'Ana Reyes', orderDate: '2024-01-20T11:45:00Z', totalAmount: 95000, statusName: 'Ready for Pickup' },
  { orderId: 'ORD-1705678601234', customerName: 'Pedro Garcia', orderDate: '2024-01-20T10:30:00Z', totalAmount: 38000, statusName: 'Pending' },
  { orderId: 'ORD-1705678501234', customerName: 'Sofia Lopez', orderDate: '2024-01-19T16:20:00Z', totalAmount: 48000, statusName: 'Completed' },
];

// -----------------------------------------------------------------------------
// Top Products (for dashboard)
// -----------------------------------------------------------------------------

export const TOP_PRODUCTS: TopProduct[] = [
  { productId: '1', productName: 'Classic Chocolate Fudge', orders: 45, revenue: 2025000 },
  { productId: '2', productName: 'Red Velvet Dream', orders: 38, revenue: 1596000 },
  { productId: '5', productName: 'Ube Cheesecake', orders: 32, revenue: 1536000 },
  { productId: '4', productName: 'Strawberry Shortcake', orders: 28, revenue: 1064000 },
  { productId: '3', productName: 'Rustic Naked Cake', orders: 15, revenue: 1425000 },
];

// -----------------------------------------------------------------------------
// Pending Pickups (for dashboard)
// -----------------------------------------------------------------------------

export const PENDING_PICKUPS: PendingPickup[] = [
  { orderId: 'ORD-1705678701234', customerName: 'Ana Reyes', pickupDate: '2024-01-20', pickupTime: '10:00-11:00', itemCount: 1 },
  { orderId: 'ORD-1705678901234', customerName: 'Maria Santos', pickupDate: '2024-01-22', pickupTime: '10:00-11:00', itemCount: 2 },
];

// -----------------------------------------------------------------------------
// Low Stock Alerts (for dashboard)
// -----------------------------------------------------------------------------

export const LOW_STOCK_ALERTS: LowStockAlert[] = [
  { productId: '7', productName: 'Chocolate Cupcake Box (6)', currentStock: 3, threshold: 10 },
  { productId: '8', productName: 'Fudge Brownies (6)', currentStock: 5, threshold: 10 },
  { productId: '9', productName: 'Chocolate Chip Cookies (6)', currentStock: 2, threshold: 10 },
];

// -----------------------------------------------------------------------------
// Analytics Data
// -----------------------------------------------------------------------------

export const REVENUE_DATA: RevenueDataPoint[] = [
  { date: '2024-01-01', revenue: 450000, orders: 12 },
  { date: '2024-01-02', revenue: 520000, orders: 15 },
  { date: '2024-01-03', revenue: 380000, orders: 10 },
  { date: '2024-01-04', revenue: 610000, orders: 18 },
  { date: '2024-01-05', revenue: 720000, orders: 22 },
  { date: '2024-01-06', revenue: 890000, orders: 28 },
  { date: '2024-01-07', revenue: 650000, orders: 20 },
  { date: '2024-01-08', revenue: 580000, orders: 16 },
  { date: '2024-01-09', revenue: 710000, orders: 21 },
  { date: '2024-01-10', revenue: 830000, orders: 25 },
  { date: '2024-01-11', revenue: 950000, orders: 30 },
  { date: '2024-01-12', revenue: 1100000, orders: 35 },
  { date: '2024-01-13', revenue: 880000, orders: 26 },
  { date: '2024-01-14', revenue: 720000, orders: 22 },
];

export const ORDERS_BY_STATUS: OrdersByStatus[] = [
  { name: 'Pending', value: 12, color: '#FADCCF' },
  { name: 'Confirmed', value: 28, color: '#FADCCF' },
  { name: 'Preparing', value: 18, color: '#C2D9C2' },
  { name: 'Ready for Pickup', value: 8, color: '#96C096' },
  { name: 'Completed', value: 45, color: '#6E6E6E' },
];

export const REVENUE_BY_CATEGORY: RevenueByCategory[] = [
  { name: 'Celebration Cakes', revenue: 4200000, orders: 120 },
  { name: 'Wedding Cakes', revenue: 2800000, orders: 35 },
  { name: 'Cupcakes', revenue: 1500000, orders: 180 },
  { name: 'Pastries', revenue: 800000, orders: 220 },
  { name: 'Cookies & Brownies', revenue: 650000, orders: 150 },
  { name: 'Seasonal Specials', revenue: 450000, orders: 60 },
];

export const TOP_PRODUCTS_ANALYTICS: TopProductAnalytics[] = [
  { name: 'Classic Chocolate Fudge', orders: 45, revenue: 2025000, avgRating: 4.8 },
  { name: 'Red Velvet Dream', orders: 38, revenue: 1596000, avgRating: 4.7 },
  { name: 'Ube Cheesecake', orders: 32, revenue: 1536000, avgRating: 4.9 },
  { name: 'Strawberry Shortcake', orders: 28, revenue: 1064000, avgRating: 4.6 },
  { name: 'Rustic Naked Cake', orders: 15, revenue: 1425000, avgRating: 4.9 },
];

export const CUSTOMER_METRICS: CustomerMetrics[] = [
  { name: 'New Customers', value: 42, change: '+15%', trend: 'up' },
  { name: 'Returning Customers', value: 156, change: '+8%', trend: 'up' },
  { name: 'Avg Orders per Customer', value: 2.3, change: '-0.1', trend: 'down' },
  { name: 'Customer Retention', value: '68%', change: '+3%', trend: 'up' },
];

export const WEEKLY_COMPARISON: WeeklyComparison[] = [
  { name: 'Week 1', week: 'Week 1', revenue: 3200000, orders: 95 },
  { name: 'Week 2', week: 'Week 2', revenue: 4100000, orders: 120 },
  { name: 'Week 3', week: 'Week 3', revenue: 3800000, orders: 110 },
  { name: 'Week 4', week: 'Week 4', revenue: 4500000, orders: 135 },
];

// -----------------------------------------------------------------------------
// Complete Collections Export
// -----------------------------------------------------------------------------

export const MOCK_DATA: MockDataCollections = {
  orders: MOCK_ORDERS,
  products: MOCK_PRODUCTS,
  categories: MOCK_CATEGORIES,
  pickupSchedules: MOCK_PICKUP_SCHEDULES,
  customers: MOCK_CUSTOMERS,
  timeSlots: TIME_SLOTS,
  dashboardStats: DASHBOARD_STATS,
  recentOrders: RECENT_ORDERS,
  topProducts: TOP_PRODUCTS,
  pendingPickups: PENDING_PICKUPS,
  lowStockAlerts: LOW_STOCK_ALERTS,
  revenueData: REVENUE_DATA,
  ordersByStatus: ORDERS_BY_STATUS,
  revenueByCategory: REVENUE_BY_CATEGORY,
  topProductsAnalytics: TOP_PRODUCTS_ANALYTICS,
  customerMetrics: CUSTOMER_METRICS,
  weeklyComparison: WEEKLY_COMPARISON,
};

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

export function getOrderById(orderId: string): OrderRecord | undefined {
  return MOCK_ORDERS.find(o => o.orderId === orderId);
}

export function getOrdersByCustomerId(customerId: string): OrderRecord[] {
  return MOCK_ORDERS.filter(o => o.customerId === customerId);
}

export function getProductById(productId: string): ProductRecord | undefined {
  return MOCK_PRODUCTS.find(p => p.productId === productId);
}

export function getProductsByCategory(categoryId: string): ProductRecord[] {
  return MOCK_PRODUCTS.filter(p => p.categoryId === categoryId);
}

export function getAvailableProducts(): ProductRecord[] {
  return MOCK_PRODUCTS.filter(p => p.availabilityStatus === 'Available');
}

export function getFeaturedProducts(limit?: number): ProductRecord[] {
  const featured = MOCK_PRODUCTS.filter(p => p.featured && p.availabilityStatus === 'Available');
  return limit ? featured.slice(0, limit) : featured;
}

export function getCategoryById(categoryId: string): CategoryRecord | undefined {
  return MOCK_CATEGORIES.find(c => c.categoryId === categoryId);
}

export function getPickupScheduleById(id: string): PickupScheduleRecord | undefined {
  return MOCK_PICKUP_SCHEDULES.find(s => s.pickupScheduleId === id);
}

export function getAvailablePickupSlots(date: string): PickupScheduleRecord[] {
  return MOCK_PICKUP_SCHEDULES.filter(s => s.preferredDate === date && s.availabilityFlag && s.currentOrders < s.maxOrders);
}

export function getCustomerById(customerId: string): CustomerRecord | undefined {
  return MOCK_CUSTOMERS.find(c => c.customerId === customerId);
}