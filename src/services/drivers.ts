import { apiGet } from './api';
import type { Driver, PaginationParams } from '../types/api';

export const driverService = {
  getAll: (params?: PaginationParams & { status?: string; organization_id?: number }) =>
    apiGet<Driver[]>('/drivers/', params),

  getById: (id: number) =>
    apiGet<Driver>(`/drivers/${id}`),
};
