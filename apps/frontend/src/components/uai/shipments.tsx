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
    displayType,
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
          <div className="text-xs space-y-1 max-w-[220px] text-muted-foreground relative pr-8">
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

    if (displayType === 'map') {
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
    }

    const isListLoading = isShipmentsLoading && !shipments;

    return (
      <div className="relative">
        <div className="overflow-hidden rounded-lg border bg-card">
          {hasError ? (
            <div className="p-4 text-sm font-medium text-destructive">
              Failed to load shipments
            </div>
          ) : isListLoading ? (
            <div className="p-4 text-sm text-muted-foreground">
              Loading shipments…
            </div>
          ) : !shipments || shipments.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No shipments found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Shipment</th>
                  <th className="px-4 py-3 text-left">State</th>
                  <th className="px-4 py-3 text-left">Route</th>
                  <th className="px-4 py-3 text-left">ETA</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => {
                  const isDelivered = shipment.state.includes('delivered');
                  const isDelayed = shipment.state.includes('delayed');

                  const statusClasses = isDelivered
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : isDelayed
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                      : 'bg-accent/10 text-accent-foreground border border-accent/20';

                  return (
                    <tr
                      key={shipment.id}
                      className="border-t border-border/60 hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">
                            Shipment {shipment.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {shipment.origin.city}, {shipment.origin.country} →{' '}
                            {shipment.destination.city},{' '}
                            {shipment.destination.country}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses}`}
                        >
                          {shipment.state.join(', ')}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-muted-foreground">
                        <div className="flex flex-col gap-0.5">
                          <span>
                            From: {shipment.origin.city},{' '}
                            {shipment.origin.country}
                          </span>
                          <span>
                            To: {shipment.destination.city},{' '}
                            {shipment.destination.country}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm">
                        <span className="text-foreground">
                          {formatEta(shipment.estimatedDeliveryDate)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
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
