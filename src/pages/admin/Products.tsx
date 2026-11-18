// ============================================================================
// SweetCrumb Bakery - Admin Products Page (Refactored)
// ============================================================================

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Grid, List, Edit, Trash2, Eye, MoreHorizontal, Image, X } from 'lucide-react';
import { Button, Input, Select, Badge, DropdownMenu, Modal, ConfirmModal } from '@/components/ui';
import { Card, Table } from '@/components/ui';
import { createProductColumns, ProductCard } from '@/components/products';
import { Breadcrumb } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';
import { containerPage } from '@/styles';
import { useAdminProducts } from '@/hooks';
import { EmptyState } from '@/components/common';
import type { ProductFilters } from '@/hooks/useProducts';
import type { AvailabilityStatus } from '@/types';

const statusOptions: Array<{ value: AvailabilityStatus | ''; label: string }> = [
  { value: '', label: 'All Statuses' },
  { value: 'Available', label: 'Available' },
  { value: 'Limited', label: 'Limited' },
  { value: 'Out of Stock', label: 'Out of Stock' },
];

const sortOptions: Array<{ value: NonNullable<ProductFilters['sortBy']>; label: string }> = [
  { value: 'newest', label: 'Newest First' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export function Products() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

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
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
  } = useAdminProducts();

  const columns = createProductColumns({
    onView: (product) => { setSelectedProduct(product); },
    onEdit: (product) => { setSelectedProduct(product); },
    onDelete: (product) => { setDeleteConfirm(product); },
    onToggleAvailability: (product) => {
      updateProduct(product.productId, { availabilityStatus: product.availabilityStatus === 'Available' ? 'Out of Stock' : 'Available' });
    },
    onToggleFeatured: (product) => { toggleFeatured(product.productId); },
  });

  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    const sortMap: Record<string, ProductFilters['sortBy']> = {
      'dateAdded_desc': 'newest',
      'dateAdded_asc': 'newest',
      'productName_asc': 'name-asc',
      'productName_desc': 'name-desc',
      'price_asc': 'price-asc',
      'price_desc': 'price-desc',
    };
    setFilters({ sortBy: sortMap[`${key}_${direction}`] });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteProduct(deleteConfirm.productId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display font-medium text-charcoal-900">Products</h1>
          <p className="text-body text-text-muted mt-1">Manage your cake catalog</p>
        </div>
        <Link to="/admin/products/new">
          <Button leftIcon={<Plus className="w-5 h-5" />}>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="label">Search Products</label>
            <Input
              type="search"
              placeholder="Search by name, description..."
              value={filters.search}
              onChange={e => setFilters({ search: e.target.value })}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex flex-wrap gap-3 items-end">
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ category: value })}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map(c => ({ value: c.categoryId, label: c.categoryName })),
              ]}
              className="w-full sm:w-48"
            />

            <Select
              value={filters.availability}
              onValueChange={(value) => {
                const selected = statusOptions.find((option) => option.value === value);
                if (selected) setFilters({ availability: selected.value });
              }}
              options={statusOptions}
              className="w-full sm:w-40"
            />

            <Select
              value={filters.sortBy}
              onValueChange={(value) => {
                const selected = sortOptions.find((option) => option.value === value);
                if (selected) setFilters({ sortBy: selected.value });
              }}
              options={sortOptions}
              className="w-full sm:w-40"
            />

            <div className="flex items-center gap-2 border border-border rounded-lg p-2">
              <button
                onClick={() => setViewMode('table')}
                className={cn('p-2 rounded transition-colors', viewMode === 'table' ? 'bg-primary text-white' : 'text-text-muted hover:bg-warm-50')}
                aria-label="Table view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2 rounded transition-colors', viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-muted hover:bg-warm-50')}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Products Table/Grid */}
      <Card>
        {viewMode === 'table' ? (
          <>
            <Table
              columns={columns}
              data={paginatedProducts}
              keyExtractor={product => product.productId}
              striped
              hoverable
              sortable
              onSort={handleSortChange}
              defaultSortKey="dateAdded"
              defaultSortDirection="desc"
              pagination={{
                page: currentPage,
                pageSize,
                total: totalCount,
                onPageChange: setPage,
                onPageSizeChange: setPageSize,
              }}
              emptyMessage="No products found"
            />
          </>
        ) : (
          <div className="p-6">
            {paginatedProducts.length === 0 ? (
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    variant="grid"
                    onAddToCart={() => {}}
                    onViewDetails={() => setSelectedProduct(product)}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Detail Modal */}
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct?.productName}
          size="lg"
        >
          {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteConfirm?.productName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </Card>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Product Detail Modal
// -----------------------------------------------------------------------------

function ProductDetailModal({ product, onClose }: { product: any; onClose: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="w-32 h-32 rounded-xl overflow-hidden bg-warm-50 flex-shrink-0">
          <img src={product.imageReference || '/placeholder-cake.svg'} alt={product.productName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">{product.categoryName}</Badge>
            <Badge
              variant={
                product.availabilityStatus === 'Available' ? 'success' :
                product.availabilityStatus === 'Limited' ? 'warning' : 'error'
              }
              size="md"
            >
              {product.availabilityStatus}
            </Badge>
          </div>
          <h3 className="text-heading-lg font-medium text-charcoal-900">{product.productName}</h3>
          <p className="text-body text-text-muted mt-1">{product.description}</p>
          <p className="text-heading-md font-semibold text-primary mt-4">{formatCurrency(product.price)}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="space-y-2">
          <p className="text-caption text-text-muted">Date Added</p>
          <p className="font-medium text-charcoal-900">{new Date(product.dateAdded).toLocaleDateString()}</p>
        </div>
        <div className="space-y-2">
          <p className="text-caption text-text-muted">Last Updated</p>
          <p className="font-medium text-charcoal-900">{new Date(product.lastUpdated).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Link to={`/admin/products/${product.productId}/edit`}>
          <Button>Edit Product</Button>
        </Link>
      </div>
    </div>
  );
}