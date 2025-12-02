import { apiGet } from './api';
import type { MaintenanceRecord, FuelLog, Incident, PaginationParams } from '../types/api';

export const analyticsService = {
  maintenance: {
    getAll: (params?: PaginationParams & { vehicle_id?: number; maintenance_type?: string }) =>
      apiGet<MaintenanceRecord[]>('/maintenance/', params),

    getById: (id: number) =>
      apiGet<MaintenanceRecord>(`/maintenance/${id}`),
  },

  fuel: {
    getAll: (params?: PaginationParams & { vehicle_id?: number; fuel_type?: string }) =>
      apiGet<FuelLog[]>('/fuel/', params),

    getById: (id: number) =>
      apiGet<FuelLog>(`/fuel/${id}`),
  },

  incidents: {
    getAll: (params?: PaginationParams & { driver_id?: number; incident_type?: string; severity?: string; resolved?: boolean }) =>
      apiGet<Incident[]>('/incidents/', params),

    getById: (id: number) =>
      apiGet<Incident>(`/incidents/${id}`),
  },
};
