import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { vehicleService } from '../services/vehicles';
import { analyticsService } from '../services/analytics';
import { routeService } from '../services/routes';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function TruckDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: vehicle, isLoading: vehicleLoading, error, refetch } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getById(Number(id)),
    enabled: !!id,
  });

  const { data: maintenance, isLoading: maintenanceLoading } = useQuery({
    queryKey: ['maintenance', id],
    queryFn: () => analyticsService.maintenance.getAll({ vehicle_id: Number(id), limit: 10 }),
    enabled: !!id,
  });

  const { data: fuelLogs, isLoading: fuelLoading } = useQuery({
    queryKey: ['fuel', id],
    queryFn: () => analyticsService.fuel.getAll({ vehicle_id: Number(id), limit: 10 }),
    enabled: !!id,
  });

  const { data: routes } = useQuery({
    queryKey: ['routes', id],
    queryFn: () => routeService.getAll({ vehicle_id: Number(id), limit: 10 }),
    enabled: !!id,
  });

  if (vehicleLoading) {
    return <LoadingSpinner size="lg" message="Loading vehicle details..." />;
  }

  if (error || !vehicle) {
    return (
      <ErrorMessage
        message="Failed to load vehicle details."
        onRetry={() => refetch()}
      />
    );
  }

  const totalMaintenanceCost = maintenance?.reduce((sum, m) => sum + m.cost, 0) || 0;
  const totalFuelCost = fuelLogs?.reduce((sum, f) => sum + f.total_cost, 0) || 0;

  return (
    <div>
      <div className="mb-6">
        <Link to="/trucks" className="text-blue-600 hover:text-blue-900 text-sm">
          ← Back to Fleet
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h1>
            <p className="mt-2 text-gray-600">{vehicle.license_plate}</p>
          </div>
          <StatusBadge status={vehicle.status || 'unknown'} type="vehicle" />
        </div>
      </div>

      {/* Vehicle Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Current Mileage</p>
          <p className="text-2xl font-bold text-gray-900">{vehicle.current_mileage.toLocaleString()} km</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Capacity</p>
          <p className="text-2xl font-bold text-gray-900">{vehicle.capacity_kg.toLocaleString()} kg</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Maintenance Cost</p>
          <p className="text-2xl font-bold text-gray-900">${totalMaintenanceCost.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Fuel Cost</p>
          <p className="text-2xl font-bold text-gray-900">${totalFuelCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Vehicle Information */}
        <Card title="Vehicle Information">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">VIN</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900">{vehicle.vin}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Make & Model</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.make} {vehicle.model}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Year</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.year}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Vehicle Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{vehicle.vehicle_type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">License Plate</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900">{vehicle.license_plate}</dd>
            </div>
          </dl>
        </Card>

        {/* Recent Routes */}
        <Card title="Recent Routes">
          {routes && routes.length > 0 ? (
            <div className="space-y-3">
              {routes.slice(0, 5).map((route) => (
                <div key={route.id} className="border-b border-gray-200 pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Route #{route.id}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(route.scheduled_departure), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <StatusBadge status={route.status || 'unknown'} type="route" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{route.distance_km} km</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent routes</p>
          )}
        </Card>
      </div>

      {/* Maintenance History */}
      <Card title="Maintenance History" className="mb-6">
        {maintenanceLoading ? (
          <LoadingSpinner size="sm" />
        ) : maintenance && maintenance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Downtime</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maintenance.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {format(new Date(record.service_date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{record.maintenance_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${record.cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.downtime_hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No maintenance records</p>
        )}
      </Card>

      {/* Fuel History */}
      <Card title="Fuel History">
        {fuelLoading ? (
          <LoadingSpinner size="sm" />
        ) : fuelLogs && fuelLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liters</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost/L</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mileage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fuelLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {format(new Date(log.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.location}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{log.liters.toFixed(1)}L</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${log.cost_per_liter.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">${log.total_cost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.mileage.toLocaleString()} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No fuel records</p>
        )}
      </Card>
    </div>
  );
}
