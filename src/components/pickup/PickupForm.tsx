// ============================================================================
// SweetCrumb Bakery - PickupForm Component
// ============================================================================

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { PickupScheduleRecord, TimeSlot } from '@/data/mockData.types';

const pickupSchema = z.object({
  preferredDate: z.string().min(1, 'Date is required'),
  preferredTime: z.string().min(1, 'Time slot is required'),
  availabilityFlag: z.string().transform(val => val === 'true').default('true'),
  maxOrders: z.number().int().min(1, 'Maximum orders must be at least 1').max(50, 'Maximum orders cannot exceed 50'),
  notes: z.string().max(200, 'Notes must be less than 200 characters').optional(),
});

export type PickupFormData = z.infer<typeof pickupSchema>;

interface PickupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PickupFormData) => Promise<void>;
  initialData?: Partial<PickupScheduleRecord> | null;
  timeSlots: TimeSlot[];
  title?: string;
  submitLabel?: string;
  loading?: boolean;
}

export function PickupForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  timeSlots,
  title = 'Add Pickup Slot',
  submitLabel = 'Save Slot',
  loading = false,
}: PickupFormProps) {
  const isEditing = Boolean(initialData?.pickupScheduleId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PickupFormData>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      preferredDate: initialData?.preferredDate || '',
      preferredTime: initialData?.preferredTime || '',
      availabilityFlag: initialData?.availabilityFlag ?? true,
      maxOrders: initialData?.maxOrders || 5,
      notes: initialData?.notes || '',
    },
    mode: 'onChange',
  });

  const onFormSubmit = async (data: PickupFormData) => {
    await onSubmit(data);
  };

  React.useEffect(() => {
    if (isOpen) {
      reset({
        preferredDate: initialData?.preferredDate || '',
        preferredTime: initialData?.preferredTime || '',
        availabilityFlag: initialData?.availabilityFlag ?? true,
        maxOrders: initialData?.maxOrders || 5,
        notes: initialData?.notes || '',
      });
    }
  }, [isOpen, initialData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Pickup Slot' : title}
      size="md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="preferredDate" className="label">
            Date <span className="text-red-500">*</span>
          </label>
          <Input
            id="preferredDate"
            type="date"
            {...register('preferredDate')}
            min={new Date().toISOString().split('T')[0]}
            error={errors.preferredDate?.message}
          />
        </div>

        <div>
          <label htmlFor="preferredTime" className="label">
            Time Slot <span className="text-red-500">*</span>
          </label>
          <Select
            id="preferredTime"
            options={timeSlots.map(s => ({ value: s.value, label: s.label }))}
            {...register('preferredTime')}
            placeholder="Select time slot"
            error={errors.preferredTime?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxOrders" className="label">Max Orders</label>
            <Input
              id="maxOrders"
              type="number"
              min="1"
              max="50"
              {...register('maxOrders', { valueAsNumber: true })}
              error={errors.maxOrders?.message}
            />
          </div>

          <div>
            <label className="label">Availability</label>
            <Select
              options={[
                { value: 'true', label: 'Available' },
                { value: 'false', label: 'Unavailable' },
              ]}
              {...register('availabilityFlag')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="label">Notes (Optional)</label>
          <Input
            id="notes"
            {...register('notes')}
            placeholder="Additional notes for this slot..."
            error={errors.notes?.message}
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

// Bulk create form for admin
const bulkPickupSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  timeSlots: z.array(z.string()).min(1, 'Select at least one time slot'),
  maxOrders: z.number().int().min(1).max(50).default(5),
  availabilityFlag: z.string().transform(val => val === 'true').default('true'),
  notes: z.string().max(200).optional(),
});

export type BulkPickupFormData = z.infer<typeof bulkPickupSchema>;

interface BulkPickupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BulkPickupFormData) => Promise<void>;
  timeSlots: TimeSlot[];
  loading?: boolean;
}

export function BulkPickupForm({
  isOpen,
  onClose,
  onSubmit,
  timeSlots,
  loading = false,
}: BulkPickupFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BulkPickupFormData>({
    resolver: zodResolver(bulkPickupSchema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timeSlots: [],
      maxOrders: 5,
      availabilityFlag: true,
      notes: '',
    },
    mode: 'onChange',
  });

  const selectedTimeSlots = watch('timeSlots');

  const onFormSubmit = async (data: BulkPickupFormData) => {
    await onSubmit(data);
  };

  React.useEffect(() => {
    if (isOpen) {
      reset({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        timeSlots: [],
        maxOrders: 5,
        availabilityFlag: true,
        notes: '',
      });
    }
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Create Pickup Slots"
      size="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="p-4 bg-warm-50 rounded-xl border border-border">
          <h4 className="font-medium text-charcoal-900 mb-3">Create Multiple Slots</h4>
          <p className="text-body-sm text-text-muted">
            Generate pickup slots for a date range with selected time slots.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="label">
              Start Date <span className="text-red-500">*</span>
            </label>
            <Input
              id="startDate"
              type="date"
              {...register('startDate')}
              min={new Date().toISOString().split('T')[0]}
              error={errors.startDate?.message}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="label">
              End Date <span className="text-red-500">*</span>
            </label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate')}
              min={watch('startDate') || new Date().toISOString().split('T')[0]}
              error={errors.endDate?.message}
            />
          </div>
        </div>

        <div>
          <label className="label">
            Time Slots <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <label
                key={slot.value}
                className={cn(
                  'px-3 py-2 rounded-lg border text-body-sm cursor-pointer transition-all',
                  selectedTimeSlots.includes(slot.value)
                    ? 'border-primary bg-primary-50 text-primary'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <input
                  type="checkbox"
                  value={slot.value}
                  {...register('timeSlots')}
                  className="sr-only"
                />
                {slot.label}
              </label>
            ))}
          </div>
          {errors.timeSlots && (
            <p className="text-red-500 text-body-sm mt-1">{errors.timeSlots.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxOrders" className="label">Max Orders per Slot</label>
            <Input
              id="maxOrders"
              type="number"
              min="1"
              max="50"
              {...register('maxOrders', { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="label">Default Availability</label>
            <Select
              options={[
                { value: 'true', label: 'Available' },
                { value: 'false', label: 'Unavailable' },
              ]}
              {...register('availabilityFlag')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="label">Notes (Optional)</label>
          <Input
            id="notes"
            {...register('notes')}
            placeholder="Notes applied to all created slots..."
          />
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-body-sm text-amber-800">
            <strong>Preview:</strong> This will create {calculateSlotCount(
              watch('startDate'),
              watch('endDate'),
              selectedTimeSlots.length
            )} pickup slots.
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={loading} disabled={selectedTimeSlots.length === 0}>
            Create Slots
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function calculateSlotCount(startDate: string, endDate: string, timeSlotCount: number): number {
  if (!startDate || !endDate || timeSlotCount === 0) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return days * timeSlotCount;
}