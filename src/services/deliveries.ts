import { apiGet } from './api';
import type { Delivery, DeliveryQueryParams } from '../types/api';

export const deliveryService = {
  getAll: (params?: DeliveryQueryParams) =>
    apiGet<Delivery[]>('/deliveries/', params),

  getById: (id: number) =>
    apiGet<Delivery>(`/deliveries/${id}`),

  getByTracking: (trackingNumber: string) =>
    apiGet<Delivery>(`/deliveries/tracking/${trackingNumber}`),
};
