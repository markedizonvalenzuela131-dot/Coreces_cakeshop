// ============================================================================
// SweetCrumb Bakery - Product Repository Implementation
// ============================================================================

import { BaseRepository, DatabaseAdapter, InMemoryAdapter } from '@/database/adapters';
import type {
  CakeProductWithCategory,
  CakeProductFormData,
} from '@/types';

export interface ProductRepository extends BaseRepository<CakeProductWithCategory, CakeProductFormData, Partial<CakeProductFormData>> {
  findByCategory(categoryId: string, options?: FindOptions): Promise<CakeProductWithCategory[]>;
  findAvailable(options?: FindOptions): Promise<CakeProductWithCategory[]>;
  findFeatured(limit?: number): Promise<CakeProductWithCategory[]>;
  search(query: string, options?: FindOptions): Promise<CakeProductWithCategory[]>;
  updateAvailability(productId: string, status: CakeProductWithCategory['availabilityStatus']): Promise<CakeProductWithCategory>;
  getInventoryStatus(): Promise<InventoryStatus[]>;
}

interface FindOptions {
  where?: Record<string, unknown>;
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  limit?: number;
  offset?: number;
}

interface InventoryStatus {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export class ProductRepositoryImpl extends BaseRepository<CakeProductWithCategory, CakeProductFormData, Partial<CakeProductFormData>>
  implements ProductRepository {

  constructor(adapter: DatabaseAdapter) {
    super(adapter, 'cake_products', 'productId');
  }

  async findByCategory(categoryId: string, options?: FindOptions): Promise<CakeProductWithCategory[]> {
    return this.findAll({
      where: { categoryId, ...options?.where },
      orderBy: options?.orderBy,
      limit: options?.limit,
      offset: options?.offset,
    });
  }

  async findAvailable(options?: FindOptions): Promise<CakeProductWithCategory[]> {
    return this.findAll({
      where: { availabilityStatus: 'Available', ...options?.where },
      orderBy: options?.orderBy ?? [{ field: 'productName', direction: 'asc' }],
      limit: options?.limit,
      offset: options?.offset,
    });
  }

  async findFeatured(limit?: number): Promise<CakeProductWithCategory[]> {
    return this.findAll({
      where: { featured: true, availabilityStatus: 'Available' },
      orderBy: [{ field: 'dateAdded', direction: 'desc' }],
      limit,
    });
  }

  async search(query: string, options?: FindOptions): Promise<CakeProductWithCategory[]> {
    const lowerQuery = query.toLowerCase();
    // Note: In a real database, this would use ILIKE or full-text search
    // For InMemoryAdapter, we'll filter after fetching
    const allProducts = await this.findAll({
      where: options?.where,
      orderBy: options?.orderBy,
      limit: options?.limit ? options.limit * 3 : undefined, // Fetch more to filter
      offset: options?.offset,
    });

    return allProducts.filter(product =>
      product.productName.toLowerCase().includes(lowerQuery) ||
      product.description?.toLowerCase().includes(lowerQuery) ||
      product.category?.categoryName.toLowerCase().includes(lowerQuery)
    ).slice(0, options?.limit);
  }

  async updateAvailability(productId: string, status: CakeProductWithCategory['availabilityStatus']): Promise<CakeProductWithCategory> {
    return this.update(productId, { availabilityStatus: status } as Partial<CakeProductFormData>);
  }

  async getInventoryStatus(): Promise<InventoryStatus[]> {
    const products = await this.findAll();
    return products.map(product => {
      const currentStock = Math.floor(Math.random() * 20); // Mock stock data
      let status: InventoryStatus['status'] = 'in-stock';
      if (currentStock === 0) status = 'out-of-stock';
      else if (currentStock <= 5) status = 'low-stock';

      return {
        productId: product.productId,
        productName: product.productName,
        currentStock,
        threshold: 5,
        status,
      };
    });
  }
}

// In-memory implementation for development
export class InMemoryProductRepository extends ProductRepositoryImpl {
  constructor() {
    super(new InMemoryAdapter());
  }
}

// Singleton instance for easy access
let productRepositoryInstance: ProductRepository | null = null;

export function getProductRepository(): ProductRepository {
  if (!productRepositoryInstance) {
    productRepositoryInstance = new InMemoryProductRepository();
  }
  return productRepositoryInstance;
}

export function setProductRepository(repo: ProductRepository): void {
  productRepositoryInstance = repo;
}