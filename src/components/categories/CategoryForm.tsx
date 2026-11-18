// ============================================================================
// SweetCrumb Bakery - CategoryForm Component
// ============================================================================

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { CategoryRecord } from '@/data/mockData.types';

const categorySchema = z.object({
  categoryName: z.string().min(2, 'Category name must be at least 2 characters').max(100, 'Category name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  sortOrder: z.number().int().min(1).optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData?: Partial<CategoryRecord> | null;
  title?: string;
  submitLabel?: string;
  loading?: boolean;
}

export function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Add Category',
  submitLabel = 'Save Category',
  loading = false,
}: CategoryFormProps) {
  const isEditing = Boolean(initialData?.categoryId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: initialData?.categoryName || '',
      description: initialData?.description || '',
      sortOrder: initialData?.sortOrder,
    },
    mode: 'onChange',
  });

  const onFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
  };

  React.useEffect(() => {
    if (isOpen) {
      reset({
        categoryName: initialData?.categoryName || '',
        description: initialData?.description || '',
        sortOrder: initialData?.sortOrder,
      });
    }
  }, [isOpen, initialData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : title}
      size="md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="categoryName" className="label">
            Category Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="categoryName"
            {...register('categoryName')}
            placeholder="e.g., Celebration Cakes"
            error={errors.categoryName?.message}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="description" className="label">Description</label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Brief description of this category..."
            rows={3}
            error={errors.description?.message}
          />
        </div>

        <div>
          <label htmlFor="sortOrder" className="label">Sort Order</label>
          <Input
            id="sortOrder"
            type="number"
            min="1"
            {...register('sortOrder', { valueAsNumber: true })}
            placeholder="Display order (lower = first)"
            error={errors.sortOrder?.message}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={loading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}