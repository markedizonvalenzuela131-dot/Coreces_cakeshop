// ============================================================================
// SweetCrumb Bakery - Repositories Barrel Exports
// ============================================================================

export * from './CustomerRepository';
export * from './ProductRepository';
export * from './OrderRepository';
export * from './CategoryRepository';
export * from './PickupScheduleRepository';

// Repository factory for easy initialization
import { getCustomerRepository, setCustomerRepository } from './CustomerRepository';
import { getProductRepository, setProductRepository } from './ProductRepository';
import { getOrderRepository, setOrderRepository } from './OrderRepository';
import { getCategoryRepository, setCategoryRepository } from './CategoryRepository';
import { getPickupScheduleRepository, setPickupScheduleRepository } from './PickupScheduleRepository';

import type { DatabaseAdapter } from '@/database/adapters';

import { CustomerRepositoryImpl } from './CustomerRepository';
import { ProductRepositoryImpl } from './ProductRepository';
import { OrderRepositoryImpl } from './OrderRepository';
import { CategoryRepositoryImpl } from './CategoryRepository';
import { PickupScheduleRepositoryImpl } from './PickupScheduleRepository';

export function initializeRepositories(adapter: DatabaseAdapter): void {
  setCustomerRepository(new CustomerRepositoryImpl(adapter));
  setProductRepository(new ProductRepositoryImpl(adapter));
  setOrderRepository(new OrderRepositoryImpl(adapter));
  setCategoryRepository(new CategoryRepositoryImpl(adapter));
  setPickupScheduleRepository(new PickupScheduleRepositoryImpl(adapter));
}

export const repositories = {
  get customers() { return getCustomerRepository(); },
  get products() { return getProductRepository(); },
  get orders() { return getOrderRepository(); },
  get categories() { return getCategoryRepository(); },
  get pickupSchedules() { return getPickupScheduleRepository(); },
};