import { apiGet } from './api';
import type { Location, PaginationParams } from '../types/api';

export const locationService = {
  getAll: (params?: PaginationParams & { type?: string; city?: string; state?: string; organization_id?: number }) =>
    apiGet<Location[]>('/locations/', params),

  getById: (id: number) =>
    apiGet<Location>(`/locations/${id}`),
};
