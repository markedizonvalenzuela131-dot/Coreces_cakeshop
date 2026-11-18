// ============================================================================
// SweetCrumb Bakery - Catalog Page (Refactored)
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronDown, Filter, X, Grid, List, Loader2 } from 'lucide-react';
import { Button, Input, Select, Badge, DropdownMenu, type DropdownItem } from '@/components/ui';
import { ProductCard } from '@/components/products';
import { Breadcrumb } from '@/components/ui';
import { Card } from '@/components/ui';
import { Section, containerPage } from '@/styles';
import { formatCurrency, cn } from '@/lib/utils';
import { useProducts, type ProductFilters } from '@/hooks';
import { EmptyState } from '@/components/common';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

// -----------------------------------------------------------------------------
// Catalog Page
// -----------------------------------------------------------------------------

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const {
    paginatedProducts,
    categories,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    filters,
    setFilters,
    setPage,
    setPageSize,
    clearFilters,
    hasActiveFilters,
  } = useProducts();

  // Parse search params to initialize filters
  const categoryId = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = (searchParams.get('sort') || 'newest') as ProductFilters['sortBy'];
  const availability = searchParams.get('availability') || '';

  // Sync URL params with filters
  useEffect(() => {
    setFilters({
      category: categoryId,
      search,
      sortBy: sort,
      availability: availability as any,
    });
  }, [categoryId, search, sort, availability, setFilters]);

  const handleSearchChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('search', value);
    else newParams.delete('search');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    setSearchParams(newParams);
  };

  const handleCategoryChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('category', value);
    else newParams.delete('category');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleAvailabilityChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('availability', value);
    else newParams.delete('availability');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (page > 1) newParams.set('page', String(page));
    else newParams.delete('page');
    setSearchParams(newParams);
    setPage(page);
  };

  const activeCategory = categories.find(c => c.categoryId === categoryId);

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container-page py-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Catalog', href: '/catalog' },
              { label: activeCategory?.categoryName || 'All Products', current: true },
            ]}
          />
        </div>
      </div>

      <div className="container-page py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={cn('lg:w-64 flex-shrink-0', mobileFilterOpen && 'mobile-filter-open')}>
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              className="lg:hidden w-full justify-between"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && <Badge variant="primary" size="sm">{[filters.category, filters.search, filters.availability].filter(Boolean).length}</Badge>}
            </Button>

            <div className={cn('hidden lg:block space-y-6', mobileFilterOpen && 'lg:hidden fixed inset-0 z-40 bg-white lg:static')}>
              {/* Search */}
              <div>
                <label className="label">Search</label>
                <Input
                  type="search"
                  placeholder="Search cakes..."
                  value={filters.search}
                  onChange={e => handleSearchChange(e.target.value)}
                  leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="label">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={handleCategoryChange}
                  options={[
                    { value: '', label: 'All Categories' },
                    ...categories.map(c => ({ value: c.categoryId, label: c.categoryName })),
                  ]}
                  placeholder="All Categories"
                />
              </div>

              {/* Availability Filter */}
              <div>
                <label className="label">Availability</label>
                <Select
                  value={filters.availability}
                  onValueChange={handleAvailabilityChange}
                  options={[
                    { value: '', label: 'All' },
                    { value: 'Available', label: 'In Stock' },
                    { value: 'Limited', label: 'Limited' },
                    { value: 'Unavailable', label: 'Out of Stock' },
                  ]}
                  placeholder="All"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="label">Sort By</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={handleSortChange}
                  options={sortOptions}
                />
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" className="w-full justify-start text-error" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-display-md font-display font-medium text-charcoal-900">
                  {activeCategory?.categoryName || 'All Products'}
                </h1>
                <p className="text-body text-text-muted mt-1">
                  {totalCount} product{totalCount !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* View Toggle & Sort (Mobile) */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:bg-warm-50')}
                    aria-label="Grid view"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:bg-warm-50')}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <Select
                  value={filters.sortBy}
                  onValueChange={handleSortChange}
                  options={sortOptions}
                  className="w-auto sm:w-48"
                />
              </div>
            </div>

            {/* Product Grid/List */}
            {paginatedProducts.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedProducts.map(product => (
                      <ProductCard
                        key={product.productId}
                        product={product}
                        variant="grid"
                        onAddToCart={(p) => console.log('Add to cart:', p)}
                        onViewDetails={(p) => console.log('View details:', p)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4" role="list">
                    {paginatedProducts.map(product => (
                      <ProductCard
                        key={product.productId}
                        product={product}
                        variant="list"
                        onAddToCart={(p) => console.log('Add to cart:', p)}
                        onViewDetails={(p) => console.log('View details:', p)}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                      let pageNum = index + 1;
                      if (totalPages > 5) {
                        if (currentPage <= 3) pageNum = index + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + index;
                        else pageNum = currentPage - 2 + index;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                illustration="products"
                title="No products found"
                description="Try adjusting your filters or search terms"
                action={hasActiveFilters ? {
                  label: 'Clear Filters',
                  onClick: clearFilters,
                  variant: 'outline',
                } : undefined}
              />
            )}

            {/* Mobile Filter Overlay */}
            {mobileFilterOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setMobileFilterOpen(false)}
                aria-hidden="true"
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}