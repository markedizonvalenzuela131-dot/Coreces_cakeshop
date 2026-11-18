// ============================================================================
// SweetCrumb Bakery - Customer Repository Implementation
// ============================================================================

import { BaseRepository, DatabaseAdapter, InMemoryAdapter } from '@/database/adapters';
import type {
  CustomerProfile,
  CustomerRegistrationData,
} from '@/types';

export interface CustomerRepository extends BaseRepository<CustomerProfile, CustomerRegistrationData, Partial<CustomerProfile>> {
  findByEmail(email: string): Promise<CustomerProfile | null>;
  findByUsername(username: string): Promise<CustomerProfile | null>;
  findByCredentials(username: string, passwordHash: string): Promise<CustomerProfile | null>;
  updateLastLogin(customerId: string): Promise<void>;
}

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
    await this.update(customerId, { lastLoginAt: new Date().toISOString() } as Partial<CustomerProfile>);
  }
}

// In-memory implementation for development
export class InMemoryCustomerRepository extends CustomerRepositoryImpl {
  constructor() {
    super(new InMemoryAdapter());
  }
}

// Singleton instance for easy access
let customerRepositoryInstance: CustomerRepository | null = null;

export function getCustomerRepository(): CustomerRepository {
  if (!customerRepositoryInstance) {
    customerRepositoryInstance = new InMemoryCustomerRepository();
  }
  return customerRepositoryInstance;
}

export function setCustomerRepository(repo: CustomerRepository): void {
  customerRepositoryInstance = repo;
}