interface StatusBadgeProps {
  status: string;
  type?: 'vehicle' | 'delivery' | 'route';
}

export default function StatusBadge({ status, type = 'delivery' }: StatusBadgeProps) {
  const getColorClasses = () => {
    const normalizedStatus = status.toLowerCase();

    if (type === 'vehicle') {
      switch (normalizedStatus) {
        case 'active':
          return 'bg-green-100 text-green-800';
        case 'idle':
          return 'bg-yellow-100 text-yellow-800';
        case 'maintenance':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }

    if (type === 'delivery') {
      switch (normalizedStatus) {
        case 'delivered':
          return 'bg-green-100 text-green-800';
        case 'in-transit':
        case 'in_transit':
          return 'bg-blue-100 text-blue-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'failed':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }

    if (type === 'route') {
      switch (normalizedStatus) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'in-progress':
        case 'in_progress':
          return 'bg-blue-100 text-blue-800';
        case 'scheduled':
          return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }

    return 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, '-')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses()}`}>
      {formatStatus(status)}
    </span>
  );
}
