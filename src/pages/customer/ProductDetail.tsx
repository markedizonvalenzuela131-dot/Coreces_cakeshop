// ============================================================================
// SweetCrumb Bakery - Product Detail Page (Refactored)
// ============================================================================

import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Heart, Share2, Truck, Shield, RotateCcw, Minus, Plus, Loader2 } from 'lucide-react';
import { Button, Input, Badge, AvailabilityBadge, Tabs, TabPanels, TabPanel, Breadcrumb, Modal, Card, StatusBadge } from '@/components/ui';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { clsx } from 'clsx';
import { containerPage } from '@/styles';
import { useProducts } from '@/hooks';
import { ProductCard } from '@/components/products';
import { EmptyState } from '@/components/common';

// -----------------------------------------------------------------------------
// Product Detail Page
// -----------------------------------------------------------------------------

export function ProductDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [imageZoom, setImageZoom] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const { products, getProductById } = useProducts();

  // Get product by ID
  const product = getProductById(id || '');
  const isAvailable = product?.availabilityStatus === 'Available';

  // Mock data for features not in the core type
  const avgRating = 4.5;
  const reviewCount = 128;
  const reviews = [
    { id: '1', author: 'Maria S.', rating: 5, date: '2024-01-15', text: 'Absolutely delicious! The chocolate was rich and the cake was moist. Perfect for my husband\'s birthday.', verified: true },
    { id: '2', author: 'James L.', rating: 4, date: '2024-01-10', text: 'Great cake, beautiful presentation. Delivery was on time. Would order again.', verified: true },
    { id: '3', author: 'Sarah K.', rating: 5, date: '2024-01-05', text: 'Best chocolate cake I\'ve had in Manila. The ganache is to die for!', verified: false },
  ];
  const specs = {
    'Serving Size': '8-10 people',
    'Weight': '2.5 kg',
    'Dimensions': '9 inches diameter',
    'Storage': 'Refrigerate, consume within 3 days',
    'Allergens': 'Contains dairy, eggs, gluten, nuts',
  };

  const handleAddToCart = () => {
    if (!isAvailable || !product) return;
    // Add to cart logic here
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(20, prev + delta)));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.productName || '',
          text: product?.description || '',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${reviewCount})` },
  ];

  if (!product) {
    return (
      <div className="min-h-screen bg-warm-50">
        <div className="container-page py-16">
          <Card>
            <div className="p-8 text-center">
              <Loader2 className="w-10 h-10 mx-auto text-primary mb-3 animate-spin" />
              <h1 className="text-heading-lg font-medium text-charcoal-900 mb-2">Loading...</h1>
              <p className="text-body text-text-muted mb-6">Loading product details</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container-page py-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Catalog', href: '/catalog' },
              { label: product.categoryName, href: `/catalog?category=${product.categoryId}` },
              { label: product.productName, current: true },
            ]}
          />
        </div>
      </div>

      <div className="container-page py-8">
        {/* Product Gallery & Info */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-warm-50 cursor-zoom-in" onClick={() => setImageZoom(true)}>
              <img
                src={product.imageReference || '/placeholder-cake.svg'}
                alt={product.productName}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link to={`/catalog?category=${product.categoryId}`} className="badge badge-primary">
                {product.categoryName}
              </Link>
              <AvailabilityBadge status={product.availabilityStatus} size="md" />
            </div>

            {/* Title */}
            <h1 className="text-display-md font-display font-medium text-charcoal-900">{product.productName}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-warm-500 text-warm-500" />
                <span className="text-heading-sm font-medium text-charcoal-900">{avgRating.toFixed(1)}</span>
                <span className="text-body-sm text-text-muted">({reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Share">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Add to favorites">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 pt-4 border-t border-border">
              <span className="text-display-sm font-semibold text-primary">{formatCurrency(product.price)}</span>
              <span className="text-body text-text-muted">PHP</span>
            </div>

            {/* Short Description */}
            <p className="text-body text-text-secondary">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="label mb-0">Quantity</label>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">
                  <Minus className="w-5 h-5" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-20 text-center border-0 focus:ring-0 py-2"
                  min={1}
                  max={20}
                />
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                rightIcon={addedToCart ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : undefined}
              >
                {addedToCart ? 'Added to Cart!' : isAvailable ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="outline" size="lg" className="sm:w-auto">
                <Heart className="w-5 h-5 mr-1" /> Save
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-body-sm text-text-muted">
                <Truck className="w-5 h-5 text-primary" />
                <span>Pickup Available</span>
              </div>
              <div className="flex items-center gap-2 text-body-sm text-text-muted">
                <Shield className="w-5 h-5 text-primary" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-body-sm text-text-muted">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={value => setActiveTab(value as 'description' | 'specs' | 'reviews')}
            variant="underline"
            className="border-b border-border"
          />

          <TabPanels className="p-6 lg:p-8">
            {/* Description Tab */}
            <TabPanel id="description" active={activeTab === 'description'}>
              <div className="prose prose-charcoal max-w-none">
                <h3 className="text-heading-md font-medium text-charcoal-900 mb-4">About This Cake</h3>
                <p className="text-body text-text-secondary mb-6">{product.description}</p>

                <h4 className="text-heading-sm font-medium text-charcoal-900 mb-3">Perfect For</h4>
                <ul className="list-disc list-inside space-y-2 text-body text-text-secondary mb-6">
                  <li>Birthday celebrations</li>
                  <li>Anniversary surprises</li>
                  <li>Chocolate lover's gatherings</li>
                  <li>Special dessert occasions</li>
                </ul>

                <h4 className="text-heading-sm font-medium text-charcoal-900 mb-3">Ingredients</h4>
                <p className="text-body text-text-secondary mb-6">
                  Premium Belgian dark chocolate (70% cocoa), fresh farm eggs, organic flour,
                  real butter, pure vanilla extract, heavy cream, and a touch of sea salt.
                  No artificial preservatives or flavors.
                </p>
              </div>
            </TabPanel>

            {/* Specifications Tab */}
            <TabPanel id="specs" active={activeTab === 'specs'}>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(specs).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <dt className="text-body-sm text-text-muted">{key}</dt>
                    <dd className="text-body font-medium text-charcoal-900">{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </TabPanel>

            {/* Reviews Tab */}
            <TabPanel id="reviews" active={activeTab === 'reviews'}>
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex flex-col lg:flex-row gap-8 pb-6 border-b border-border">
                  <div className="text-center lg:pl-8 border-l border-border">
                    <div className="text-5xl font-bold text-charcoal-900">{avgRating.toFixed(1)}</div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-warm-500 text-warm-500" />
                      ))}
                    </div>
                    <div className="text-body-sm text-text-muted mt-1">Based on {reviewCount} reviews</div>
                  </div>

                  {/* Rating Bars */}
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map(star => {
                      const review = reviews.find(r => r.rating === star);
                      const percentage = review ? (1 / (reviews.length || 1)) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-body-sm text-text-muted w-8">{star}★</span>
                          <div className="flex-1 h-2 bg-charcoal-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-warm-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-body-sm text-text-muted w-10 text-right">{Math.round(percentage)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map(review => (
                    <Card key={review.id} padding="md">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-medium">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-charcoal-900">{review.author}</span>
                              {review.verified && (
                                <Badge variant="secondary" size="sm">Verified</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={clsx('w-4 h-4', i < review.rating ? 'fill-warm-500 text-warm-500' : 'text-charcoal-200')}
                                  />
                                ))}
                              </div>
                              <span className="text-body-sm text-text-muted">{formatDate(review.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-body text-text-secondary mt-4">&ldquo;{review.text}&rdquo;</p>
                    </Card>
                  ))}

                  {/* Load More */}
                  <div className="text-center pt-4">
                    <Button variant="outline">Load More Reviews</Button>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-display-md font-display font-medium text-charcoal-900">You May Also Like</h2>
            <Link to="/catalog" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(p => p.productId !== product.productId && p.categoryId === product.categoryId)
              .slice(0, 3)
              .map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.productId}
                  product={relatedProduct}
                  variant="featured"
                  onAddToCart={() => {}}
                />
              ))}
          </div>
        </section>
      </div>

      {/* Image Zoom Modal */}
      <Modal
        isOpen={imageZoom}
        onClose={() => setImageZoom(false)}
        size="full"
        showCloseButton={true}
      >
        <div className="relative aspect-square max-h-[80vh]">
          <img
            src={product.imageReference || '/placeholder-cake.svg'}
            alt={product.productName}
            className="w-full h-full object-contain"
          />
        </div>
      </Modal>
    </div>
  );
}