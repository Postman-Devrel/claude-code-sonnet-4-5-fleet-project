import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { deliveryService } from '../services/deliveries';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function DeliveryDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: delivery, isLoading, error, refetch } = useQuery({
    queryKey: ['delivery', id],
    queryFn: () => deliveryService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" message="Loading delivery details..." />;
  }

  if (error || !delivery) {
    return (
      <ErrorMessage
        message="Failed to load delivery details."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/deliveries" className="text-blue-600 hover:text-blue-900 text-sm">
          ← Back to Deliveries
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Delivery #{delivery.tracking_number}
            </h1>
            <p className="mt-2 text-gray-600">Customer: {delivery.customer_name}</p>
          </div>
          <StatusBadge status={delivery.status || 'unknown'} type="delivery" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card title="Customer Information">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.customer_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.customer_email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.customer_phone}</dd>
            </div>
          </dl>
        </Card>

        {/* Delivery Details */}
        <Card title="Delivery Details">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Tracking Number</dt>
              <dd className="mt-1 text-sm font-mono text-gray-900">{delivery.tracking_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1">
                <span className={`text-sm font-medium ${
                  delivery.priority === 'urgent' ? 'text-red-600' :
                  delivery.priority === 'express' ? 'text-orange-600' :
                  'text-gray-600'
                }`}>
                  {delivery.priority?.toUpperCase()}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Signature Required</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {delivery.signature_required ? 'Yes' : 'No'}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Package Information */}
        <Card title="Package Information">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Package Count</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.package_count} packages</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Weight</dt>
              <dd className="mt-1 text-sm text-gray-900">{delivery.weight_kg} kg</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Route ID</dt>
              <dd className="mt-1 text-sm text-gray-900">#{delivery.route_id}</dd>
            </div>
          </dl>
        </Card>

        {/* Timeline */}
        <Card title="Delivery Timeline">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Scheduled Delivery</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(delivery.scheduled_delivery), 'PPpp')}
              </dd>
            </div>
            {delivery.actual_delivery && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Actual Delivery</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(delivery.actual_delivery), 'PPpp')}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {format(new Date(delivery.created_at), 'PPpp')}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Delivery Notes */}
        {delivery.delivery_notes && (
          <Card title="Delivery Notes" className="lg:col-span-2">
            <p className="text-sm text-gray-700">{delivery.delivery_notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
