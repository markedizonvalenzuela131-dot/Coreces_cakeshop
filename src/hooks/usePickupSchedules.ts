// ============================================================================
// SweetCrumb Bakery - usePickupSchedules Hook
// ============================================================================

import { useState, useMemo, useCallback } from 'react';
import type { PickupScheduleRecord, TimeSlot } from '@/data/mockData.types';
import { MOCK_PICKUP_SCHEDULES, TIME_SLOTS, getAvailablePickupSlots, getPickupScheduleById } from '@/data/mockData';

export interface PickupScheduleFilters {
  date?: string;
  availableOnly?: boolean;
  view?: 'calendar' | 'list';
}

export interface UsePickupSchedulesResult {
  schedules: PickupScheduleRecord[];
  filteredSchedules: PickupScheduleRecord[];
  timeSlots: TimeSlot[];
  totalCount: number;
  filters: PickupScheduleFilters;
  setFilters: (filters: Partial<PickupScheduleFilters>) => void;
  getAvailableSlots: (date: string) => PickupScheduleRecord[];
  getScheduleById: (id: string) => PickupScheduleRecord | undefined;
  getSlotsForDateRange: (startDate: string, endDate: string) => PickupScheduleRecord[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
  // Admin CRUD
  createSchedule: (schedule: Omit<PickupScheduleRecord, 'pickupScheduleId' | 'createdAt' | 'updatedAt'>) => PickupScheduleRecord;
  updateSchedule: (id: string, updates: Partial<PickupScheduleRecord>) => void;
  deleteSchedule: (id: string) => void;
  bulkCreateSchedules: (schedules: Omit<PickupScheduleRecord, 'pickupScheduleId' | 'createdAt' | 'updatedAt'>[]) => PickupScheduleRecord[];
}

const DEFAULT_FILTERS: PickupScheduleFilters = {
  date: '',
  availableOnly: false,
  view: 'list',
};

export function usePickupSchedules(): UsePickupSchedulesResult {
  const [filters, setFiltersState] = useState<PickupScheduleFilters>(DEFAULT_FILTERS);
  const [schedules, setSchedules] = useState<PickupScheduleRecord[]>(MOCK_PICKUP_SCHEDULES);

  // Apply filters
  const filteredSchedules = useMemo(() => {
    let result = schedules.filter((schedule) => {
      const matchesDate = !filters.date || schedule.preferredDate === filters.date;
      const matchesAvailability = !filters.availableOnly || (schedule.availabilityFlag && schedule.currentOrders < schedule.maxOrders);
      return matchesDate && matchesAvailability;
    });

    // Sort by date then time
    result.sort((a, b) => {
      const dateCompare = a.preferredDate.localeCompare(b.preferredDate);
      if (dateCompare !== 0) return dateCompare;
      return a.preferredTime.localeCompare(b.preferredTime);
    });

    return result;
  }, [schedules, filters]);

  const totalCount = filteredSchedules.length;

  const setFilters = useCallback((newFilters: Partial<PickupScheduleFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters = Boolean(filters.date || filters.availableOnly);

  const getAvailableSlots = useCallback((date: string) => {
    return schedules.filter(
      (schedule) =>
        schedule.preferredDate === date &&
        schedule.availabilityFlag &&
        schedule.currentOrders < schedule.maxOrders
    );
  }, [schedules]);

  const getScheduleById = useCallback((id: string) => {
    return schedules.find((schedule) => schedule.pickupScheduleId === id);
  }, [schedules]);

  const getSlotsForDateRange = useCallback((startDate: string, endDate: string) => {
    return schedules.filter((s) => s.preferredDate >= startDate && s.preferredDate <= endDate);
  }, [schedules]);

  // Admin CRUD operations
  const createSchedule = useCallback(
    (scheduleData: Omit<PickupScheduleRecord, 'pickupScheduleId' | 'createdAt' | 'updatedAt'>): PickupScheduleRecord => {
      const newSchedule: PickupScheduleRecord = {
        ...scheduleData,
        pickupScheduleId: `ps-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSchedules((prev) => [...prev, newSchedule]);
      return newSchedule;
    },
    []
  );

  const updateSchedule = useCallback((id: string, updates: Partial<PickupScheduleRecord>) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.pickupScheduleId === id
          ? { ...schedule, ...updates, updatedAt: new Date().toISOString() }
          : schedule
      )
    );
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.pickupScheduleId !== id));
  }, []);

  const bulkCreateSchedules = useCallback(
    (schedulesData: Omit<PickupScheduleRecord, 'pickupScheduleId' | 'createdAt' | 'updatedAt'>[]): PickupScheduleRecord[] => {
      const newSchedules: PickupScheduleRecord[] = schedulesData.map((data) => ({
        ...data,
        pickupScheduleId: `ps-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setSchedules((prev) => [...prev, ...newSchedules]);
      return newSchedules;
    },
    []
  );

  return {
    schedules,
    filteredSchedules,
    timeSlots: TIME_SLOTS,
    totalCount,
    filters,
    setFilters,
    getAvailableSlots,
    getScheduleById,
    getSlotsForDateRange,
    clearFilters,
    hasActiveFilters,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    bulkCreateSchedules,
  };
}