// ============================================================================
// SweetCrumb Bakery - Admin Categories Page (Refactored)
// ============================================================================

import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, GripVertical, ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button, Input, Textarea, Modal, ConfirmModal, Card, Table, Badge, DropdownMenu } from '@/components/ui';
import { FormField, FormActions, FormLayout, FormSection } from '@/components/forms/FormField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks';
import type { CategoryFilters } from '@/hooks/useCategories';
import { createCategoryColumns, CategoryForm } from '@/components/categories';

// -----------------------------------------------------------------------------
// Validation Schema
// -----------------------------------------------------------------------------

const categorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required').max(50, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  sortOrder: z.number().min(1, 'Sort order must be positive'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

// -----------------------------------------------------------------------------
// Categories Page
// -----------------------------------------------------------------------------

export function Categories() {
  const [search, setSearch] = useState('');
  const [reorderMode, setReorderMode] = useState(false);

  const {
    filteredCategories,
    totalCount,
    filters,
    setFilters,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = useCategories();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: '',
      description: '',
      sortOrder: totalCount + 1,
    },
  });

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const handleSubmit = async (data: { categoryName: string; description?: string; sortOrder?: number }) => {
    try {
      const categoryData = {
        categoryName: data.categoryName,
        description: data.description ?? '',
        sortOrder: data.sortOrder ?? totalCount + 1,
      };
      if (selectedCategory?.categoryId) {
        await updateCategory(selectedCategory.categoryId, categoryData);
      } else {
        await createCategory(categoryData);
      }
      setSelectedCategory(null);
      form.reset({ categoryName: '', description: '', sortOrder: totalCount + 1 });
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDelete = (category: any) => {
    setDeleteConfirm(category);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteCategory(deleteConfirm.categoryId);
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const moveCategory = (categoryId: string, direction: 'up' | 'down') => {
    // This would need to be implemented in the hook
    console.log('Move category:', categoryId, direction);
  };

  const columns = createCategoryColumns({
    onView: (category) => { setSelectedCategory(category); form.reset(category); },
    onEdit: (category) => { setSelectedCategory(category); form.reset(category); },
    onDelete: handleDelete,
    onReorder: (categories) => reorderCategories(categories.map((category) => category.categoryId)),
  }, reorderMode);

  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    const sortMap: Record<string, CategoryFilters['sortBy']> = {
      'sortOrder_asc': 'order-asc',
      'sortOrder_desc': 'order-desc',
      'categoryName_asc': 'name-asc',
      'categoryName_desc': 'name-desc',
    };
    setFilters({ sortBy: sortMap[`${key}_${direction}`] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display font-medium text-charcoal-900">Categories</h1>
          <p className="text-body text-text-muted mt-1">Organize your cake catalog</p>
        </div>
        <Button onClick={() => { setSelectedCategory({}); form.reset({ categoryName: '', description: '', sortOrder: totalCount + 1 }); }}>
          <Plus className="w-5 h-5 mr-2" /> Add Category
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <Input
          type="search"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="max-w-md"
        />
      </Card>

      {/* Categories List */}
      <Card>
        {reorderMode ? (
          // Reorder Mode
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-lg font-medium text-charcoal-900">Drag to Reorder</h2>
              <Button variant="ghost" onClick={() => setReorderMode(false)}>Done</Button>
            </div>
            <div className="space-y-2">
              {filteredCategories.map((category, index) => (
                <div key={category.categoryId} className="flex items-center gap-4 p-4 bg-warm-50 rounded-xl">
                  <GripVertical className="w-5 h-5 text-text-muted cursor-grab" />
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-charcoal-900">{category.categoryName}</p>
                    <p className="text-body-sm text-text-muted">{category.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => moveCategory(category.categoryId, 'up')} disabled={index === 0} aria-label="Move up">
                      <ChevronUp className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => moveCategory(category.categoryId, 'down')} disabled={index === filteredCategories.length - 1} aria-label="Move down">
                      <ChevronDown className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Normal View
          <>
            <Table
              columns={columns}
              data={filteredCategories}
              keyExtractor={cat => cat.categoryId}
              striped
              hoverable
              sortable
              onSort={handleSortChange}
              defaultSortKey="sortOrder"
              defaultSortDirection="asc"
              emptyMessage="No categories found"
            />

            {filteredCategories.length > 0 && (
              <div className="p-4 border-t border-border flex items-center justify-between">
                <span className="text-body-sm text-text-secondary">{totalCount} categories total</span>
                <Button variant="outline" size="sm" onClick={() => setReorderMode(true)}>
                  <GripVertical className="w-4 h-4 mr-1" /> Reorder
                </Button>
              </div>
            )}
          </>
        )}

        {/* Add/Edit Modal */}
        <CategoryForm
          isOpen={selectedCategory !== null}
          onClose={() => { setSelectedCategory(null); form.reset({ categoryName: '', description: '', sortOrder: totalCount + 1 }); }}
          onSubmit={handleSubmit}
          initialData={selectedCategory}
          title={selectedCategory?.categoryId ? 'Edit Category' : 'Add Category'}
          submitLabel={selectedCategory?.categoryId ? 'Save Changes' : 'Create Category'}
        />

        {/* Delete Confirm Modal */}
        <ConfirmModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={confirmDelete}
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteConfirm?.categoryName}"? This will also affect ${deleteConfirm?.productCount} product(s).`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </Card>
    </div>
  );
}