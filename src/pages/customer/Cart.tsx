// ============================================================================
// SweetCrumb Bakery - Cart Page (Refactored)
// ============================================================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Loader2, ArrowLeft, Gift, X } from 'lucide-react';
import { Button, Input, Select, Badge, Alert, Card } from '@/components/ui';
import { formatCurrency, calculateOrderTotal, cn } from '@/lib/utils';
import { useCart } from '@/context';
import { EmptyState } from '@/components/common';

// -----------------------------------------------------------------------------
// Cart Page
// -----------------------------------------------------------------------------

export function Cart() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const { tax, deliveryFee, total } = calculateOrderTotal(
    items.map(item => ({ quantity: item.quantity, unitPrice: item.product?.price || 0 }))
  );
  const discount = promoApplied ? subtotal * 0.1 : 0;

  const isEmpty = items.length === 0;

  const handlePromoApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    // Mock validation
    if (promoCode.toUpperCase() === 'SWEET10' || promoCode.toUpperCase() === 'WELCOME') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid or expired promo code');
    }
  };

  const handlePromoRemove = () => {
    setPromoApplied(false);
    setPromoCode('');
    setPromoError('');
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container-page py-4">
          <h1 className="text-display-md font-display font-medium text-charcoal-900">Shopping Cart</h1>
          <p className="text-body text-text-muted mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container-page py-8">
        {isEmpty ? (
          // Empty Cart
          <div className="max-w-2xl mx-auto text-center py-20">
            <Card className="bg-white border-border p-12">
              <EmptyState
                illustration="custom"
                icon={<svg className="w-10 h-10 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2zm-12 4a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" /></svg>}
                title="Your cart is empty"
                description="Looks like you haven't added any cakes yet."
                action={{
                  label: 'Continue Shopping',
                  onClick: () => {}, // Will be handled by Link
                  variant: 'primary',
                }}
              />
              <Link to="/catalog">
                <Button size="lg" rightIcon={<ArrowLeft className="w-5 h-5" />}>
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-heading-lg font-medium text-charcoal-900">
                      Cart Items ({itemCount})
                    </h2>
                    {itemCount > 1 && (
                      <Button variant="ghost" size="sm" onClick={clearCart} className="text-error">
                        <Trash2 className="w-4 h-4 mr-1" /> Clear Cart
                      </Button>
                    )}
                  </div>

                  <div className="divide-y divide-border">
                    {isLoading ? (
                      [...Array(3)].map((_, i) => (
                        <div key={i} className="p-6 animate-pulse flex gap-4">
                          <div className="w-24 h-24 rounded-lg bg-charcoal-100 flex-shrink-0" />
                          <div className="flex-1 space-y-3">
                            <div className="h-5 bg-charcoal-100 rounded w-3/4" />
                            <div className="h-4 bg-charcoal-100 rounded w-1/2" />
                            <div className="h-6 bg-charcoal-100 rounded w-1/4" />
                          </div>
                        </div>
                      ))
                    ) : items.map(item => (
                      <CartItem
                        key={item.cartItemId}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                </Card>

                {/* Promo Code */}
                <Card className="mt-6 p-6">
                  <h3 className="text-heading-md font-medium text-charcoal-900 mb-4">Promo Code</h3>
                  {promoApplied ? (
                    <Alert variant="success" className="text-body-sm" dismissible onDismiss={handlePromoRemove}>
                      <div className="flex items-center justify-between">
                        <span>Promo code applied: <strong>{promoCode.toUpperCase()}</strong> - 10% off!</span>
                        <Button variant="ghost" size="icon" onClick={handlePromoRemove} aria-label="Remove promo code">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Alert>
                  ) : (
                    <form onSubmit={handlePromoApply} className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                        className="flex-1"
                        aria-label="Promo code"
                      />
                      <Button type="submit">Apply</Button>
                      {promoError && <Alert variant="error" className="w-full mt-2 text-body-sm">{promoError}</Alert>}
                    </form>
                  )}
                </Card>

                {/* Continue Shopping */}
                <div className="mt-6 text-center">
                  <Link to="/catalog">
                    <Button variant="ghost" leftIcon={<ArrowLeft className="w-5 h-5" />}>
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 p-6 space-y-6">
                  <h2 className="text-heading-lg font-medium text-charcoal-900">Order Summary</h2>

                  <div className="space-y-3 text-body">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal ({itemCount} items)</span>
                      <span className="font-medium text-charcoal-900">{formatCurrency(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sage-600">
                        <span>Discount (SWEET10)</span>
                        <span className="font-medium">-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Estimated Tax (12%)</span>
                      <span className="font-medium text-charcoal-900">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Pickup Fee</span>
                      <span className="font-medium text-charcoal-900">Free</span>
                    </div>

                    <div className="pt-3 border-t border-border flex justify-between text-heading-sm font-semibold">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Alert variant="info" className="text-body-sm">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      <span>Pickup is free! Select your preferred date & time at checkout.</span>
                    </div>
                  </Alert>

                  <Button className="w-full" size="lg" onClick={() => console.log('Go to checkout')}>
                    Proceed to Checkout
                  </Button>

                  <p className="text-center text-caption text-text-muted">
                    Secure checkout • Easy returns • Quality guaranteed
                  </p>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Cart Item Component
// -----------------------------------------------------------------------------

function CartItem({ item, onUpdateQuantity, onRemove }: {
  item: any;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const isAvailable = item.product?.availabilityStatus === 'Available';

  return (
    <div className="p-6 flex gap-4" role="listitem">
      {/* Product Image */}
      <Link to={`/product/${item.productId}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-warm-50">
          <img
            src={item.product?.imageReference || '/placeholder-cake.svg'}
            alt={item.product?.productName}
            className="w-full h-full object-cover"
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="error" className="text-xs">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link to={`/product/${item.productId}`}>
            <h3 className="font-medium text-charcoal-900 truncate">{item.product?.productName}</h3>
          </Link>
          <p className="text-body-sm text-text-muted mt-1 truncate">{item.product?.category?.categoryName}</p>
          <p className="text-body font-semibold text-primary mt-2">{formatCurrency(item.product?.price || 0)}</p>
        </div>

        {/* Quantity & Remove */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <label className="label mb-0 text-body-sm">Qty:</label>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                disabled={item.quantity <= 1 || !isAvailable}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={item.quantity}
                onChange={e => {
                  const val = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                  onUpdateQuantity(item.cartItemId, val);
                }}
                className="w-16 text-center border-0 focus:ring-0 py-1.5"
                min={1}
                max={20}
                disabled={!isAvailable}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                disabled={!isAvailable}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.cartItemId)}
            className="text-error hover:bg-rose-50"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>

      {/* Line Total */}
      <div className="flex-shrink-0 w-32 text-right sm:hidden">
        <p className="font-semibold text-primary">{formatCurrency(item.subtotalCalculation)}</p>
      </div>
    </div>
  );
}