import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { vehicleService } from '../services/vehicles';
import { deliveryService } from '../services/deliveries';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError, refetch: refetchVehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehicleService.getAll({ limit: 50 }),
  });

  const { data: deliveries, isLoading: deliveriesLoading } = useQuery({
    queryKey: ['deliveries'],
    queryFn: () => deliveryService.getAll({ limit: 100 }),
  });

  if (vehiclesLoading || deliveriesLoading) {
    return <LoadingSpinner size="lg" message="Loading dashboard..." />;
  }

  if (vehiclesError) {
    return (
      <ErrorMessage
        message="Failed to load fleet data. Please check your API connection."
        onRetry={() => refetchVehicles()}
      />
    );
  }

  const totalVehicles = vehicles?.length || 0;
  const activeVehicles = vehicles?.filter(v => v.status === 'active').length || 0;
  const maintenanceVehicles = vehicles?.filter(v => v.status === 'maintenance').length || 0;

  const totalDeliveries = deliveries?.length || 0;
  const inTransitDeliveries = deliveries?.filter(d => d.status === 'in-transit').length || 0;
  const deliveredToday = deliveries?.filter(d => {
    if (!d.actual_delivery) return false;
    const deliveryDate = new Date(d.actual_delivery);
    const today = new Date();
    return deliveryDate.toDateString() === today.toDateString();
  }).length || 0;

  const completionRate = totalDeliveries > 0
    ? ((deliveries?.filter(d => d.status === 'delivered').length || 0) / totalDeliveries * 100).toFixed(1)
    : '0';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Fleet Overview</h1>
        <p className="mt-2 text-gray-600">Monitor your fleet status and delivery operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Vehicles"
          value={totalVehicles}
          icon="🚛"
          subtitle={`${activeVehicles} active`}
        />
        <StatCard
          title="Active Deliveries"
          value={inTransitDeliveries}
          icon="📦"
          subtitle={`${deliveredToday} delivered today`}
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon="✅"
        />
        <StatCard
          title="In Maintenance"
          value={maintenanceVehicles}
          icon="🔧"
          subtitle={maintenanceVehicles > 0 ? 'Needs attention' : 'All operational'}
        />
      </div>

      {/* Recent Vehicles */}
      <Card title="Fleet Status">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License Plate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mileage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles && vehicles.length > 0 ? (
                vehicles.slice(0, 10).map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-sm text-gray-500">{vehicle.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.vehicle_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.license_plate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.current_mileage.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={vehicle.status || 'unknown'} type="vehicle" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/trucks/${vehicle.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No vehicles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {vehicles && vehicles.length > 10 && (
          <div className="mt-4 text-center">
            <Link
              to="/trucks"
              className="text-blue-600 hover:text-blue-900 font-medium"
            >
              View all vehicles →
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
