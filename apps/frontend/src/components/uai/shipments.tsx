import { component, schema } from '@uai/client';
import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from '../../utils/api';
import type { Shipment } from '@uai/shared';
import { Map as ShipmentsMap, Marker } from '../map';

export const shipments = component({
  description: 'Show shipments',
  inputSchema: schema.object({
    displayType: schema.enum(['map', 'list']).default('map'),
    filter: schema
      .enum(['inTransit', 'delayed', 'delivered'])
      .default('inTransit'),
  }),
  component: function Shipments({
    displayType: _displayType,
    filter,
  }: {
    displayType: 'map' | 'list';
    filter: 'inTransit' | 'delayed' | 'delivered';
  }) {
    const {
      data: shipments,
      error,
      isLoading: isShipmentsLoading,
    } = useSWR<Shipment[]>(`/api/shipments?state=${filter}`, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    });

    const markers = useMemo<Marker[]>(() => {
      if (!shipments) return [];

      return shipments.map((shipment) => {
        const isDelivered = shipment.state.includes('delivered');
        const isDelayed = shipment.state.includes('delayed');

        const borderColor = isDelivered
          ? 'border-green-500'
          : isDelayed
            ? 'border-red-500'
            : 'border-accent';

        const bgColor = isDelivered
          ? 'bg-green-500'
          : isDelayed
            ? 'bg-red-500'
            : 'bg-accent';

        const position = shipment.actualPosition || shipment.origin.position;

        const popup = (
          <div className="text-xs space-y-1 max-w-[220px] text-primary-foreground relative pr-8">
            <div className="font-semibold text-sm mb-1">
              Shipment {shipment.id}
            </div>
            <div>
              <span className="font-medium">State:</span>{' '}
              {shipment.state.join(', ')}
            </div>
            <div>
              <span className="font-medium">From:</span> {shipment.origin.city},{' '}
              {shipment.origin.country}
            </div>
            <div>
              <span className="font-medium">To:</span>{' '}
              {shipment.destination.city}, {shipment.destination.country}
            </div>
            <div>
              <span className="font-medium">ETA:</span>{' '}
              {formatEta(shipment.estimatedDeliveryDate)}
            </div>
          </div>
        );

        return {
          position,
          bgColor,
          borderColor,
          popup,
        };
      });
    }, [shipments]);

    const hasError = error !== undefined;

    return (
      <div className="relative">
        {hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-muted/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-medium text-destructive">
                Failed to load shipments
              </span>
            </div>
          </div>
        )}

        <ShipmentsMap
          initial={{ position: [16.37, 48.21], zoom: 9 }} // Vienna, Austria
          markers={markers}
          loading={isShipmentsLoading ? 'Loading shipments…' : undefined}
        />
      </div>
    );
  },
});

// Utils
const formatEta = (isoString: string) => {
  if (!isoString) return 'N/A';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
};
