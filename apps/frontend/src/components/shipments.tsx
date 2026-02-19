import 'mapbox-gl/dist/mapbox-gl.css';

import { component, schema } from '@uai/client';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Map, Marker, LngLatBounds } from 'mapbox-gl';
import useSWR from 'swr';
import { mapBox } from '../utils/mapbox';
import { fetcher } from '../utils/api';
import type { Shipment } from '@uai/shared';

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
    const mapRef = useRef<Map>(null);
    const markersRef = useRef<Marker[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Fetch shipments
    const {
      data: shipments,
      error,
      isLoading: isShipmentsLoading,
    } = useSWR<Shipment[]>(`/api/shipments?state=${filter}`, fetcher, {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    });

    const mapContainerCallbackRef = (mapContainer: HTMLDivElement) => {
      if (mapRef.current !== null) return;

      const map = new mapBox.Map({
        container: mapContainer,
        center: [16.37, 48.21], // starting position [lng, lat]: Vienna, Austria
        zoom: 9, // starting zoom
      });
      mapRef.current = map;

      map.on('load', () => setMapLoaded(true));
    };

    // Update markers when shipments data changes
    useEffect(() => {
      if (!mapRef.current || !mapLoaded || !shipments || shipments.length === 0)
        return;

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Collect all positions for bounds calculation
      const positions: [number, number][] = [];

      // Add markers for each shipment
      shipments.forEach((shipment) => {
        const position =
          shipment.actualPosition || shipment.destination.position;
        const [lat, lng] = position;
        positions.push([lng, lat]);

        // Determine marker color based on shipment state
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
        const pingColor = isDelivered
          ? 'bg-green-500/30'
          : isDelayed
            ? 'bg-red-500/30'
            : 'bg-accent/30';

        // Create custom marker element
        const markerElement = document.createElement('div');

        // Render React component with Tailwind classes into the marker element
        const root = createRoot(markerElement);
        root.render(
          <button className="absolute flex items-center justify-center transition-all duration-300 hover:scale-125">
            <div className="relative">
              <div
                className={`absolute -inset-2 animate-ping rounded-full ${pingColor}`}
              />
              <div
                className={`relative h-4 w-4 rounded-full border-2 ${borderColor} ${bgColor}/50`}
              >
                <div
                  className={`absolute inset-0 rounded-full ${bgColor}/30`}
                />
              </div>
            </div>
          </button>
        );

        // Add marker to map
        const marker = new mapBox.Marker(markerElement)
          .setLngLat([lng, lat])
          .addTo(mapRef.current!);
        markersRef.current.push(marker);
      });

      // Fit map bounds to include all markers
      if (positions.length > 0) {
        const bounds = new LngLatBounds();
        positions.forEach(([lng, lat]) => {
          bounds.extend([lng, lat]);
        });

        mapRef.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 12, // Prevent zooming in too much
        });
      }
    }, [shipments, mapLoaded]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        markersRef.current.forEach((marker) => marker.remove());
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }, []);

    const isLoadingData = isShipmentsLoading || !mapLoaded;
    const hasError = error !== undefined;

    return (
      <div className="relative map-container h-96 -m-4">
        {isLoadingData && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-muted/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <span className="text-sm font-medium text-muted-foreground">
                {isShipmentsLoading && 'Loading shipments…'}
                {!mapLoaded && 'Loading map…'}
              </span>
            </div>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-muted/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <span className="text-sm font-medium text-destructive">
                Failed to load shipments
              </span>
            </div>
          </div>
        )}
        <div ref={mapContainerCallbackRef} className="h-full w-full" />
      </div>
    );
  },
});
