// ============================================================================
// SweetCrumb Bakery - Database Adapters
// This folder is where you add your database integration
// Supported: PostgreSQL, MySQL, SQLite, Supabase, Firebase, Prisma, Drizzle, etc.
// ============================================================================

// -----------------------------------------------------------------------------
// Database Adapter Interface
// Implement this interface for your chosen database
// -----------------------------------------------------------------------------

export interface DatabaseAdapter {
  // Connection
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Transaction support
  transaction<T>(callback: (tx: DatabaseTransaction) => Promise<T>): Promise<T>;

  // Generic CRUD
  findOne<T>(table: string, where: Record<string, unknown>): Promise<T | null>;
  findMany<T>(table: string, options?: FindOptions): Promise<T[]>;
  findById<T>(table: string, id: string): Promise<T | null>;
  create<T>(table: string, data: Record<string, unknown>): Promise<T>;
  update<T>(table: string, id: string, data: Record<string, unknown>): Promise<T>;
  delete(table: string, id: string): Promise<boolean>;
  count(table: string, where?: Record<string, unknown>): Promise<number>;

  // Query builder methods
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number; insertId?: string }>;
}

export interface DatabaseTransaction {
  findOne<T>(table: string, where: Record<string, unknown>): Promise<T | null>;
  findMany<T>(table: string, options?: FindOptions): Promise<T[]>;
  findById<T>(table: string, id: string): Promise<T | null>;
  create<T>(table: string, data: Record<string, unknown>): Promise<T>;
  update<T>(table: string, id: string, data: Record<string, unknown>): Promise<T>;
  delete(table: string, id: string): Promise<boolean>;
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number; insertId?: string }>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface FindOptions {
  where?: Record<string, unknown>;
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  limit?: number;
  offset?: number;
  select?: string[];
  join?: JoinClause[];
}

export interface JoinClause {
  table: string;
  on: { left: string; right: string };
  type?: 'inner' | 'left' | 'right';
  alias?: string;
}

// -----------------------------------------------------------------------------
// Repository Pattern - Base Repository
// -----------------------------------------------------------------------------

export interface Repository<T, CreateData, UpdateData> {
  findById(id: string): Promise<T | null>;
  findAll(options?: FindOptions): Promise<T[]>;
  findOne(where: Record<string, unknown>): Promise<T | null>;
  create(data: CreateData): Promise<T>;
  update(id: string, data: UpdateData): Promise<T>;
  delete(id: string): Promise<boolean>;
  count(where?: Record<string, unknown>): Promise<number>;
  exists(where: Record<string, unknown>): Promise<boolean>;
}

export abstract class BaseRepository<T, CreateData, UpdateData> implements Repository<T, CreateData, UpdateData> {
  constructor(
    protected adapter: DatabaseAdapter,
    protected tableName: string,
    protected idField: string = 'id'
  ) {}

  async findById(id: string): Promise<T | null> {
    return this.adapter.findById<T>(this.tableName, id);
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return this.adapter.findMany<T>(this.tableName, options);
  }

  async findOne(where: Record<string, unknown>): Promise<T | null> {
    return this.adapter.findOne<T>(this.tableName, where);
  }

  async create(data: CreateData): Promise<T> {
    return this.adapter.create<T>(this.tableName, data as Record<string, unknown>);
  }

  async update(id: string, data: UpdateData): Promise<T> {
    return this.adapter.update<T>(this.tableName, id, data as Record<string, unknown>);
  }

  async delete(id: string): Promise<boolean> {
    return this.adapter.delete(this.tableName, id);
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.adapter.count(this.tableName, where);
  }

  async exists(where: Record<string, unknown>): Promise<boolean> {
    const result = await this.adapter.findOne(this.tableName, where);
    return result !== null;
  }
}

// -----------------------------------------------------------------------------
// Specific Repository Interfaces
// -----------------------------------------------------------------------------

import type * as BakeryTypes from '../../types';

export interface CustomerRepository extends Repository<BakeryTypes.CustomerProfile, BakeryTypes.CustomerRegistrationData, Partial<BakeryTypes.CustomerProfile>> {
  findByEmail(email: string): Promise<BakeryTypes.CustomerProfile | null>;
  findByUsername(username: string): Promise<BakeryTypes.CustomerProfile | null>;
  findByCredentials(username: string, passwordHash: string): Promise<BakeryTypes.CustomerProfile | null>;
  updateLastLogin(customerId: string): Promise<void>;
}

export interface AdminRepository extends Repository<BakeryTypes.AdminProfile, Omit<BakeryTypes.Admin, 'adminId' | 'assignedDate'>, Partial<BakeryTypes.AdminProfile>> {
  findByEmail(email: string): Promise<BakeryTypes.AdminProfile | null>;
  findByUsername(username: string): Promise<BakeryTypes.AdminProfile | null>;
  findByCredentials(username: string, passwordHash: string): Promise<BakeryTypes.AdminProfile | null>;
}

export interface CategoryRepository extends Repository<BakeryTypes.CakeCategory, BakeryTypes.CakeCategoryFormData, Partial<BakeryTypes.CakeCategoryFormData>> {
  findAllOrdered(): Promise<BakeryTypes.CakeCategory[]>;
  findByName(name: string): Promise<BakeryTypes.CakeCategory | null>;
}

export interface ProductRepository extends Repository<BakeryTypes.CakeProductWithCategory, BakeryTypes.CakeProductFormData, Partial<BakeryTypes.CakeProductFormData>> {
  findByCategory(categoryId: string, options?: FindOptions): Promise<BakeryTypes.CakeProductWithCategory[]>;
  findAvailable(options?: FindOptions): Promise<BakeryTypes.CakeProductWithCategory[]>;
  findFeatured(limit?: number): Promise<BakeryTypes.CakeProductWithCategory[]>;
  search(query: string, options?: FindOptions): Promise<BakeryTypes.CakeProductWithCategory[]>;
  updateAvailability(productId: string, status: BakeryTypes.CakeProduct['availabilityStatus']): Promise<BakeryTypes.CakeProductWithCategory>;
  getInventoryStatus(): Promise<BakeryTypes.InventoryStatus[]>;
}

export interface CartRepository extends Repository<BakeryTypes.Cart, { customerId: string; sessionIdentifier?: string }, Partial<BakeryTypes.Cart>> {
  findByCustomerId(customerId: string): Promise<BakeryTypes.Cart | null>;
  findBySessionId(sessionId: string): Promise<BakeryTypes.Cart | null>;
  getCartWithItems(cartId: string): Promise<(BakeryTypes.Cart & { items: BakeryTypes.CartItemWithProduct[] }) | null>;
  addItem(cartId: string, item: BakeryTypes.CartItemFormData): Promise<BakeryTypes.CartItemWithProduct>;
  updateItemQuantity(cartItemId: string, quantity: number): Promise<BakeryTypes.CartItemWithProduct>;
  removeItem(cartItemId: string): Promise<boolean>;
  clearCart(cartId: string): Promise<boolean>;
  mergeCarts(sourceCartId: string, targetCartId: string): Promise<BakeryTypes.Cart>;
}

export interface OrderRepository extends Repository<BakeryTypes.OrderWithDetails, BakeryTypes.OrderFormData, Partial<BakeryTypes.OrderFormData>> {
  findByCustomerId(customerId: string, options?: BakeryTypes.PaginationParams & BakeryTypes.FilterParams): Promise<BakeryTypes.PaginatedResponse<BakeryTypes.OrderSummary>>;
  findByStatus(statusId: string, options?: BakeryTypes.PaginationParams): Promise<BakeryTypes.PaginatedResponse<BakeryTypes.OrderWithDetails>>;
  findByDateRange(startDate: string, endDate: string, options?: BakeryTypes.PaginationParams): Promise<BakeryTypes.PaginatedResponse<BakeryTypes.OrderWithDetails>>;
  updateStatus(orderId: string, statusId: string): Promise<BakeryTypes.OrderWithDetails>;
  getOrderWithItems(orderId: string): Promise<BakeryTypes.OrderWithDetails | null>;
  getAnalytics(dateFrom?: string, dateTo?: string): Promise<BakeryTypes.SalesAnalytics>;
  getRecentOrders(limit?: number): Promise<BakeryTypes.OrderWithDetails[]>;
}

export interface PickupScheduleRepository extends Repository<BakeryTypes.PickupSchedule, BakeryTypes.PickupScheduleFormData, Partial<BakeryTypes.PickupScheduleFormData>> {
  findAvailableByDate(date: string): Promise<BakeryTypes.PickupSchedule[]>;
  findByDateRange(startDate: string, endDate: string): Promise<BakeryTypes.PickupSchedule[]>;
  getAvailableTimeSlots(date: string): Promise<BakeryTypes.PickupSchedule[]>;
  markSlotUnavailable(scheduleId: string): Promise<BakeryTypes.PickupSchedule>;
  markSlotAvailable(scheduleId: string): Promise<BakeryTypes.PickupSchedule>;
}

export interface NotificationRepository extends Repository<BakeryTypes.Notification, Omit<BakeryTypes.Notification, 'notificationId' | 'dateTimeCreated' | 'isRead'>, Partial<BakeryTypes.Notification>> {
  findByCustomerId(customerId: string, options?: BakeryTypes.PaginationParams): Promise<BakeryTypes.PaginatedResponse<BakeryTypes.NotificationSummary>>;
  markAsRead(notificationId: string): Promise<BakeryTypes.Notification>;
  markAllAsRead(customerId: string): Promise<number>;
  getUnreadCount(customerId: string): Promise<number>;
  createForOrder(customerId: string, orderId: string, type: BakeryTypes.Notification['notificationType'], message: string): Promise<BakeryTypes.Notification>;
}

// -----------------------------------------------------------------------------
// Database Configuration
// -----------------------------------------------------------------------------

export interface DatabaseConfig {
  type: 'postgresql' | 'mysql' | 'sqlite' | 'supabase' | 'firebase' | 'prisma' | 'drizzle' | 'custom';
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  connectionString?: string;
  // For Supabase
  supabaseUrl?: string;
  supabaseKey?: string;
  // For Firebase
  firebaseConfig?: Record<string, unknown>;
  // Custom adapter
  customAdapter?: DatabaseAdapter;
}

export function createDatabaseAdapter(config: DatabaseConfig): DatabaseAdapter {
  switch (config.type) {
    case 'postgresql':
      return createPostgreSQLAdapter(config);
    case 'mysql':
      return createMySQLAdapter(config);
    case 'sqlite':
      return createSQLiteAdapter(config);
    case 'supabase':
      return createSupabaseAdapter(config);
    case 'firebase':
      return createFirebaseAdapter(config);
    case 'prisma':
      return createPrismaAdapter(config);
    case 'drizzle':
      return createDrizzleAdapter(config);
    case 'custom':
      if (!config.customAdapter) {
        throw new Error('Custom adapter required for custom database type');
      }
      return config.customAdapter;
    default:
      throw new Error(`Unsupported database type: ${config.type}`);
  }
}

// -----------------------------------------------------------------------------
// Adapter Implementations (Stubs - Replace with actual implementations)
// -----------------------------------------------------------------------------

function createPostgreSQLAdapter(_config: DatabaseConfig): DatabaseAdapter {
  // TODO: Implement using pg, node-postgres, or Postgres.js
  // Example:
  // import { Pool } from 'pg';
  // const pool = new Pool({ connectionString: config.connectionString });
  // return new PostgreSQLAdapter(pool);
  throw new Error('PostgreSQL adapter not implemented. Add your implementation here.');
}

function createMySQLAdapter(_config: DatabaseConfig): DatabaseAdapter {
  // TODO: Implement using mysql2 or similar
  throw new Error('MySQL adapter not implemented. Add your implementation here.');
}

function createSQLiteAdapter(_config: DatabaseConfig): DatabaseAdapter {
  // TODO: Implement using better-sqlite3 or sqlite3
  throw new Error('SQLite adapter not implemented. Add your implementation here.');
}

function createSupabaseAdapter(_config: DatabaseConfig): DatabaseAdapter {
  // TODO: Implement using @supabase/supabase-js
  // Example:
  // import { createClient } from '@supabase/supabase-js';
  // const supabase = createClient(config.supabaseUrl!, config.supabaseKey!);
  // return new SupabaseAdapter(supabase);
  throw new Error('Supabase adapter not implemented. Add your implementation here.');
}

function createFirebaseAdapter(_config: DatabaseConfig): DatabaseAdapter {
  // TODO: Implement using firebase-admin or firebase SDK
  throw new Error('Firebase adapter not implemented. Add your implementation here.');
}

function createPrismaAdapter(_config: DatabaseConfig): DatabaseAdapter {
  // TODO: Implement using @prisma/client
  // Example:
  // import { PrismaClient } from '@prisma/client';
  // const prisma = new PrismaClient();
  // return new PrismaAdapter(prisma);
  throw new Error('Prisma adapter not implemented. Add your implementation here.');
}

function createDrizzleAdapter(_config: DatabaseConfig): DatabaseAdapter {
  // TODO: Implement using drizzle-orm
  // Example:
  // import { drizzle } from 'drizzle-orm/node-postgres';
  // import { Pool } from 'pg';
  // const pool = new Pool({ connectionString: config.connectionString });
  // const db = drizzle(pool);
  // return new DrizzleAdapter(db);
  throw new Error('Drizzle adapter not implemented. Add your implementation here.');
}

// -----------------------------------------------------------------------------
// In-Memory Adapter (for development/testing)
// -----------------------------------------------------------------------------

export class InMemoryAdapter implements DatabaseAdapter {
  private data: Map<string, Map<string, Record<string, unknown>>> = new Map();
  private connected = false;

  async connect(): Promise<void> {
    this.connected = true;
    this.initializeTables();
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  private initializeTables(): void {
    const tables = [
      'customers', 'admins', 'cake_categories', 'cake_products',
      'carts', 'cart_items', 'orders', 'order_items',
      'pickup_schedules', 'order_statuses', 'notifications'
    ];
    tables.forEach(table => this.data.set(table, new Map()));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async transaction<T>(callback: (tx: DatabaseTransaction) => Promise<T>): Promise<T> {
    // Simple implementation without actual transaction support
    const tx: DatabaseTransaction = {
      findOne: <T>(table: string, where: Record<string, unknown>) => this.findOne<T>(table, where),
      findMany: <T>(table: string, options?: FindOptions) => this.findMany<T>(table, options),
      findById: <T>(table: string, id: string) => this.findById<T>(table, id),
      create: <T>(table: string, data: Record<string, unknown>) => this.create<T>(table, data),
      update: <T>(table: string, id: string, data: Record<string, unknown>) => this.update<T>(table, id, data),
      delete: (table: string, id: string) => this.delete(table, id),
      query: <T>(sql: string, params?: unknown[]) => this.query<T>(sql, params),
      execute: (sql: string, params?: unknown[]) => this.execute(sql, params),
      commit: async () => {},
      rollback: async () => {},
    };
    return callback(tx);
  }

  async findOne<T>(table: string, where: Record<string, unknown>): Promise<T | null> {
    const tableData = this.data.get(table);
    if (!tableData) return null;

    for (const [, record] of tableData) {
      if (this.matchRecord(record, where)) {
        return record as T;
      }
    }
    return null;
  }

  async findMany<T>(table: string, options?: FindOptions): Promise<T[]> {
    const tableData = this.data.get(table);
    if (!tableData) return [];

    let results = Array.from(tableData.values());

    if (options?.where) {
      results = results.filter(r => this.matchRecord(r, options.where!));
    }

    if (options?.orderBy) {
      results.sort((a, b) => {
        for (const { field, direction } of options.orderBy!) {
          const aVal = a[field] as string | number | boolean | null | undefined;
          const bVal = b[field] as string | number | boolean | null | undefined;
          if (aVal == null || bVal == null) continue;
          if (aVal < bVal) return direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    if (options?.offset) {
      results = results.slice(options.offset);
    }

    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    if (options?.select) {
      results = results.map(r => {
        const selected: Record<string, unknown> = {};
        for (const field of options.select!) {
          selected[field] = r[field];
        }
        return selected;
      });
    }

    return results as T[];
  }

  async findById<T>(table: string, id: string): Promise<T | null> {
    const tableData = this.data.get(table);
    if (!tableData) return null;
    const record = tableData.get(id);
    return record ? (record as T) : null;
  }

  async create<T>(table: string, data: Record<string, unknown>): Promise<T> {
    const tableData = this.data.get(table);
    if (!tableData) throw new Error(`Table ${table} not found`);

    const id = data.id as string || this.generateId();
    const record = { ...data, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    tableData.set(id, record);
    return record as T;
  }

  async update<T>(table: string, id: string, data: Record<string, unknown>): Promise<T> {
    const tableData = this.data.get(table);
    if (!tableData) throw new Error(`Table ${table} not found`);

    const existing = tableData.get(id);
    if (!existing) throw new Error(`Record with id ${id} not found in ${table}`);

    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    tableData.set(id, updated);
    return updated as T;
  }

  async delete(table: string, id: string): Promise<boolean> {
    const tableData = this.data.get(table);
    if (!tableData) return false;
    return tableData.delete(id);
  }

  async count(table: string, where?: Record<string, unknown>): Promise<number> {
    const records = await this.findMany(table, { where });
    return records.length;
  }

  async query<T>(sql: string, _params?: unknown[]): Promise<T[]> {
    console.warn('Raw query not supported in InMemoryAdapter:', sql);
    return [];
  }

  async execute(sql: string, _params?: unknown[]): Promise<{ affectedRows: number; insertId?: string }> {
    console.warn('Raw execute not supported in InMemoryAdapter:', sql);
    return { affectedRows: 0 };
  }

  private matchRecord(record: Record<string, unknown>, where: Record<string, unknown>): boolean {
    for (const [key, value] of Object.entries(where)) {
      if (record[key] !== value) return false;
    }
    return true;
  }

  // Helper for testing
  clear(): void {
    this.data.forEach(table => table.clear());
  }

  seed(table: string, records: Record<string, unknown>[]): void {
    const tableData = this.data.get(table);
    if (!tableData) return;
    records.forEach(r => {
      const id = r.id as string || this.generateId();
      tableData.set(id, { ...r, id });
    });
  }
}

// -----------------------------------------------------------------------------
// Usage Example
// -----------------------------------------------------------------------------

/*
// In your app initialization (e.g., main.tsx or a config file):
import { createDatabaseAdapter, DatabaseConfig, InMemoryAdapter } from '@/database/adapters';

// For development
const devConfig: DatabaseConfig = { type: 'custom', customAdapter: new InMemoryAdapter() };

// For production (example with Supabase)
const prodConfig: DatabaseConfig = {
  type: 'supabase',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

const adapter = createDatabaseAdapter(
  import.meta.env.DEV ? devConfig : prodConfig
);

await adapter.connect();

// Then use repositories:
import { CustomerRepositoryImpl } from '@/database/repositories/customer';
const customerRepo = new CustomerRepositoryImpl(adapter);
*/

// -----------------------------------------------------------------------------
// Repository Implementations (to be created in repositories/ folder)
// -----------------------------------------------------------------------------

/*
// Example repository implementation:
export class CustomerRepositoryImpl extends BaseRepository<CustomerProfile, CustomerRegistrationData, Partial<CustomerProfile>>
  implements CustomerRepository {

  constructor(adapter: DatabaseAdapter) {
    super(adapter, 'customers', 'customerId');
  }

  async findByEmail(email: string): Promise<CustomerProfile | null> {
    return this.findOne({ email });
  }

  async findByUsername(username: string): Promise<CustomerProfile | null> {
    return this.findOne({ username });
  }

  async findByCredentials(username: string, passwordHash: string): Promise<CustomerProfile | null> {
    return this.findOne({ username, passwordHash });
  }

  async updateLastLogin(customerId: string): Promise<void> {
    await this.update(customerId, { lastLoginAt: new Date().toISOString() } as any);
  }
}
*/