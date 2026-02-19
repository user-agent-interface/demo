import 'mapbox-gl/dist/mapbox-gl.css';

import { component, schema } from '@uai/client';
import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl, { Map } from 'mapbox-gl';

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
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
      if (mapContainerRef.current === null || mapRef.current !== null) return;
      // access token from https://account.mapbox.com
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [-74.5, 40], // starting position [lng, lat]: New York City
        zoom: 9, // starting zoom
      });
      mapRef.current = map;

      map.on('load', () => setMapLoaded(true));

      // Create custom marker element
      const markerElement = document.createElement('div');

      // Render React component with Tailwind classes into the marker element
      const root = createRoot(markerElement);
      root.render(
        <button className="absolute flex items-center justify-center transition-all duration-300 hover:scale-125">
          <div className="relative">
            <div className="absolute -inset-2 animate-ping rounded-full bg-accent/30" />
            <div className="h-4 w-4 rounded-full border-2 border-accent bg-accent/50" />
          </div>
        </button>
      );

      // Add marker to map
      new mapboxgl.Marker(markerElement).setLngLat([-74.5, 40]).addTo(map);
    }, []);

    return (
      <div className="relative map-container h-96 -m-4">
        {!mapLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-muted/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <span className="text-sm font-medium text-muted-foreground">
                Loading map…
              </span>
            </div>
          </div>
        )}
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
    );
  },
});
