import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { locationService } from '../services/locations';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import FilterSelect from '../components/FilterSelect';

export default function Locations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: locations, isLoading, error, refetch } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getAll({ limit: 100 }),
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading locations..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load locations. Please check your API connection."
        onRetry={() => refetch()}
      />
    );
  }

  const filteredLocations = locations?.filter(location => {
    const matchesSearch = searchTerm === '' ||
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || location.type === typeFilter;

    return matchesSearch && matchesType;
  }) || [];

  const locationTypes = Array.from(new Set(locations?.map(l => l.type) || []));
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...locationTypes.map(type => ({ value: type, label: type })),
  ];

  const stats = {
    total: locations?.length || 0,
    warehouses: locations?.filter(l => l.type === 'warehouse').length || 0,
    depots: locations?.filter(l => l.type === 'depot').length || 0,
    customers: locations?.filter(l => l.type === 'customer').length || 0,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
        <p className="mt-2 text-gray-600">Manage warehouses, depots, and customer locations</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Locations</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Warehouses</p>
          <p className="text-2xl font-bold text-blue-600">{stats.warehouses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Depots</p>
          <p className="text-2xl font-bold text-green-600">{stats.depots}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Customers</p>
          <p className="text-2xl font-bold text-purple-600">{stats.customers}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name, city, or address..."
          />
          <FilterSelect
            label="Location Type"
            value={typeFilter}
            onChange={setTypeFilter}
            options={typeOptions}
          />
        </div>
      </Card>

      {/* Locations Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordinates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-500">ID: {location.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        location.type === 'warehouse' ? 'bg-blue-100 text-blue-800' :
                        location.type === 'depot' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {location.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{location.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-mono text-gray-600">
                        {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/locations/${location.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No locations found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredLocations.length} of {stats.total} locations
        </div>
      </Card>
    </div>
  );
}
