// ============================================================================
// SweetCrumb Bakery - useCategories Hook
// ============================================================================

import { useState, useMemo, useCallback } from 'react';
import type { CategoryRecord } from '@/data/mockData.types';
import { MOCK_CATEGORIES, getCategoryById } from '@/data/mockData';

export interface CategoryFilters {
  search?: string;
  sortBy?: 'name-asc' | 'name-desc' | 'order-asc' | 'order-desc' | 'product-count-desc';
}

export interface UseCategoriesResult {
  categories: CategoryRecord[];
  filteredCategories: CategoryRecord[];
  totalCount: number;
  filters: CategoryFilters;
  setFilters: (filters: Partial<CategoryFilters>) => void;
  getCategoryById: (id: string) => CategoryRecord | undefined;
  getCategoryOptions: () => { value: string; label: string }[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
  // Admin CRUD
  createCategory: (category: Omit<CategoryRecord, 'categoryId' | 'createdAt' | 'updatedAt' | 'productCount'>) => CategoryRecord;
  updateCategory: (id: string, updates: Partial<CategoryRecord>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categoryIds: string[]) => void;
}

const DEFAULT_FILTERS: CategoryFilters = {
  search: '',
  sortBy: 'order-asc',
};

export function useCategories(): UseCategoriesResult {
  const [filters, setFiltersState] = useState<CategoryFilters>(DEFAULT_FILTERS);
  const [categories, setCategories] = useState<CategoryRecord[]>(MOCK_CATEGORIES);

  // Apply filters
  const filteredCategories = useMemo(() => {
    let result = categories.filter((category) => {
      const matchesSearch =
        !filters.search ||
        category.categoryName.toLowerCase().includes(filters.search.toLowerCase()) ||
        category.description.toLowerCase().includes(filters.search.toLowerCase());
      return matchesSearch;
    });

    // Apply sorting
    switch (filters.sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
        break;
      case 'name-desc':
        result.sort((a, b) => b.categoryName.localeCompare(a.categoryName));
        break;
      case 'order-asc':
        result.sort((a, b) => a.sortOrder - b.sortOrder);
        break;
      case 'order-desc':
        result.sort((a, b) => b.sortOrder - a.sortOrder);
        break;
      case 'product-count-desc':
        result.sort((a, b) => b.productCount - a.productCount);
        break;
    }

    return result;
  }, [categories, filters]);

  const totalCount = filteredCategories.length;

  const setFilters = useCallback((newFilters: Partial<CategoryFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters = Boolean(filters.search);

  // Admin CRUD operations
  const createCategory = useCallback(
    (categoryData: Omit<CategoryRecord, 'categoryId' | 'createdAt' | 'updatedAt' | 'productCount'>): CategoryRecord => {
      const maxSortOrder = Math.max(...categories.map((c) => c.sortOrder), 0);
      const newCategory: CategoryRecord = {
        ...categoryData,
        categoryId: `cat-${Date.now()}`,
        sortOrder: maxSortOrder + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    },
    [categories]
  );

  const updateCategory = useCallback((id: string, updates: Partial<CategoryRecord>) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.categoryId === id
          ? { ...category, ...updates, updatedAt: new Date().toISOString() }
          : category
      )
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((category) => category.categoryId !== id));
  }, []);

  const reorderCategories = useCallback((categoryIds: string[]) => {
    setCategories((prev) => {
      const categoryMap = new Map(prev.map((c) => [c.categoryId, c]));
      return categoryIds.map((id, index) => {
        const category = categoryMap.get(id);
        if (!category) return null;
        return { ...category, sortOrder: index + 1, updatedAt: new Date().toISOString() };
      }).filter(Boolean) as CategoryRecord[];
    });
  }, []);

  const getCategoryOptions = useCallback(() => {
    return categories.map((c) => ({ value: c.categoryId, label: c.categoryName }));
  }, [categories]);

  return {
    categories,
    filteredCategories,
    totalCount,
    filters,
    setFilters,
    getCategoryById,
    getCategoryOptions,
    clearFilters,
    hasActiveFilters,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  };
}