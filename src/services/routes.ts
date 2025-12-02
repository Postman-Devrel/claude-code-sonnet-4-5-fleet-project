import { apiGet } from './api';
import type { Route, RouteQueryParams } from '../types/api';

export const routeService = {
  getAll: (params?: RouteQueryParams) =>
    apiGet<Route[]>('/routes/', params),

  getById: (id: number) =>
    apiGet<Route>(`/routes/${id}`),
};
