// ============================================================================
// SweetCrumb Bakery - Order Detail Page (Refactored)
// ============================================================================

import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, Mail, Download, Printer, Share2, AlertCircle, CalendarDays } from 'lucide-react';
import { Button, Badge, Card, StatusBadge } from '@/components/ui';
import { Breadcrumb } from '@/components/ui';
import { formatCurrency, formatDate, formatTime, cn, downloadFile, toCalendarDate, escapeCalendarText } from '@/lib/utils';
import { clsx } from 'clsx';
import { getStoredOrder } from '@/utils/orderStore';
import { toast } from 'sonner';

// -----------------------------------------------------------------------------
// Order Detail Page
// -----------------------------------------------------------------------------

const statusSteps = [
  { name: 'Pending', label: 'Order Placed', icon: '📝' },
  { name: 'Confirmed', label: 'Confirmed', icon: '✅' },
  { name: 'Preparing', label: 'Preparing', icon: '🍰' },
  { name: 'Ready for Pickup', label: 'Ready', icon: '📦' },
  { name: 'Completed', label: 'Completed', icon: '🎉' },
];

export function OrderDetail() {
  const { id } = useParams();

  const storedOrder = id ? getStoredOrder(id) : undefined;
  const order = storedOrder
    ? {
        ...storedOrder,
        remarks: storedOrder.remarks,
        pickupSchedule: storedOrder.pickupSchedule,
      }
    : null;

  if (!order) {
    return (
      <div className="container-page py-16">
        <Card>
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 mx-auto text-primary mb-3" />
            <h1 className="text-heading-lg font-medium text-charcoal-900 mb-2">Order not found</h1>
            <p className="text-body text-text-muted mb-6">We could not find order {id || ''}.</p>
            <Link to="/orders"><Button>Back to My Orders</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.name === order.statusName);
  const subtotal = order.items.reduce((sum, item) => sum + item.lineTotal, 0);
  const tax = order.totalAmount - subtotal;

  const downloadReceipt = () => {
    const receipt = [
      'SweetCrumb Bakery - Order Receipt',
      `Order: ${order.orderId}`,
      `Date: ${formatDate(order.orderDate)}`,
      `Customer: ${order.customer.firstName} ${order.customer.lastName}`,
      '',
      ...order.items.map(item => `${item.quantity} x ${item.productName} - ${formatCurrency(item.lineTotal)}`),
      '',
      `Subtotal: ${formatCurrency(subtotal)}`,
      `Tax: ${formatCurrency(tax)}`,
      `Total: ${formatCurrency(order.totalAmount)}`,
      `Pickup: ${formatDate(order.pickupSchedule.preferredDate)} at ${formatTime(order.pickupSchedule.preferredTime)}`,
    ].join('\n');
    downloadFile(`${order.orderId}-receipt.txt`, receipt, 'text/plain;charset=utf-8');
  };

  const downloadCalendarEvent = () => {
    try {
      const [startTime, endTime] = order.pickupSchedule.preferredTime.split('-');
      const start = toCalendarDate(order.pickupSchedule.preferredDate, startTime);
      const end = toCalendarDate(order.pickupSchedule.preferredDate, endTime || startTime);
      const event = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SweetCrumb Bakery//Pickup//EN',
        'BEGIN:VEVENT',
        `UID:${order.orderId}@sweetcrumb`,
        `DTSTAMP:${toCalendarDate(new Date().toISOString().slice(0, 10), '00:00')}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${escapeCalendarText(`SweetCrumb pickup - ${order.orderId}`)}`,
        `DESCRIPTION:${escapeCalendarText(`Pick up order ${order.orderId} from SweetCrumb Bakery.`)}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');
      downloadFile(`${order.orderId}-pickup.ics`, event, 'text/calendar;charset=utf-8');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create the calendar event');
    }
  };

  const shareOrder = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `SweetCrumb order ${order.orderId}`,
          text: `Order status: ${order.statusName}`,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Order link copied to clipboard');
      } else {
        toast.error('Sharing is not supported by this browser');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Could not share this order');
      }
    }
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container-page py-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'My Orders', href: '/orders' },
              { label: `Order ${order.orderId.slice(-8)}`, current: true },
            ]}
          />
        </div>
      </div>

      <div className="container-page py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <Link to="/orders" className="btn btn-ghost btn-sm mb-3">
              <ChevronLeft className="w-4 h-4" />
              Back to Orders
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-display-md font-display font-medium text-charcoal-900">
                Order {order.orderId.slice(-8)}
              </h1>
              <StatusBadge status={order.statusName} size="lg" />
            </div>
            <p className="text-body text-text-muted mt-1">Placed on {formatDate(order.orderDate)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={downloadReceipt}>
              Download Receipt
            </Button>
            <Button variant="outline" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
              Print
            </Button>
            <Button variant="ghost" leftIcon={<Share2 className="w-4 h-4" />} onClick={shareOrder}>
              Share
            </Button>
          </div>
        </div>

        {/* Status Timeline */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-heading-lg font-medium text-charcoal-900 mb-6">Order Progress</h2>
            {order.statusName === 'Cancelled' ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-body text-rose-800">
                This order was cancelled. Contact the bakery if you need help.
              </div>
            ) : (
              <ol className="relative space-y-6">
                {statusSteps.map((step, index) => {
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <li key={step.name} className="relative flex gap-4">
                      {index < statusSteps.length - 1 && (
                        <span className={cn(
                          'absolute left-4 top-9 h-[calc(100%+1.5rem)] w-0.5',
                          index < currentStepIndex ? 'bg-primary' : 'bg-charcoal-100'
                        )} aria-hidden="true" />
                      )}
                      <span className={cn(
                        'relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm',
                        isCompleted || isCurrent ? 'bg-primary text-white' : 'bg-charcoal-100 text-charcoal-400',
                        isCurrent && 'ring-4 ring-primary/20'
                      )}>
                        {isCompleted ? '✓' : step.icon}
                      </span>
                      <span className="min-w-0 pt-1">
                        <span className={cn('block font-medium', isCompleted || isCurrent ? 'text-charcoal-900' : 'text-text-muted')}>
                          {step.label}
                          {isCurrent && <span className="ml-2 text-caption text-primary">Current</span>}
                        </span>
                        <span className="block text-caption text-text-muted">{step.name}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-heading-lg font-medium text-charcoal-900">Order Items</h2>
                <span className="text-body-sm text-text-muted">{order.items.length} item(s)</span>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item, index) => (
                  <Link key={index} to={`/product/${item.productId}`} className="p-6 flex gap-4 hover:bg-warm-50/50 transition-colors">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-warm-50 flex-shrink-0">
                      <img
                        src={item.imageReference || '/placeholder-cake.svg'}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={event => { event.currentTarget.src = '/placeholder-cake.svg'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal-900 truncate">{item.productName}</p>
                      <p className="text-body-sm text-text-muted">Qty: {item.quantity} × {formatCurrency(item.unitPriceAtOrder)}</p>
                    </div>
                    <p className="font-semibold text-primary">{formatCurrency(item.lineTotal)}</p>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Remarks */}
            {order.remarks && (
              <Card>
                <div className="p-6">
                  <h3 className="text-heading-md font-medium text-charcoal-900 mb-2">Special Instructions</h3>
                  <p className="text-body text-text-secondary">{order.remarks}</p>
                </div>
              </Card>
            )}

            {/* Status History */}
            <Card>
              <div className="p-6 border-b border-border">
                <h2 className="text-heading-lg font-medium text-charcoal-900">Status History</h2>
              </div>
              <div className="divide-y divide-border">
                {[...order.statusHistory].reverse().map((history, index) => (
                  <div key={`${history.status}-${history.date}`} className="p-6 flex gap-4">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-body-sm font-medium flex-shrink-0',
                      index === 0 ? 'bg-primary text-white' : 'bg-charcoal-100 text-charcoal-400'
                    )}>
                      {index === 0 ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={history.status} size="sm" />
                        <span className="text-caption text-text-muted">{formatDate(history.date)}</span>
                      </div>
                      <p className="text-body text-text-secondary mt-1">{history.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <div className="p-6 border-b border-border">
                <h2 className="text-heading-lg font-medium text-charcoal-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium text-charcoal-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary">Tax (12%)</span>
                  <span className="font-medium text-charcoal-900">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary text-sage-600">Pickup Fee</span>
                  <span className="font-medium text-sage-600">Free</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between text-heading-sm font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </Card>

            {/* Pickup Info */}
            <Card>
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-heading-lg font-medium text-charcoal-900">Pickup Details</h2>
                <Badge variant="primary">Free</Badge>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-caption text-text-muted uppercase tracking-wider">Date & Time</p>
                    <p className="font-medium text-charcoal-900">{formatDate(order.pickupSchedule.preferredDate)} at {formatTime(order.pickupSchedule.preferredTime)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-caption text-text-muted uppercase tracking-wider">Location</p>
                    <p className="text-body text-text-secondary">SweetCrumb Bakery, 123 Baker Street, Manila</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full" leftIcon={<CalendarDays className="w-4 h-4" />} onClick={downloadCalendarEvent}>
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Contact Support */}
            <Card>
              <div className="p-6">
                <h3 className="text-heading-md font-medium text-charcoal-900 mb-4">Need Help?</h3>
                <p className="text-body-sm text-text-muted mb-4">Questions about your order?</p>
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

            {/* Reorder */}
            <Card className="bg-primary-light border-primary/50">
              <div className="p-6 text-center">
                <h3 className="text-heading-md font-medium text-charcoal-900 mb-2">Order Again?</h3>
                <p className="text-body-sm text-text-muted mb-4">Browse the catalog to order these cakes again.</p>
                <Link to="/catalog">
                  <Button className="w-full" rightIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
                    Browse Cakes
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}