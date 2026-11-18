// ============================================================================
// SweetCrumb Bakery - PickupCalendar Component
// ============================================================================

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { cn, formatDate, formatTime } from '@/lib/utils';
import type { PickupScheduleRecord, TimeSlot } from '@/data/mockData.types';

interface PickupCalendarProps {
  schedules: PickupScheduleRecord[];
  timeSlots: TimeSlot[];
  selectedDate?: string;
  onSelectDate: (date: string) => void;
  onSelectSlot?: (schedule: PickupScheduleRecord) => void;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

export function PickupCalendar({
  schedules,
  timeSlots,
  selectedDate,
  onSelectDate,
  onSelectSlot,
  minDate,
  maxDate,
  className,
}: PickupCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const min = minDate ? new Date(minDate) : today;
  const max = maxDate ? new Date(maxDate) : null;

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: (Date | null)[] = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Next month days to fill the grid
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }, [currentMonth]);

  const getSchedulesForDate = (date: Date): PickupScheduleRecord[] => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter(s => s.preferredDate === dateStr);
  };

  const isDateSelectable = (date: Date): boolean => {
    if (date < min) return false;
    if (max && date > max) return false;
    const schedulesForDate = getSchedulesForDate(date);
    return schedulesForDate.some(s => s.availabilityFlag && s.currentOrders < s.maxOrders);
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const isToday = (date: Date): boolean => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const handleDateClick = (date: Date) => {
    if (!isDateSelectable(date)) return;
    const dateStr = date.toISOString().split('T')[0];
    onSelectDate(dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className={cn('bg-white rounded-2xl border border-border p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth} aria-label="Previous month">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-heading-md font-semibold text-charcoal-900">{monthName}</h3>
        <Button variant="ghost" size="icon" onClick={handleNextMonth} aria-label="Next month">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-caption font-medium text-text-muted py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date, index) => {
          if (!date) return <div key={index} />;

          const schedulesForDate = getSchedulesForDate(date);
          const availableSlots = schedulesForDate.filter(s => s.availabilityFlag && s.currentOrders < s.maxOrders);
          const totalSlots = schedulesForDate.length;
          const selectable = isDateSelectable(date);
          const selected = isSelected(date);
          const currentMonthDay = isCurrentMonth(date);
          const todayFlag = isToday(date);

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={!selectable}
              className={cn(
                'relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all',
                'text-body-sm font-medium',
                !currentMonthDay && 'text-charcoal-300',
                currentMonthDay && selectable && 'text-charcoal-900 hover:bg-warm-100',
                currentMonthDay && !selectable && 'text-charcoal-400 cursor-not-allowed',
                selected && 'bg-primary text-white',
                todayFlag && !selected && 'ring-2 ring-primary',
                todayFlag && selected && 'ring-2 ring-white'
              )}
              aria-label={date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              aria-selected={selected}
              aria-disabled={!selectable}
            >
              <span>{date.getDate()}</span>
              {selectable && currentMonthDay && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {availableSlots.slice(0, 3).map((slot, i) => (
                    <span
                      key={i}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        selected ? 'bg-white' : 'bg-green-400'
                      )}
                    />
                  ))}
                  {availableSlots.length > 3 && (
                    <span className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      selected ? 'bg-white/50' : 'bg-green-400/50'
                    )} />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date slots */}
      {selectedDate && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium text-charcoal-900 mb-3">
            Available Slots for {formatDate(selectedDate, { format: 'long' })}
          </h4>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => {
              const schedule = schedules.find(
                s => s.preferredDate === selectedDate && s.preferredTime === slot.value
              );
              const available = schedule?.availabilityFlag && (schedule.currentOrders < schedule.maxOrders);
              const full = schedule && schedule.currentOrders >= schedule.maxOrders;

              return (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() => schedule && onSelectSlot?.(schedule)}
                  disabled={!available}
                  className={cn(
                    'px-4 py-2 rounded-lg text-body-sm font-medium transition-all',
                    'border',
                    available
                      ? 'border-primary bg-primary-50 text-primary hover:bg-primary-100'
                      : full
                      ? 'border-amber-200 bg-amber-50 text-amber-600 cursor-not-allowed'
                      : 'border-charcoal-200 bg-charcoal-50 text-charcoal-400 cursor-not-allowed'
                  )}
                  aria-pressed={false}
                >
                  {formatTime(slot.value)}
                  {schedule && (
                    <span className={cn('ml-2 text-xs', available ? 'text-green-600' : 'text-amber-600')}>
                      ({schedule.currentOrders}/{schedule.maxOrders})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {timeSlots.every(slot => {
            const schedule = schedules.find(s => s.preferredDate === selectedDate && s.preferredTime === slot.value);
            return !schedule || !schedule.availabilityFlag || schedule.currentOrders >= schedule.maxOrders;
          }) && (
            <p className="text-body-sm text-text-muted mt-3 text-center">
              No available slots for this date
            </p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-body-sm text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span>Full</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-charcoal-200" />
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full ring-2 ring-primary" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}