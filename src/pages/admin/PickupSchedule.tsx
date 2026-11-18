// ============================================================================
// SweetCrumb Bakery - Admin Pickup Schedule Page (Refactored)
// ============================================================================

import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Input, Textarea, Select, Badge, Modal, ConfirmModal, Card, Table } from '@/components/ui';
import { FormField, FormSwitch, FormActions, FormLayout, FormSection } from '@/components/forms/FormField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clsx } from 'clsx';
import { formatDate, formatTime, cn } from '@/lib/utils';
import { usePickupSchedules } from '@/hooks';
import type { PickupScheduleRecord } from '@/data/mockData.types';
import { PickupCalendar, PickupList, PickupForm, BulkPickupForm } from '@/components/pickup';
import { EmptyState } from '@/components/common';

// -----------------------------------------------------------------------------
// Validation Schema
// -----------------------------------------------------------------------------

const pickupSchema = z.object({
  preferredDate: z.string().min(1, 'Date is required'),
  preferredTime: z.string().min(1, 'Time slot is required'),
  availabilityFlag: z.boolean(),
  notes: z.string().max(500, 'Notes too long').optional(),
  maxOrders: z.number().min(1, 'Max orders must be at least 1').max(50, 'Max orders too high'),
});

type PickupFormData = z.infer<typeof pickupSchema>;

// -----------------------------------------------------------------------------
// Pickup Schedule Page
// -----------------------------------------------------------------------------

export function PickupSchedule() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [showBulkCreate, setShowBulkCreate] = useState(false);

  const {
    filteredSchedules,
    timeSlots,
    totalCount,
    filters,
    setFilters,
    getAvailableSlots,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    bulkCreateSchedules,
  } = usePickupSchedules();

  const form = useForm<PickupFormData>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '10:00-11:00',
      availabilityFlag: true,
      notes: '',
      maxOrders: 5,
    },
  });

  const onSubmit = async (data: PickupFormData) => {
    try {
      if (selectedSlot?.pickupScheduleId) {
        await updateSchedule(selectedSlot.pickupScheduleId, data);
      } else {
        await createSchedule({
          ...data,
          notes: data.notes ?? '',
          currentOrders: 0,
        });
      }
      setSelectedSlot(null);
      form.reset();
    } catch (error) {
      console.error('Failed to save pickup slot:', error);
    }
  };

  const onBulkSubmit = async (data: any) => {
    try {
      await bulkCreateSchedules(data);
      setShowBulkCreate(false);
    } catch (error) {
      console.error('Failed to bulk create slots:', error);
    }
  };

  const handleDelete = (slot: any) => {
    setDeleteConfirm(slot);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteSchedule(deleteConfirm.pickupScheduleId);
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Failed to delete slot:', error);
      }
    }
  };

  // Calendar view data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const weeks: Array<Array<{ day: number; date: Date; currentMonth: boolean; slots: PickupScheduleRecord[] }>> = [];
    let week: Array<{ day: number; date: Date; currentMonth: boolean; slots: PickupScheduleRecord[] }> = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      week.push({ day, date, currentMonth: false, slots: [] });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const daySlots = filteredSchedules.filter(s => s.preferredDate === dateStr);
      week.push({ day, date, currentMonth: true, slots: daySlots });

      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // Next month days
    let nextMonthDay = 1;
    while (week.length < 7) {
      const date = new Date(year, month + 1, nextMonthDay);
      week.push({ day: nextMonthDay, date, currentMonth: false, slots: [] });
      nextMonthDay++;
    }
    if (week.length > 0) weeks.push(week);

    return weeks;
  }, [currentDate, filteredSchedules]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display font-medium text-charcoal-900">Pickup Schedule</h1>
          <p className="text-body text-text-muted mt-1">Manage available pickup time slots</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowBulkCreate(true)}>
            <Plus className="w-4 h-4 mr-1" /> Bulk Create
          </Button>
          <Button onClick={() => { setSelectedSlot({}); form.reset({ preferredDate: new Date().toISOString().split('T')[0], preferredTime: '10:00-11:00', availabilityFlag: true, notes: '', maxOrders: 5 }); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Time Slot
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 border border-border rounded-lg p-1">
        <button
          onClick={() => setViewMode('calendar')}
          className={cn('px-4 py-2 rounded transition-colors', viewMode === 'calendar' ? 'bg-primary text-white' : 'text-text-muted hover:bg-warm-50')}
        >
          <Calendar className="w-5 h-5 mr-1" /> Calendar
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={cn('px-4 py-2 rounded transition-colors', viewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted hover:bg-warm-50')}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> List
        </button>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <PickupCalendar
          schedules={filteredSchedules}
          timeSlots={timeSlots}
          selectedDate={filters.date}
          onSelectDate={(date) => setFilters({ date })}
          onSelectSlot={(slot) => { setSelectedSlot(slot); form.reset(slot); }}
          minDate={new Date().toISOString().split('T')[0]}
        />
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Input
              type="search"
              placeholder="Search by date, time, or status..."
              className="max-w-md"
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <PickupList
            schedules={filteredSchedules}
            onSelectSlot={(slot) => { setSelectedSlot(slot); form.reset(slot); }}
            onToggleAvailability={async (slot) => await updateSchedule(slot.pickupScheduleId, { availabilityFlag: !slot.availabilityFlag })}
            view="admin"
          />
        </Card>
      )}

      {/* Add/Edit Modal */}
      <PickupForm
        isOpen={!!selectedSlot}
        onClose={() => { setSelectedSlot(null); form.reset({ preferredDate: new Date().toISOString().split('T')[0], preferredTime: '10:00-11:00', availabilityFlag: true, notes: '', maxOrders: 5 }); }}
        onSubmit={onSubmit}
        initialData={selectedSlot}
        timeSlots={timeSlots}
        title={selectedSlot?.pickupScheduleId ? 'Edit Time Slot' : 'Add Time Slot'}
        submitLabel={selectedSlot?.pickupScheduleId ? 'Save Changes' : 'Create Time Slot'}
      />

      {/* Bulk Create Modal */}
      <BulkPickupForm
        isOpen={showBulkCreate}
        onClose={() => { setShowBulkCreate(false); }}
        onSubmit={onBulkSubmit}
        timeSlots={timeSlots}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Time Slot"
        message={`Are you sure you want to delete the slot on ${formatDate(deleteConfirm?.preferredDate)} at ${formatTime(deleteConfirm?.preferredTime)}? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}