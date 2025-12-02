import { apiGet } from './api';
import type { Organization, PaginationParams } from '../types/api';

export const organizationService = {
  getAll: (params?: PaginationParams) =>
    apiGet<Organization[]>('/organizations/', params),

  getById: (id: number) =>
    apiGet<Organization>(`/organizations/${id}`),
};
