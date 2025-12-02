import { apiGet } from './api';
import type { Vehicle, VehicleQueryParams, GPSTracking } from '../types/api';

export const vehicleService = {
  getAll: (params?: VehicleQueryParams) =>
    apiGet<Vehicle[]>('/vehicles/', params),

  getById: (id: number) =>
    apiGet<Vehicle>(`/vehicles/${id}`),

  getLatestGPS: (vehicleId: number) =>
    apiGet<GPSTracking>(`/gps/vehicle/${vehicleId}/latest`),

  getGPSHistory: (vehicleId: number, params?: { skip?: number; limit?: number }) =>
    apiGet<GPSTracking[]>('/gps/', { ...params, vehicle_id: vehicleId }),
};
