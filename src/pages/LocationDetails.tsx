import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { locationService } from '../services/locations';
import { routeService } from '../services/routes';
import { deliveryService } from '../services/deliveries';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function LocationDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: location, isLoading, error, refetch } = useQuery({
    queryKey: ['location', id],
    queryFn: () => locationService.getById(Number(id)),
    enabled: !!id,
  });

  const { data: deliveries } = useQuery({
    queryKey: ['deliveries', 'location', id],
    queryFn: () => deliveryService.getAll({ limit: 100 }),
    enabled: !!id,
    select: (data) => data.filter(d => d.location_id === Number(id)),
  });

  const { data: originRoutes } = useQuery({
    queryKey: ['routes', 'origin', id],
    queryFn: () => routeService.getAll({ limit: 100 }),
    enabled: !!id,
    select: (data) => data.filter(r => r.origin_location_id === Number(id)),
  });

  const { data: destinationRoutes } = useQuery({
    queryKey: ['routes', 'destination', id],
    queryFn: () => routeService.getAll({ limit: 100 }),
    enabled: !!id,
    select: (data) => data.filter(r => r.destination_location_id === Number(id)),
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading location details..." />;
  }

  if (error || !location) {
    return (
      <ErrorMessage
        message="Failed to load location details."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/locations" className="text-blue-600 hover:text-blue-900 text-sm">
          ← Back to Locations
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{location.name}</h1>
            <p className="mt-2 text-gray-600">{location.city}, {location.state}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            location.type === 'warehouse' ? 'bg-blue-100 text-blue-800' :
            location.type === 'depot' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {location.type}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Deliveries</p>
          <p className="text-2xl font-bold text-gray-900">{deliveries?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Origin Routes</p>
          <p className="text-2xl font-bold text-blue-600">{originRoutes?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Destination Routes</p>
          <p className="text-2xl font-bold text-green-600">{destinationRoutes?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Location Information */}
        <Card title="Location Information">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{location.type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">City, State</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.city}, {location.state}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.postal_code}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.country}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Coordinates</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(location.created_at), 'PPpp')}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Map Placeholder */}
        <Card title="Location Map">
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-2">📍 Map View</p>
              <p className="text-sm text-gray-500">
                Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-blue-600 hover:text-blue-900 text-sm"
              >
                View on Google Maps →
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Deliveries */}
      {deliveries && deliveries.length > 0 && (
        <Card title="Recent Deliveries" className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.slice(0, 10).map((delivery) => (
                  <tr key={delivery.id}>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{delivery.tracking_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{delivery.customer_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {format(new Date(delivery.scheduled_delivery), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{delivery.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Routes */}
      {originRoutes && originRoutes.length > 0 && (
        <Card title="Outbound Routes" className="mb-6">
          <div className="space-y-2">
            {originRoutes.slice(0, 5).map((route) => (
              <div key={route.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">Route #{route.id}</p>
                  <p className="text-xs text-gray-500">{route.distance_km} km</p>
                </div>
                <p className="text-xs text-gray-600">
                  {format(new Date(route.scheduled_departure), 'MMM d')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
