// ============================================================================
// SweetCrumb Bakery - Order Success Page (Refactored)
// ============================================================================

import React, { useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Truck, Clock, MapPin, Phone, Mail, Download, Share2 } from 'lucide-react';
import { Button, Badge, Card, Alert, StatusBadge } from '@/components/ui';
import { formatCurrency, formatDate, formatTime, cn } from '@/lib/utils';
import { clsx } from 'clsx';
import { containerPage } from '@/styles';
import { getStoredOrder } from '@/utils/orderStore';

// -----------------------------------------------------------------------------
// Order Success Page
// -----------------------------------------------------------------------------

export function OrderSuccess() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const isNewOrder = searchParams.get('new') === 'true';

  const storedOrder = orderId ? getStoredOrder(orderId) : undefined;
  const order = storedOrder
    ? {
        ...storedOrder,
        pickupSchedule: storedOrder.pickupSchedule,
      }
    : null;

  useEffect(() => {
    // Track conversion event
    console.log('Order confirmed:', orderId);
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-warm-50">
        <div className="container-page py-16">
          <Card>
            <div className="p-8 text-center">
              <CheckCircle className="w-10 h-10 mx-auto text-primary mb-3" />
              <h1 className="text-heading-lg font-medium text-charcoal-900 mb-2">Order Confirmed!</h1>
              <p className="text-body text-text-muted mb-6">Your order has been placed successfully.</p>
              <Link to="/catalog"><Button>Continue Shopping</Button></Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="container-page py-12 lg:py-16">
        {/* Success Animation */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 rounded-full bg-sage-100 flex items-center justify-center mx-auto animate-pulse-soft">
              <CheckCircle className="w-12 h-12 text-sage-600" />
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-sage-200 animate-ping opacity-75" />
            <div className="absolute inset-0 rounded-full bg-sage-200 animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
          </div>

          <h1 className="text-display-lg font-display font-medium text-charcoal-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-body-lg text-text-secondary mb-2">
            Thank you for your order, {order.customer.firstName}!
          </p>
          <p className="text-body text-text-muted">
            Your order <strong className="text-charcoal-900">{order.orderId}</strong> has been received and is being processed.
          </p>

          {isNewOrder && (
            <Alert variant="success" className="mt-6 max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>A confirmation email has been sent to {order.customer.email}</span>
              </div>
            </Alert>
          )}
        </div>

        {/* Order Details Cards */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card>
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-heading-lg font-medium text-charcoal-900">Order Details</h2>
                <StatusBadge status={order.statusName} size="md" />
              </div>
              <div className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption text-text-muted uppercase tracking-wider">Order Number</p>
                    <p className="font-mono text-body font-medium text-charcoal-900">{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-caption text-text-muted uppercase tracking-wider">Order Date</p>
                    <p className="text-body font-medium text-charcoal-900">{formatDate(order.orderDate)}</p>
                  </div>
                  <div>
                    <p className="text-caption text-text-muted uppercase tracking-wider">Payment Status</p>
                    <p className="text-body font-medium text-sage-600">Paid</p>
                  </div>
                  <div>
                    <p className="text-caption text-text-muted uppercase tracking-wider">Items</p>
                    <p className="text-body font-medium text-charcoal-900">{order.items.length} item(s)</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pickup Info */}
            <Card>
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-heading-lg font-medium text-charcoal-900">Pickup Information</h2>
                <Badge variant="primary" size="md">Free Pickup</Badge>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-caption text-text-muted uppercase tracking-wider">Pickup Date & Time</p>
                      <p className="text-heading-sm font-medium text-charcoal-900">
                        {formatDate(order.pickupSchedule.preferredDate)} at {formatTime(order.pickupSchedule.preferredTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-caption text-text-muted uppercase tracking-wider">Location</p>
                      <p className="text-body text-text-secondary">SweetCrumb Bakery, 123 Baker Street, Manila</p>
                    </div>
                    <div>
                      <p className="text-caption text-text-muted uppercase tracking-wider">Notes</p>
                      <p className="text-body text-text-secondary">{order.pickupSchedule.notes}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-warm-50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-body-sm text-text-secondary">Please arrive within your 1-hour pickup window</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" /> Save to Calendar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Order Items */}
            <Card>
              <div className="p-6 border-b border-border">
                <h2 className="text-heading-lg font-medium text-charcoal-900">Order Items</h2>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item, index) => (
                  <div key={index} className="p-6 flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-warm-50 flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-warm-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM4 20V18C4 16.34 5.34 15 7 15H17C18.66 15 20 16.34 20 18V20H4Z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal-900 truncate">{item.productName}</p>
                      <p className="text-body-sm text-text-muted">Qty: {item.quantity} × {formatCurrency(item.unitPriceAtOrder)}</p>
                    </div>
                    <p className="font-semibold text-primary">{formatCurrency(item.lineTotal)}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Price Breakdown */}
            <Card className="bg-warm-50">
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium text-charcoal-900">{formatCurrency(order.items.reduce((a, b) => a + b.lineTotal, 0))}</span>
                </div>
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary">Tax (12%)</span>
                  <span className="font-medium text-charcoal-900">{formatCurrency(Math.round(order.items.reduce((a, b) => a + b.lineTotal, 0) * 0.12))}</span>
                </div>
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary text-sage-600">Pickup Fee</span>
                  <span className="font-medium text-sage-600">Free</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between text-heading-sm font-semibold">
                  <span>Total Paid</span>
                  <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Actions & Info */}
          <div className="space-y-6">
            {/* Share Order */}
            <Card>
              <div className="p-6">
                <h3 className="text-heading-md font-medium text-charcoal-900 mb-4">Share Your Order</h3>
                <p className="text-body-sm text-text-muted mb-4">Let others know about your SweetCrumb treat!</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => navigator.share?.({ title: 'My SweetCrumb Order', url: window.location.href })}>
                    <Share2 className="w-4 h-4 mr-1" /> Share
                  </Button>
                  <Button variant="ghost" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" /></svg>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Contact Support */}
            <Card>
              <div className="p-6">
                <h3 className="text-heading-md font-medium text-charcoal-900 mb-4">Need Help?</h3>
                <p className="text-body-sm text-text-muted mb-4">Our team is here to assist you.</p>
                <div className="space-y-3">
                  <a href="tel:+63281234567" className="flex items-center gap-3 text-body text-text-secondary hover:text-primary transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>Call: +63 2 8123 4567</span>
                  </a>
                  <a href="mailto:support@sweetcrumb.com" className="flex items-center gap-3 text-body text-text-secondary hover:text-primary transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>Email: support@sweetcrumb.com</span>
                  </a>
                </div>
              </div>
            </Card>

            {/* What's Next */}
            <Card>
              <div className="p-6">
                <h3 className="text-heading-md font-medium text-charcoal-900 mb-4">What Happens Next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-body-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">Order Confirmed</p>
                      <p className="text-body-sm text-text-muted">Your order is being prepared by our bakers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-warm-600 font-bold text-body-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">Preparing</p>
                      <p className="text-body-sm text-text-muted">Fresh baking and careful packaging</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-warm-600 font-bold text-body-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">Ready for Pickup</p>
                      <p className="text-body-sm text-text-muted">You'll receive a notification when ready</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-warm-600 font-bold text-body-sm">4</span>
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">Completed</p>
                      <p className="text-body-sm text-text-muted">Pick up and enjoy your delicious cake!</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Continue Shopping */}
            <div className="text-center">
              <Link to="/catalog">
                <Button variant="outline" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
              <p className="text-caption text-text-muted mt-3">Or <Link to="/orders" className="text-primary hover:underline">view your orders</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}