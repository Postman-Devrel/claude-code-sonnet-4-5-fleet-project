import { useQuery } from '@tanstack/react-query';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { deliveryService } from '../services/deliveries';
import { vehicleService } from '../services/vehicles';
import { analyticsService } from '../services/analytics';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Analytics() {
  const { data: deliveries, isLoading: deliveriesLoading, error, refetch } = useQuery({
    queryKey: ['deliveries'],
    queryFn: () => deliveryService.getAll({ limit: 1000 }),
  });

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehicleService.getAll({ limit: 100 }),
  });

  const { data: fuelLogs, isLoading: fuelLoading } = useQuery({
    queryKey: ['fuel'],
    queryFn: () => analyticsService.fuel.getAll({ limit: 500 }),
  });

  const { data: maintenanceRecords, isLoading: maintenanceLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => analyticsService.maintenance.getAll({ limit: 500 }),
  });

  if (deliveriesLoading || vehiclesLoading || fuelLoading || maintenanceLoading) {
    return <LoadingSpinner size="lg" message="Loading analytics..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load analytics data. Please check your API connection."
        onRetry={() => refetch()}
      />
    );
  }

  // Delivery Status Distribution
  const deliveryStatusData = [
    { name: 'Delivered', value: deliveries?.filter(d => d.status === 'delivered').length || 0, color: '#10b981' },
    { name: 'In Transit', value: deliveries?.filter(d => d.status === 'in-transit').length || 0, color: '#3b82f6' },
    { name: 'Pending', value: deliveries?.filter(d => d.status === 'pending').length || 0, color: '#f59e0b' },
    { name: 'Failed', value: deliveries?.filter(d => d.status === 'failed').length || 0, color: '#ef4444' },
  ];

  // Vehicle Status Distribution
  const vehicleStatusData = [
    { name: 'Active', value: vehicles?.filter(v => v.status === 'active').length || 0, color: '#10b981' },
    { name: 'Idle', value: vehicles?.filter(v => v.status === 'idle').length || 0, color: '#f59e0b' },
    { name: 'Maintenance', value: vehicles?.filter(v => v.status === 'maintenance').length || 0, color: '#ef4444' },
  ];

  // Monthly Delivery Performance (last 6 months)
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  const monthlyDeliveryData = last6Months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthDeliveries = deliveries?.filter(d => {
      const deliveryDate = new Date(d.scheduled_delivery);
      return deliveryDate >= monthStart && deliveryDate <= monthEnd;
    }) || [];

    return {
      month: format(month, 'MMM yyyy'),
      total: monthDeliveries.length,
      delivered: monthDeliveries.filter(d => d.status === 'delivered').length,
      failed: monthDeliveries.filter(d => d.status === 'failed').length,
    };
  });

  // Monthly Fuel Costs
  const monthlyFuelData = last6Months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthFuel = fuelLogs?.filter(f => {
      const fuelDate = new Date(f.date);
      return fuelDate >= monthStart && fuelDate <= monthEnd;
    }) || [];

    const totalCost = monthFuel.reduce((sum, f) => sum + f.total_cost, 0);

    return {
      month: format(month, 'MMM yyyy'),
      cost: Math.round(totalCost),
    };
  });

  // Monthly Maintenance Costs
  const monthlyMaintenanceData = last6Months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthMaintenance = maintenanceRecords?.filter(m => {
      const serviceDate = new Date(m.service_date);
      return serviceDate >= monthStart && serviceDate <= monthEnd;
    }) || [];

    const totalCost = monthMaintenance.reduce((sum, m) => sum + m.cost, 0);

    return {
      month: format(month, 'MMM yyyy'),
      cost: Math.round(totalCost),
    };
  });

  // Key Metrics
  const totalDeliveries = deliveries?.length || 0;
  const successRate = totalDeliveries > 0
    ? ((deliveries?.filter(d => d.status === 'delivered').length || 0) / totalDeliveries * 100).toFixed(1)
    : 0;

  const totalFuelCost = fuelLogs?.reduce((sum, f) => sum + f.total_cost, 0) || 0;
  const totalMaintenanceCost = maintenanceRecords?.reduce((sum, m) => sum + m.cost, 0) || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="mt-2 text-gray-600">Performance insights and historical data analysis</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Deliveries</p>
          <p className="text-2xl font-bold text-gray-900">{totalDeliveries.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-2xl font-bold text-green-600">{successRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Fuel Cost</p>
          <p className="text-2xl font-bold text-blue-600">${totalFuelCost.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Maintenance Cost</p>
          <p className="text-2xl font-bold text-orange-600">${totalMaintenanceCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Delivery Status Distribution */}
        <Card title="Delivery Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deliveryStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deliveryStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Vehicle Status Distribution */}
        <Card title="Fleet Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {vehicleStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Monthly Delivery Performance */}
      <Card title="Delivery Performance (Last 6 Months)" className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyDeliveryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8b5cf6" name="Total Deliveries" strokeWidth={2} />
            <Line type="monotone" dataKey="delivered" stroke="#10b981" name="Delivered" strokeWidth={2} />
            <Line type="monotone" dataKey="failed" stroke="#ef4444" name="Failed" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Operational Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Costs */}
        <Card title="Monthly Fuel Costs">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyFuelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cost" fill="#3b82f6" name="Fuel Cost ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Maintenance Costs */}
        <Card title="Monthly Maintenance Costs">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyMaintenanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cost" fill="#f59e0b" name="Maintenance Cost ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
