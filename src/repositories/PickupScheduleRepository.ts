// ============================================================================
// SweetCrumb Bakery - Pickup Schedule Repository Implementation
// ============================================================================

import { BaseRepository, DatabaseAdapter, InMemoryAdapter } from '@/database/adapters';
import type {
  PickupSchedule,
  PickupScheduleFormData,
} from '@/types';

export interface PickupScheduleRepository extends BaseRepository<PickupSchedule, PickupScheduleFormData, Partial<PickupScheduleFormData>> {
  findAvailableByDate(date: string): Promise<PickupSchedule[]>;
  findByDateRange(startDate: string, endDate: string): Promise<PickupSchedule[]>;
  getAvailableTimeSlots(date: string): Promise<PickupSchedule[]>;
  markSlotUnavailable(scheduleId: string): Promise<PickupSchedule>;
  markSlotAvailable(scheduleId: string): Promise<PickupSchedule>;
}

export class PickupScheduleRepositoryImpl extends BaseRepository<PickupSchedule, PickupScheduleFormData, Partial<PickupScheduleFormData>>
  implements PickupScheduleRepository {

  constructor(adapter: DatabaseAdapter) {
    super(adapter, 'pickup_schedules', 'pickupScheduleId');
  }

  async findAvailableByDate(date: string): Promise<PickupSchedule[]> {
    return this.findAll({
      where: {
        preferredDate: date,
        availabilityFlag: true,
      },
      orderBy: [{ field: 'preferredTime', direction: 'asc' }],
    });
  }

  async findByDateRange(startDate: string, endDate: string): Promise<PickupSchedule[]> {
    // Note: In a real database, this would use BETWEEN
    return this.findAll({
      where: {
        preferredDate: { gte: startDate, lte: endDate },
      } as Record<string, unknown>,
      orderBy: [
        { field: 'preferredDate', direction: 'asc' },
        { field: 'preferredTime', direction: 'asc' },
      ],
    });
  }

  async getAvailableTimeSlots(date: string): Promise<PickupSchedule[]> {
    return this.findAll({
      where: {
        preferredDate: date,
        availabilityFlag: true,
      },
      orderBy: [{ field: 'preferredTime', direction: 'asc' }],
    });
  }

  async markSlotUnavailable(scheduleId: string): Promise<PickupSchedule> {
    return this.update(scheduleId, { availabilityFlag: false } as Partial<PickupScheduleFormData>);
  }

  async markSlotAvailable(scheduleId: string): Promise<PickupSchedule> {
    return this.update(scheduleId, { availabilityFlag: true } as Partial<PickupScheduleFormData>);
  }
}

// In-memory implementation for development
export class InMemoryPickupScheduleRepository extends PickupScheduleRepositoryImpl {
  constructor() {
    super(new InMemoryAdapter());
  }
}

// Singleton instance for easy access
let pickupScheduleRepositoryInstance: PickupScheduleRepository | null = null;

export function getPickupScheduleRepository(): PickupScheduleRepository {
  if (!pickupScheduleRepositoryInstance) {
    pickupScheduleRepositoryInstance = new InMemoryPickupScheduleRepository();
  }
  return pickupScheduleRepositoryInstance;
}

export function setPickupScheduleRepository(repo: PickupScheduleRepository): void {
  pickupScheduleRepositoryInstance = repo;
}