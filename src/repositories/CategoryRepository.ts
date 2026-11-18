// ============================================================================
// SweetCrumb Bakery - Category Repository Implementation
// ============================================================================

import { BaseRepository, DatabaseAdapter, InMemoryAdapter } from '@/database/adapters';
import type {
  CakeCategory,
  CakeCategoryFormData,
} from '@/types';

export interface CategoryRepository extends BaseRepository<CakeCategory, CakeCategoryFormData, Partial<CakeCategoryFormData>> {
  findAllOrdered(): Promise<CakeCategory[]>;
  findByName(name: string): Promise<CakeCategory | null>;
}

export class CategoryRepositoryImpl extends BaseRepository<CakeCategory, CakeCategoryFormData, Partial<CakeCategoryFormData>>
  implements CategoryRepository {

  constructor(adapter: DatabaseAdapter) {
    super(adapter, 'cake_categories', 'categoryId');
  }

  async findAllOrdered(): Promise<CakeCategory[]> {
    return this.findAll({
      orderBy: [{ field: 'sortOrder', direction: 'asc' }],
    });
  }

  async findByName(name: string): Promise<CakeCategory | null> {
    return this.findOne({ categoryName: name });
  }
}

// In-memory implementation for development
export class InMemoryCategoryRepository extends CategoryRepositoryImpl {
  constructor() {
    super(new InMemoryAdapter());
  }
}

// Singleton instance for easy access
let categoryRepositoryInstance: CategoryRepository | null = null;

export function getCategoryRepository(): CategoryRepository {
  if (!categoryRepositoryInstance) {
    categoryRepositoryInstance = new InMemoryCategoryRepository();
  }
  return categoryRepositoryInstance;
}

export function setCategoryRepository(repo: CategoryRepository): void {
  categoryRepositoryInstance = repo;
}