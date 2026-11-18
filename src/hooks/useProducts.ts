// ============================================================================
// SweetCrumb Bakery - useProducts Hook
// ============================================================================

import { useState, useMemo, useCallback } from 'react';
import type { ProductRecord } from '@/data/mockData.types';
import type { AvailabilityStatus } from '@/types';
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  getProductById,
  getProductsByCategory,
  getAvailableProducts,
  getFeaturedProducts,
} from '@/data/mockData';

export interface ProductFilters {
  search?: string;
  category?: string;
  availability?: AvailabilityStatus | '';
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest' | 'popular';
}

interface ProductPaginationOptions {
  page: number;
  pageSize: number;
}

export interface UseProductsResult {
  products: ProductRecord[];
  filteredProducts: ProductRecord[];
  paginatedProducts: ProductRecord[];
  categories: typeof MOCK_CATEGORIES;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  getProductById: (id: string) => ProductRecord | undefined;
  getProductsByCategory: (categoryId: string) => ProductRecord[];
  getAvailableProducts: () => ProductRecord[];
  getFeaturedProducts: (limit?: number) => ProductRecord[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: '',
  availability: '',
  featured: false,
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: 'newest',
};

const DEFAULT_PAGE_SIZE = 12;

export function useProducts(): UseProductsResult {
  const [filters, setFiltersState] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState<ProductPaginationOptions>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // Apply filters
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesSearch =
        !filters.search ||
        product.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = !filters.category || product.categoryId === filters.category;

      const matchesAvailability = !filters.availability || product.availabilityStatus === filters.availability;

      const matchesFeatured = !filters.featured || product.featured === true;

      const matchesMinPrice = filters.minPrice === undefined || product.price >= filters.minPrice;
      const matchesMaxPrice = filters.maxPrice === undefined || product.price <= filters.maxPrice;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability &&
        matchesFeatured &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [filters]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (filters.sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        // In a real app, this would sort by order count
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }
    return sorted;
  }, [filteredProducts, filters.sortBy]);

  // Pagination
  const totalCount = sortedProducts.length;
  const totalPages = Math.ceil(totalCount / pagination.pageSize);
  const currentPage = Math.min(Math.max(pagination.page, 1), totalPages || 1);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pagination.pageSize;
    return sortedProducts.slice(start, start + pagination.pageSize);
  }, [sortedProducts, currentPage, pagination.pageSize]);

  const setFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page: Math.max(1, Math.min(page, totalPages || 1)) }));
  }, [totalPages]);

  const setPageSize = useCallback((pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.availability ||
    filters.featured ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined
  );

  return {
    products: MOCK_PRODUCTS,
    filteredProducts: sortedProducts,
    paginatedProducts,
    categories: MOCK_CATEGORIES,
    totalCount,
    totalPages,
    currentPage,
    pageSize: pagination.pageSize,
    filters,
    setFilters,
    setPage,
    setPageSize,
    getProductById,
    getProductsByCategory,
    getAvailableProducts,
    getFeaturedProducts,
    clearFilters,
    hasActiveFilters,
  };
}

// Admin-specific hook with CRUD operations
export function useAdminProducts(): UseProductsResult & {
  createProduct: (product: Omit<ProductRecord, 'productId' | 'dateAdded' | 'lastUpdated'>) => ProductRecord;
  updateProduct: (id: string, updates: Partial<ProductRecord>) => void;
  deleteProduct: (id: string) => void;
  toggleFeatured: (id: string) => void;
} {
  const base = useProducts();
  const [products, setProducts] = useState<ProductRecord[]>(MOCK_PRODUCTS);

  const createProduct = useCallback(
    (productData: Omit<ProductRecord, 'productId' | 'dateAdded' | 'lastUpdated'>): ProductRecord => {
      const newProduct: ProductRecord = {
        ...productData,
        productId: `prod-${Date.now()}`,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    },
    []
  );

  const updateProduct = useCallback((id: string, updates: Partial<ProductRecord>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.productId === id
          ? { ...product, ...updates, lastUpdated: new Date().toISOString() }
          : product
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((product) => product.productId !== id));
  }, []);

  const toggleFeatured = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.productId === id
          ? { ...product, featured: !product.featured, lastUpdated: new Date().toISOString() }
          : product
      )
    );
  }, []);

  return {
    ...base,
    products,
    filteredProducts: base.filteredProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
  };
}