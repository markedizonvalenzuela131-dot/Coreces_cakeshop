// ============================================================================
// SweetCrumb Bakery - StatusUpdateModal Component
// ============================================================================

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { OrderStatusName } from '@/types';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentStatus: OrderStatusName;
  onUpdate: (status: OrderStatusName) => Promise<void>;
  title?: string;
}

const STATUS_OPTIONS: { value: OrderStatusName; label: string; description: string; color: string }[] = [
  { value: 'Pending', label: 'Pending', description: 'Order received, awaiting confirmation', color: 'bg-amber-100 text-amber-800' },
  { value: 'Confirmed', label: 'Confirmed', description: 'Order confirmed, queued for preparation', color: 'bg-blue-100 text-blue-800' },
  { value: 'Preparing', label: 'Preparing', description: 'Order is being prepared in the kitchen', color: 'bg-purple-100 text-purple-800' },
  { value: 'Ready for Pickup', label: 'Ready for Pickup', description: 'Order is ready for customer pickup', color: 'bg-green-100 text-green-800' },
  { value: 'Completed', label: 'Completed', description: 'Order has been picked up by customer', color: 'bg-gray-100 text-gray-800' },
  { value: 'Cancelled', label: 'Cancelled', description: 'Order was cancelled', color: 'bg-red-100 text-red-800' },
];

const STATUS_ICONS: Record<OrderStatusName, React.ComponentType<{ className?: string }>> = {
  Pending: AlertCircle,
  Confirmed: CheckCircle,
  Preparing: AlertCircle,
  'Ready for Pickup': CheckCircle,
  Completed: CheckCircle,
  Cancelled: XCircle,
};

export function StatusUpdateModal({
  isOpen,
  onClose,
  orderId,
  currentStatus,
  onUpdate,
  title = 'Update Order Status',
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusName>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onUpdate(selectedStatus);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidTransition = (from: OrderStatusName, to: OrderStatusName): boolean => {
    // Define valid status transitions
    const transitions: Record<OrderStatusName, OrderStatusName[]> = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Preparing', 'Cancelled'],
      Preparing: ['Ready for Pickup', 'Cancelled'],
      'Ready for Pickup': ['Completed', 'Cancelled'],
      Completed: [],
      Cancelled: [],
    };
    return transitions[from]?.includes(to) ?? false;
  };

  const validStatuses = STATUS_OPTIONS.filter(s =>
    s.value === currentStatus || isValidTransition(currentStatus, s.value)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      <div className="space-y-4">
        {/* Current Status */}
        <div className="p-4 bg-warm-50 rounded-xl">
          <p className="text-caption text-text-muted uppercase tracking-wider mb-1">Current Status</p>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              currentStatus === 'Cancelled' ? 'bg-red-100 text-red-600' :
              currentStatus === 'Completed' ? 'bg-charcoal-100 text-charcoal-600' :
              'bg-primary-light text-primary'
            )}>
              {(() => {
                const Icon = STATUS_ICONS[currentStatus];
                return <Icon className="w-5 h-5" />;
              })()}
            </div>
            <span className="font-medium text-charcoal-900 capitalize">{currentStatus}</span>
          </div>
        </div>

        {/* New Status Selection */}
        <div>
          <label className="label">New Status</label>
          <div className="space-y-2">
            {validStatuses.map((status) => {
              const isSelected = selectedStatus === status.value;
              const isDisabled = status.value === currentStatus;
              const Icon = STATUS_ICONS[status.value];
              return (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => !isDisabled && setSelectedStatus(status.value)}
                  disabled={isDisabled}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary-50'
                      : 'border-border hover:border-primary/50 hover:bg-warm-50',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', status.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-charcoal-900">{status.label}</p>
                      <p className="text-body-sm text-text-muted">{status.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-body-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isLoading || selectedStatus === currentStatus}
            loading={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}