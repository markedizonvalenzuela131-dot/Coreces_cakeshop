# Database Integration Guide

This folder contains the database abstraction layer for the SweetCrumb Bakery application. It's designed to be **database-agnostic** so you can plug in any database solution.

## Quick Start

### 1. Choose Your Database

Supported databases:
- **PostgreSQL** (via `pg`, `postgres.js`, or Prisma/Drizzle)
- **MySQL** (via `mysql2`)
- **SQLite** (via `better-sqlite3` or `sqlite3`)
- **Supabase** (via `@supabase/supabase-js`)
- **Firebase** (via `firebase-admin` or client SDK)
- **Prisma** (via `@prisma/client`)
- **Drizzle ORM** (via `drizzle-orm`)
- **Custom** (implement the `DatabaseAdapter` interface)

### 2. Configure Your Database

Create a config file (e.g., `src/config/database.ts`):

```typescript
import { DatabaseConfig } from '@/database/adapters';

export const databaseConfig: DatabaseConfig = {
  type: 'supabase', // or 'postgresql', 'mysql', etc.
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};
```

### 3. Initialize the Adapter

```typescript
import { createDatabaseAdapter } from '@/database/adapters';
import { databaseConfig } from '@/config/database';

const adapter = createDatabaseAdapter(databaseConfig);
await adapter.connect();
```

### 4. Use Repositories

```typescript
import { CustomerRepositoryImpl } from '@/database/repositories/customer';

const customerRepo = new CustomerRepositoryImpl(adapter);
const customer = await customerRepo.findByEmail('user@example.com');
```

## Folder Structure

```
src/database/
├── adapters/
│   ├── index.ts          # Main adapter interface & factory
│   └── README.md         # This file
├── schemas/
│   └── index.ts          # Table definitions, migrations, seed data
└── repositories/         # Create your repository implementations here
    ├── customer.ts
    ├── admin.ts
    ├── category.ts
    ├── product.ts
    ├── cart.ts
    ├── order.ts
    ├── pickupSchedule.ts
    └── notification.ts
```

## Creating a Repository

Create a new file in `src/database/repositories/`:

```typescript
// src/database/repositories/product.ts
import { BaseRepository } from '@/database/adapters';
import type { CakeProductWithCategory, CakeProductFormData } from '@/types';
import type { DatabaseAdapter, FindOptions, PaginationParams } from '@/database/adapters';

export interface ProductRepository extends BaseRepository<CakeProductWithCategory, CakeProductFormData, Partial<CakeProductFormData>> {
  findByCategory(categoryId: string, options?: FindOptions): Promise<CakeProductWithCategory[]>;
  findAvailable(options?: FindOptions): Promise<CakeProductWithCategory[]>;
  search(query: string, options?: FindOptions): Promise<CakeProductWithCategory[]>;
  // ... other methods
}

export class ProductRepositoryImpl extends BaseRepository<CakeProductWithCategory, CakeProductFormData, Partial<CakeProductFormData>>
  implements ProductRepository {

  constructor(adapter: DatabaseAdapter) {
    super(adapter, 'cake_products', 'productId');
  }

  async findByCategory(categoryId: string, options?: FindOptions): Promise<CakeProductWithCategory[]> {
    return this.findAll({
      where: { categoryId },
      ...options
    });
  }

  async findAvailable(options?: FindOptions): Promise<CakeProductWithCategory[]> {
    return this.findAll({
      where: { availabilityStatus: 'Available' },
      ...options
    });
  }

  async search(query: string, options?: FindOptions): Promise<CakeProductWithCategory[]> {
    // Implement full-text search based on your database
    return this.adapter.query<CakeProductWithCategory>(
      `SELECT * FROM cake_products WHERE product_name ILIKE $1 OR description ILIKE $1`,
      [`%${query}%`]
    );
  }
}
```

## Running Migrations

The `schemas/index.ts` file contains migration scripts for PostgreSQL, MySQL, and SQLite.

```typescript
import { getMigration } from '@/database/schemas';

// For PostgreSQL
const sql = getMigration('POSTGRESQL');
// Execute via your database client
```

## In-Memory Adapter (Development)

For development without a database:

```typescript
import { InMemoryAdapter } from '@/database/adapters';
import { SEED_DATA } from '@/database/schemas';

const adapter = new InMemoryAdapter();
await adapter.connect();

// Seed initial data
adapter.seed('cake_categories', SEED_DATA.categories);
adapter.seed('order_statuses', SEED_DATA.orderStatuses);
```

## Environment Variables

Create a `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/sweetcrumb

# MySQL
DATABASE_URL=mysql://user:pass@localhost:3306/sweetcrumb
```

## Type Safety

All database operations are typed using the types from `src/types/index.ts`. The repository pattern ensures compile-time safety for your data access layer.

## Testing

The `InMemoryAdapter` is perfect for unit tests:

```typescript
import { InMemoryAdapter } from '@/database/adapters';
import { CustomerRepositoryImpl } from '@/database/repositories/customer';

test('creates customer', async () => {
  const adapter = new InMemoryAdapter();
  await adapter.connect();

  const repo = new CustomerRepositoryImpl(adapter);
  const customer = await repo.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    // ... other fields
  });

  expect(customer.email).toBe('john@example.com');
});
```