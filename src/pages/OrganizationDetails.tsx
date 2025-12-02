import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { organizationService } from '../services/organizations';
import { vehicleService } from '../services/vehicles';
import { driverService } from '../services/drivers';
import { locationService } from '../services/locations';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function OrganizationDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: organization, isLoading, error, refetch } = useQuery({
    queryKey: ['organization', id],
    queryFn: () => organizationService.getById(Number(id)),
    enabled: !!id,
  });

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles', 'organization', id],
    queryFn: () => vehicleService.getAll({ organization_id: Number(id), limit: 100 }),
    enabled: !!id,
  });

  const { data: drivers } = useQuery({
    queryKey: ['drivers', 'organization', id],
    queryFn: () => driverService.getAll({ organization_id: Number(id), limit: 100 }),
    enabled: !!id,
  });

  const { data: locations } = useQuery({
    queryKey: ['locations', 'organization', id],
    queryFn: () => locationService.getAll({ organization_id: Number(id), limit: 100 }),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading organization details..." />;
  }

  if (error || !organization) {
    return (
      <ErrorMessage
        message="Failed to load organization details."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/organizations" className="text-blue-600 hover:text-blue-900 text-sm">
          ← Back to Organizations
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
        <p className="mt-2 text-gray-600">Organization ID: {organization.id}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Vehicles</p>
          <p className="text-2xl font-bold text-gray-900">{vehicles?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Drivers</p>
          <p className="text-2xl font-bold text-gray-900">{drivers?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Locations</p>
          <p className="text-2xl font-bold text-gray-900">{locations?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Organization Information */}
        <Card title="Organization Information">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{organization.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{organization.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{organization.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{organization.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(organization.created_at), 'PPpp')}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Quick Links */}
        <Card title="Quick Links">
          <div className="space-y-3">
            <Link
              to={`/trucks?organization_id=${id}`}
              className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="font-medium text-blue-900">View All Vehicles</div>
              <div className="text-sm text-blue-700">{vehicles?.length || 0} vehicles</div>
            </Link>
            <Link
              to={`/drivers?organization_id=${id}`}
              className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="font-medium text-green-900">View All Drivers</div>
              <div className="text-sm text-green-700">{drivers?.length || 0} drivers</div>
            </Link>
            <Link
              to={`/locations?organization_id=${id}`}
              className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="font-medium text-purple-900">View All Locations</div>
              <div className="text-sm text-purple-700">{locations?.length || 0} locations</div>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Vehicles */}
      {vehicles && vehicles.length > 0 && (
        <Card title="Recent Vehicles" className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Plate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.slice(0, 5).map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {vehicle.make} {vehicle.model}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{vehicle.vehicle_type}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{vehicle.license_plate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{vehicle.status}</td>
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
