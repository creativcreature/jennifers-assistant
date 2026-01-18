'use client';

import { Resource } from '@/lib/resources';
import { formatPhone } from '@/lib/utils';
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { CallButton } from '@/components/ui/Button';

interface ResourceCardProps {
  resource: Resource & { distance?: number };
  userLocation?: { latitude: number; longitude: number } | null;
}

export default function ResourceCard({ resource, userLocation }: ResourceCardProps) {
  const typeIcon = () => {
    switch (resource.type) {
      case 'food':
        return '🍎';
      case 'healthcare':
        return '🏥';
      case 'shelter':
        return '🏠';
      case 'services':
        return '📋';
      case 'transportation':
        return '🚌';
      default:
        return '📍';
    }
  };

  const typeLabel = () => {
    switch (resource.type) {
      case 'food':
        return 'Food';
      case 'healthcare':
        return 'Healthcare';
      case 'shelter':
        return 'Shelter';
      case 'services':
        return 'Services';
      case 'transportation':
        return 'Transportation';
      default:
        return 'Resource';
    }
  };

  // Build directions URL - use user's current location if available
  const getDirectionsUrl = () => {
    const destination = encodeURIComponent(resource.address || '');
    if (userLocation) {
      return `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${destination}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  // Format distance
  const formatDistance = (miles: number) => {
    if (miles < 0.1) return 'Very close';
    if (miles < 1) return `${(miles * 5280 / 100).toFixed(0)}00 ft`;
    return `${miles.toFixed(1)} mi`;
  };

  return (
    <Card>
      <CardHeader
        title={resource.name}
        subtitle={
          resource.distance !== undefined
            ? `${typeLabel()} • ${formatDistance(resource.distance)} away`
            : typeLabel()
        }
        icon={<span className="text-xl">{typeIcon()}</span>}
        badge={
          resource.distance !== undefined ? (
            <span className="badge-info">{formatDistance(resource.distance)}</span>
          ) : undefined
        }
      />

      <CardContent className="space-y-2">
        <p>{resource.description}</p>

        {resource.hours && (
          <p className="text-sm">
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Hours:</span> {resource.hours}
          </p>
        )}

        {resource.address && (
          <p className="text-sm">
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Address:</span> {resource.address}
          </p>
        )}

        {resource.notes && (
          <p className="text-sm text-warning">
            <span className="font-semibold">Note:</span> {resource.notes}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex flex-col gap-3">
          {resource.phone && (
            <CallButton
              phone={resource.phone}
              label={`Call ${formatPhone(resource.phone)}`}
            />
          )}

          {resource.address && (
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Get Directions
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
