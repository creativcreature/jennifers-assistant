'use client';

import { Resource } from '@/lib/resources';
import { formatPhone } from '@/lib/utils';
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { CallButton, DirectionsButton } from '@/components/ui/Button';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
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

  return (
    <Card>
      <CardHeader
        title={resource.name}
        subtitle={typeLabel()}
        icon={<span className="text-xl">{typeIcon()}</span>}
      />

      <CardContent className="space-y-2">
        <p>{resource.description}</p>

        {resource.hours && (
          <p className="text-sm">
            <span className="font-semibold text-white">Hours:</span> {resource.hours}
          </p>
        )}

        {resource.address && (
          <p className="text-sm">
            <span className="font-semibold text-white">Address:</span> {resource.address}
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

          {resource.address && resource.address !== 'Multiple locations' && (
            <DirectionsButton address={resource.address} />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
