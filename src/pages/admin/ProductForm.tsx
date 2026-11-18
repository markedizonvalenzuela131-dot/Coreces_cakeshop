// ============================================================================
// SweetCrumb Bakery - Admin Product Form (Create/Edit) (Refactored)
// ============================================================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Camera, X, Image } from 'lucide-react';
import { Button, Input, Textarea, Select, Badge, Alert, Card, AvailabilityBadge } from '@/components/ui';
import { FormField, FormSwitch, FormFileInput, FormActions, FormSection, FormLayout } from '@/components/forms';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategories } from '@/hooks';
import { formatCurrency, cn } from '@/lib/utils';
import { clsx } from 'clsx';

// -----------------------------------------------------------------------------
// Validation Schema
// -----------------------------------------------------------------------------

const productSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  productName: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  price: z.number().min(1, 'Price must be greater than 0'),
  availabilityStatus: z.enum(['Available', 'Limited', 'Out of Stock']),
  imageReference: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  slug: z.string().max(120, 'Slug too long').optional().or(z.literal('')),
  metaTitle: z.string().max(60, 'Meta title too long').optional().or(z.literal('')),
  metaDescription: z.string().max(160, 'Meta description too long').optional().or(z.literal('')),
});

type ProductFormData = z.infer<typeof productSchema>;

// -----------------------------------------------------------------------------
// Product Form Page
// -----------------------------------------------------------------------------

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { categories } = useCategories();

  const [submitting, setSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId: '',
      productName: '',
      description: '',
      price: 0,
      availabilityStatus: 'Available',
      imageReference: '',
      featured: false,
      images: [],
      slug: '',
      metaTitle: '',
      metaDescription: '',
    },
  });

  useEffect(() => {
    if (!isEditing) return;

    // Mock product data - in real app, fetch from API
    const mockProduct: Partial<ProductFormData> = {
      categoryId: '1',
      productName: 'Classic Chocolate Fudge',
      description: 'Rich dark chocolate cake with velvety fudge frosting',
      price: 45000,
      availabilityStatus: 'Available',
      imageReference: '/cakes/chocolate-fudge.jpg',
      featured: true,
      images: ['/cakes/chocolate-fudge.jpg'],
      slug: 'classic-chocolate-fudge',
      metaTitle: 'Classic Chocolate Fudge',
      metaDescription: 'Rich dark chocolate cake with velvety fudge frosting.',
    };

    form.reset(mockProduct);
    setImagePreviews(mockProduct.images || []);
  }, [form, isEditing]);

  const onSubmit = async (_data: ProductFormData) => {
    setSubmitting(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/admin/products');
    } catch (err) {
      setError('Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (files: FileList | null) => {
    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...urls]);
      // Set first image as main image reference
      if (urls.length > 0) {
        form.setValue('imageReference', urls[0], { shouldValidate: true });
      }
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container-page py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/products" className="btn btn-ghost btn-icon" aria-label="Back to products">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-display-md font-display font-medium text-charcoal-900">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p className="text-body text-text-muted">
                  {isEditing ? 'Update product details' : 'Create a new cake listing'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/products">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" form="product-form" loading={submitting} disabled={submitting}>
                <Save className="w-5 h-5 mr-2" />
                {isEditing ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        <FormLayout onSubmit={form.handleSubmit(onSubmit)} id="product-form">
          {error && (
            <Alert variant="error" className="mb-6" dismissible onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <FormSection title="Basic Information" description="Essential product details">
                <FormField
                  name="productName"
                  control={form.control}
                  label="Product Name"
                >
                  {({ field, fieldState }) => <Input {...field} placeholder="e.g., Classic Chocolate Fudge" error={fieldState.error?.message} />}
                </FormField>

                <FormField
                  name="categoryId"
                  control={form.control}
                  label="Category"
                >
                  {({ field, fieldState }) => (
                    <Select
                      {...field}
                      options={categories.map(c => ({ value: c.categoryId, label: c.categoryName }))}
                      placeholder="Select a category"
                      error={fieldState.error?.message}
                    />
                  )}
                </FormField>

                <FormField
                  name="description"
                  control={form.control}
                  label="Description"
                >
                  {({ field, fieldState }) => (
                    <Textarea
                      {...field}
                      placeholder="Describe the cake, ingredients, flavors, and what makes it special..."
                      rows={4}
                      error={fieldState.error?.message}
                    />
                  )}
                </FormField>

                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    name="price"
                    control={form.control}
                    label="Price (₱)"
                  >
                    {({ field, fieldState }) => (
                      <Input
                        {...field}
                        type="number"
                        step="1"
                        min="1"
                        placeholder="45000"
                        error={fieldState.error?.message}
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                        onBlur={field.onBlur}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="availabilityStatus"
                    control={form.control}
                    label="Availability"
                  >
                    {({ field, fieldState }) => (
                      <Select
                        {...field}
                        options={[
                          { value: 'Available', label: 'Available' },
                          { value: 'Limited', label: 'Limited' },
                          { value: 'Out of Stock', label: 'Out of Stock' },
                        ]}
                        error={fieldState.error?.message}
                      />
                    )}
                  </FormField>

                  <FormField
                    name="featured"
                    control={form.control}
                  >
                    {({ field }) => (
                      <FormSwitch
                        {...field}
                        label="Featured Product"
                        description="Show on homepage and featured sections"
                      />
                    )}
                  </FormField>
                </div>
              </FormSection>

              <FormSection title="Images" description="Upload product photos. First image will be used as the main thumbnail.">
                <FormFileInput
                  name="images"
                  control={form.control}
                  label="Product Images"
                  accept="image/*"
                  multiple
                  preview={true}
                >
                  {() => (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden">
                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600"
                              aria-label={`Remove image ${index + 1}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {index === 0 && (
                              <span className="absolute bottom-1 left-1 badge badge-primary badge-sm">Main</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <label className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary hover:bg-primary-light/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={e => handleImageChange(e.target.files)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <Image className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                          <p className="text-body text-text-secondary">Drag & drop or click to upload</p>
                          <p className="text-caption text-text-muted">PNG, JPG up to 5MB each</p>
                        </div>
                      </label>
                    </div>
                  )}
                </FormFileInput>

                <FormField
                  name="imageReference"
                  control={form.control}
                  label="Main Image URL"
                >
                  {({ field, fieldState }) => (
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com/cake-image.jpg"
                      error={fieldState.error?.message}
                      leftIcon={<Camera className="w-5 h-5" />}
                    />
                  )}
                </FormField>
              </FormSection>

              <FormSection title="SEO & Advanced" description="Optional settings for search and display">
                <FormField
                  name="slug"
                  control={form.control}
                  label="URL Slug"
                >
                  {({ field, fieldState }) => (
                    <Input
                      {...field}
                      placeholder="auto-generated-from-name"
                      error={fieldState.error?.message}
                      leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
                    />
                  )}
                </FormField>

                <FormField
                  name="metaTitle"
                  control={form.control}
                  label="Meta Title"
                >
                  {({ field, fieldState }) => <Input {...field} placeholder="SEO title (max 60 chars)" error={fieldState.error?.message} />}
                </FormField>

                <FormField
                  name="metaDescription"
                  control={form.control}
                  label="Meta Description"
                >
                  {({ field, fieldState }) => <Textarea {...field} placeholder="SEO description (max 160 chars)" rows={2} error={fieldState.error?.message} />}
                </FormField>
              </FormSection>
            </div>

            {/* Sidebar Preview */}
            <div className="lg:col-span-1">
              <ProductPreviewCard form={form} imagePreviews={imagePreviews} />
            </div>
          </div>

          {/* Form Actions (sticky bottom on mobile) */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 lg:static lg:border-0 lg:p-0 mt-8">
            <FormActions
              submitText={isEditing ? 'Save Changes' : 'Create Product'}
              submitting={submitting}
              cancelText="Cancel"
              cancelHref="/admin/products"
            />
          </div>
        </FormLayout>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Product Preview Card
// -----------------------------------------------------------------------------

function ProductPreviewCard({ form, imagePreviews }: { form: any; imagePreviews: string[] }) {
  const productName = form.watch('productName');
  const price = form.watch('price');
  const categoryId = form.watch('categoryId');
  const availabilityStatus = form.watch('availabilityStatus');
  const description = form.watch('description');
  const featured = form.watch('featured');

  const { categories } = useCategories();

  const cat = categories.find(c => c.categoryId === categoryId);

  return (
    <Card className="sticky top-24 space-y-4">
      <div className="p-6 border-b border-border">
        <h3 className="text-heading-lg font-medium text-charcoal-900">Preview</h3>
        <p className="text-body-sm text-text-muted mt-1">How it will appear to customers</p>
      </div>

      <div className="p-6 space-y-4">
        {/* Image */}
        <div className="aspect-square rounded-xl overflow-hidden bg-warm-50 relative">
          {imagePreviews.length > 0 ? (
            <img src={imagePreviews[0]} alt={productName || 'Product preview'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-warm-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM4 20V18C4 16.34 5.34 15 7 15H17C18.66 15 20 16.34 20 18V20H4Z" />
              </svg>
            </div>
          )}
          {featured && (
            <span className="absolute top-2 left-2 badge badge-primary">Featured</span>
          )}
          <div className="absolute top-2 right-2">
            <AvailabilityBadge status={availabilityStatus} size="sm" />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="primary">{cat?.categoryName || 'Select category'}</Badge>
          </div>

          <h3 className="text-heading-md font-medium text-charcoal-900">{productName || 'Product Name'}</h3>

          <p className="text-body text-text-secondary line-clamp-2">{description || 'Product description will appear here...'}</p>

          <div className="flex items-baseline justify-between pt-2 border-t border-border">
            <span className="text-display-sm font-semibold text-primary">{price ? formatCurrency(price) : '₱0.00'}</span>
            <Badge variant={availabilityStatus === 'Available' ? 'success' : availabilityStatus === 'Limited' ? 'warning' : 'neutral'} size="md">
              {availabilityStatus}
            </Badge>
          </div>

          {/* Action buttons preview */}
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" size="sm" disabled>Add to Cart</Button>
            <Button variant="outline" size="sm" disabled>Quick View</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}