// API Types based on OpenAPI specification

export interface Organization {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface Vehicle {
  id: number;
  organization_id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vehicle_type: string;
  capacity_kg: number;
  current_mileage: number;
  status: string | null;
  created_at: string;
}

export interface Driver {
  id: number;
  organization_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  license_expiry: string;
  hire_date: string;
  status: string | null;
  rating: number | null;
  created_at: string;
}

export interface Location {
  id: number;
  organization_id: number;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface Route {
  id: number;
  vehicle_id: number;
  driver_id: number;
  origin_location_id: number;
  destination_location_id: number;
  scheduled_departure: string;
  scheduled_arrival: string;
  distance_km: number;
  status: string | null;
  actual_departure: string | null;
  actual_arrival: string | null;
  created_at: string;
}

export interface Delivery {
  id: number;
  route_id: number;
  location_id: number;
  tracking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  package_count: number;
  weight_kg: number;
  scheduled_delivery: string;
  status: string | null;
  priority: string | null;
  signature_required: boolean | null;
  actual_delivery: string | null;
  delivery_notes: string | null;
  created_at: string;
}

export interface MaintenanceRecord {
  id: number;
  vehicle_id: number;
  maintenance_type: string;
  description: string;
  cost: number;
  mileage_at_service: number;
  service_date: string;
  service_provider: string;
  downtime_hours: number;
  next_service_date: string | null;
  created_at: string;
}

export interface FuelLog {
  id: number;
  vehicle_id: number;
  date: string;
  location: string;
  liters: number;
  cost_per_liter: number;
  total_cost: number;
  mileage: number;
  fuel_type: string | null;
  created_at: string;
}

export interface Incident {
  id: number;
  driver_id: number;
  incident_type: string;
  severity: string;
  description: string;
  date: string;
  location: string;
  resolved: boolean | null;
  cost: number | null;
  resolution_notes: string | null;
  created_at: string;
}

export interface GPSTracking {
  id: number;
  vehicle_id: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed_kmh: number;
  heading: number;
  altitude: number | null;
}

// Common query parameters
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface VehicleQueryParams extends PaginationParams {
  status?: string;
  vehicle_type?: string;
  organization_id?: number;
}

export interface DeliveryQueryParams extends PaginationParams {
  status?: string;
  priority?: string;
  route_id?: number;
  tracking_number?: string;
}

export interface RouteQueryParams extends PaginationParams {
  status?: string;
  vehicle_id?: number;
  driver_id?: number;
}

// Status enums for type safety
export type VehicleStatus = 'active' | 'idle' | 'maintenance';
export type DeliveryStatus = 'pending' | 'in-transit' | 'delivered' | 'failed';
export type RouteStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export type DeliveryPriority = 'standard' | 'express' | 'urgent';
