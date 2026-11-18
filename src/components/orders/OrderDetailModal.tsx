// ============================================================================
// SweetCrumb Bakery - OrderDetailModal Component
// ============================================================================

import React from 'react';
import { Check, Package, Truck, Calendar, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Modal } from '@/components/ui';
import { formatCurrency, formatDate, getOrderStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { OrderRecord } from '@/data/mockData.types';
import { StatusBadge } from '@/components/ui';

interface OrderDetailModalProps {
  order: OrderRecord;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const STATUS_STEPS = [
  { name: 'Pending', key: 'Pending' as const, icon: Clock },
  { name: 'Confirmed', key: 'Confirmed' as const, icon: Check },
  { name: 'Preparing', key: 'Preparing' as const, icon: Package },
  { name: 'Ready for Pickup', key: 'Ready for Pickup' as const, icon: Truck },
  { name: 'Completed', key: 'Completed' as const, icon: Check },
] as const;

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Pending: Clock,
  Confirmed: Check,
  Preparing: Package,
  'Ready for Pickup': Truck,
  Completed: Check,
  Cancelled: XCircle,
};

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  title = 'Order Details',
  size = 'lg',
}: OrderDetailModalProps) {
  const formatTime = (timeStr: string) => {
    const formatSingleTime = (value: string) => {
      const [hours, minutes] = value.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return value;
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };
    if (timeStr.includes('-')) {
      const [start, end] = timeStr.split('-');
      return `${formatSingleTime(start)}-${formatSingleTime(end)}`;
    }
    return formatSingleTime(timeStr);
  };

  const getStatusIcon = (status: string) => {
    const Icon = STATUS_ICONS[status] || AlertCircle;
    return <Icon className="w-5 h-5" />;
  };

  const isStepCompleted = (stepKey: string) => {
    const currentIndex = STATUS_STEPS.findIndex(s => s.key === order.statusName);
    const stepIndex = STATUS_STEPS.findIndex(s => s.key === stepKey);
    if (order.statusName === 'Cancelled') return false;
    return stepIndex <= currentIndex;
  };

  const isStepCurrent = (stepKey: string) => {
    return order.statusName === stepKey && order.statusName !== 'Cancelled';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
    >
      <div className="space-y-6">
        {/* Status Timeline */}
        <div className="p-4 bg-warm-50 rounded-xl">
          <h4 className="font-medium text-charcoal-900 mb-4">Order Status</h4>
          <div className="space-y-4">
            {STATUS_STEPS.map((step, index) => {
              const completed = isStepCompleted(step.key);
              const current = isStepCurrent(step.key);
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-body-sm font-medium flex-shrink-0',
                    completed ? 'bg-primary text-white' : 'bg-charcoal-100 text-charcoal-400'
                  )}>
                    {completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className={cn('w-5 h-5', current && 'text-primary')} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn('font-medium', completed ? 'text-charcoal-900' : 'text-text-muted')}>
                      {step.name}
                    </p>
                  </div>
                  {current && (
                    <StatusBadge status={order.statusName} size="sm" />
                  )}
                </div>
              );
            })}
            {order.statusName === 'Cancelled' && (
              <div className="flex items-center gap-4 text-red-600">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-body-sm font-medium flex-shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-600">Cancelled</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="p-4 bg-warm-50 rounded-xl">
              <p className="text-caption text-text-muted uppercase tracking-wider">Order Number</p>
              <p className="font-mono text-body font-medium text-charcoal-900">{order.orderId}</p>
            </div>
            <div className="p-4 bg-warm-50 rounded-xl">
              <p className="text-caption text-text-muted uppercase tracking-wider">Order Date</p>
              <p className="font-medium text-charcoal-900">{formatDate(order.orderDate)}</p>
            </div>
            <div className="p-4 bg-warm-50 rounded-xl">
              <p className="text-caption text-text-muted uppercase tracking-wider">Status</p>
              <StatusBadge status={order.statusName} size="md" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-warm-50 rounded-xl">
              <p className="text-caption text-text-muted uppercase tracking-wider">Pickup Date</p>
              <p className="font-medium text-charcoal-900">
                {formatDate(order.pickupDate)} at {formatTime(order.pickupTime)}
              </p>
            </div>
            <div className="p-4 bg-warm-50 rounded-xl">
              <p className="text-caption text-text-muted uppercase tracking-wider">Items</p>
              <p className="font-medium text-charcoal-900">{order.itemCount} item(s)</p>
            </div>
            <div className="p-4 bg-warm-50 rounded-xl">
              <p className="text-caption text-text-muted uppercase tracking-wider">Total</p>
              <p className="text-heading-sm font-semibold text-primary">{formatCurrency(order.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Customer Info (if available) */}
        {order.customerName && (
          <div className="p-4 bg-warm-50 rounded-xl border border-border">
            <h4 className="font-medium text-charcoal-900 mb-3">Customer Information</h4>
            <div className="grid sm:grid-cols-2 gap-3 text-body-sm">
              <div>
                <p className="text-text-muted">Name</p>
                <p className="font-medium text-charcoal-900">{order.customerName}</p>
              </div>
              <div>
                <p className="text-text-muted">Email</p>
                <p className="font-medium text-charcoal-900">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-text-muted">Phone</p>
                <p className="font-medium text-charcoal-900">{order.customerPhone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="border-t border-border pt-4">
          <h4 className="font-medium text-charcoal-900 mb-3">Order Items</h4>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warm-50/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warm-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-warm-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10C10 8.9 10.9 8 12 8ZM12 14C13.1 14 14 14.9 14 16C14 17.1 13.1 18 12 18C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14ZM4 20V18C4 16.34 5.34 15 7 15H17C18.66 15 20 16.34 20 18V20H4Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-900 truncate max-w-[200px]">{item.productName}</p>
                    <p className="text-body-sm text-text-muted">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-primary">{formatCurrency(item.unitPriceAtOrder * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border flex justify-end">
            <p className="font-semibold text-heading-sm">Total: {formatCurrency(order.totalAmount)}</p>
          </div>
        </div>

        {/* Remarks */}
        {order.remarks && (
          <div className="p-4 bg-warm-50 rounded-xl border border-border">
            <p className="text-caption text-text-muted uppercase tracking-wider mb-1">Special Instructions</p>
            <p className="text-body text-charcoal-900">{order.remarks}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            type="button"
            className="btn btn-outline flex-1"
            onClick={onClose}
          >
            Close
          </button>
          <a href={`/orders/${order.orderId}`} className="btn btn-primary flex-1 text-center">
            View Full Details
          </a>
        </div>
      </div>
    </Modal>
  );
}