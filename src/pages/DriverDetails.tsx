import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { driverService } from '../services/drivers';
import { routeService } from '../services/routes';
import { analyticsService } from '../services/analytics';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function DriverDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: driver, isLoading, error, refetch } = useQuery({
    queryKey: ['driver', id],
    queryFn: () => driverService.getById(Number(id)),
    enabled: !!id,
  });

  const { data: routes } = useQuery({
    queryKey: ['routes', 'driver', id],
    queryFn: () => routeService.getAll({ driver_id: Number(id), limit: 10 }),
    enabled: !!id,
  });

  const { data: incidents } = useQuery({
    queryKey: ['incidents', 'driver', id],
    queryFn: () => analyticsService.incidents.getAll({ driver_id: Number(id), limit: 10 }),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading driver details..." />;
  }

  if (error || !driver) {
    return (
      <ErrorMessage
        message="Failed to load driver details."
        onRetry={() => refetch()}
      />
    );
  }

  const unresolvedIncidents = incidents?.filter(i => !i.resolved).length || 0;
  const totalIncidentCost = incidents?.reduce((sum, i) => sum + (i.cost || 0), 0) || 0;

  return (
    <div>
      <div className="mb-6">
        <Link to="/drivers" className="text-blue-600 hover:text-blue-900 text-sm">
          ← Back to Drivers
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {driver.first_name} {driver.last_name}
            </h1>
            <p className="mt-2 text-gray-600">{driver.email}</p>
          </div>
          <StatusBadge status={driver.status || 'unknown'} type="vehicle" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Rating</p>
          <p className="text-2xl font-bold text-gray-900">{driver.rating?.toFixed(1) || 'N/A'} ⭐</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Routes</p>
          <p className="text-2xl font-bold text-gray-900">{routes?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Incidents</p>
          <p className="text-2xl font-bold text-red-600">{unresolvedIncidents} unresolved</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Incident Cost</p>
          <p className="text-2xl font-bold text-orange-600">${totalIncidentCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Driver Information */}
        <Card title="Driver Information">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{driver.first_name} {driver.last_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{driver.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{driver.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">License Number</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900">{driver.license_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">License Expiry</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(driver.license_expiry), 'MMMM d, yyyy')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(driver.hire_date), 'MMMM d, yyyy')}
              </dd>
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

      {/* Incidents */}
      {incidents && incidents.length > 0 && (
        <Card title="Incident History" className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {format(new Date(incident.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{incident.incident_type}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`font-medium ${
                        incident.severity === 'high' ? 'text-red-600' :
                        incident.severity === 'medium' ? 'text-orange-600' :
                        'text-yellow-600'
                      }`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{incident.location}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {incident.cost ? `$${incident.cost.toLocaleString()}` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        incident.resolved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {incident.resolved ? 'Resolved' : 'Open'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
