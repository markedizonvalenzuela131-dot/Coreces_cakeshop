// ============================================================================
// SweetCrumb Bakery - PickupList Component
// ============================================================================

import React, { useMemo } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Table, type Column } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { cn, formatDate, formatTime } from '@/lib/utils';
import type { PickupScheduleRecord } from '@/data/mockData.types';

export interface PickupListProps {
  schedules: PickupScheduleRecord[];
  onSelectSlot?: (schedule: PickupScheduleRecord) => void;
  onToggleAvailability?: (schedule: PickupScheduleRecord) => void;
  view?: 'customer' | 'admin';
  className?: string;
}

export function PickupList({
  schedules,
  onSelectSlot,
  onToggleAvailability,
  view = 'customer',
  className,
}: PickupListProps) {
  const groupedSchedules = useMemo(() => {
    const groups: Record<string, PickupScheduleRecord[]> = {};
    schedules.forEach((schedule) => {
      if (!groups[schedule.preferredDate]) {
        groups[schedule.preferredDate] = [];
      }
      groups[schedule.preferredDate].push(schedule);
    });
    return groups;
  }, [schedules]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedSchedules).sort();
  }, [groupedSchedules]);

  if (view === 'customer') {
    return (
      <div className={cn('space-y-4', className)}>
        {sortedDates.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-charcoal-200 mb-4" />
            <h3 className="text-heading-md font-medium text-charcoal-900 mb-2">No pickup slots available</h3>
            <p className="text-body text-text-muted">Please check back later for available pickup times.</p>
          </div>
        ) : (
          sortedDates.map((date) => {
            const daySchedules = groupedSchedules[date];
            const availableSlots = daySchedules.filter(s => s.availabilityFlag && s.currentOrders < s.maxOrders);

            return (
              <div key={date} className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-warm-50 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-warm-600" />
                    <div>
                      <p className="font-medium text-charcoal-900">{formatDate(date, { format: 'long' })}</p>
                      <p className="text-body-sm text-text-muted">
                        {availableSlots.length} of {daySchedules.length} slots available
                      </p>
                    </div>
                  </div>
                  {availableSlots.length > 0 && (
                    <Badge variant="success" size="sm">
                      {availableSlots.length} Available
                    </Badge>
                  )}
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {daySchedules.map((schedule) => {
                    const available = schedule.availabilityFlag && schedule.currentOrders < schedule.maxOrders;
                    const full = schedule.availabilityFlag && schedule.currentOrders >= schedule.maxOrders;

                    return (
                      <button
                        key={schedule.pickupScheduleId}
                        type="button"
                        onClick={() => available && onSelectSlot?.(schedule)}
                        disabled={!available}
                        className={cn(
                          'px-4 py-2 rounded-lg text-body-sm font-medium transition-all',
                          'border flex items-center gap-2',
                          available
                            ? 'border-primary bg-primary-50 text-primary hover:bg-primary-100'
                            : full
                            ? 'border-amber-200 bg-amber-50 text-amber-600 cursor-not-allowed'
                            : 'border-charcoal-200 bg-charcoal-50 text-charcoal-400 cursor-not-allowed'
                        )}
                      >
                        <Clock className={cn('w-4 h-4 flex-shrink-0', available ? 'text-primary' : 'text-charcoal-300')} />
                        <span>{formatTime(schedule.preferredTime)}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', available ? 'bg-green-100 text-green-700' : 'bg-charcoal-100 text-charcoal-500')}>
                          {available
                            ? `${schedule.currentOrders}/${schedule.maxOrders}`
                            : full
                            ? 'Full'
                            : 'Closed'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }

  // Admin view - Table
  const columns: Column<PickupScheduleRecord>[] = [
    {
      key: 'preferredDate',
      header: 'Date',
      width: '140px',
      accessor: (schedule) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-charcoal-400" />
          <span className="font-medium text-charcoal-900">{formatDate(schedule.preferredDate)}</span>
        </div>
      ),
    },
    {
      key: 'preferredTime',
      header: 'Time',
      width: '140px',
      accessor: (schedule) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-charcoal-400" />
          <span className="text-charcoal-900">{formatTime(schedule.preferredTime)}</span>
        </div>
      ),
    },
    {
      key: 'availability',
      header: 'Status',
      width: '120px',
      accessor: (schedule) => {
        const available = schedule.availabilityFlag && schedule.currentOrders < schedule.maxOrders;
        const full = schedule.availabilityFlag && schedule.currentOrders >= schedule.maxOrders;

        if (!schedule.availabilityFlag) {
          return (
            <Badge variant="error" size="sm">
              <XCircle className="w-3 h-3 mr-1" /> Unavailable
            </Badge>
          );
        }
        if (full) {
          return (
            <Badge variant="warning" size="sm">
              <AlertCircle className="w-3 h-3 mr-1" /> Full
            </Badge>
          );
        }
        return (
          <Badge variant="success" size="sm">
            <CheckCircle className="w-3 h-3 mr-1" /> Available
          </Badge>
        );
      },
    },
    {
      key: 'capacity',
      header: 'Capacity',
      width: '120px',
      align: 'center',
      accessor: (schedule) => (
        <div className="text-body-sm text-charcoal-900">
          {schedule.currentOrders} / {schedule.maxOrders}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '120px',
      align: 'center',
      accessor: (schedule) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleAvailability?.(schedule)}
            aria-label={schedule.availabilityFlag ? 'Mark unavailable' : 'Mark available'}
          >
            {schedule.availabilityFlag ? (
              <XCircle className="w-4 h-4 text-red-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={schedules}
      keyExtractor={s => s.pickupScheduleId}
      striped
      hoverable
      sortable
      emptyMessage="No pickup schedules found"
      className={className}
    />
  );
}