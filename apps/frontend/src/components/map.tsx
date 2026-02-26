import 'mapbox-gl/dist/mapbox-gl.css';

import { ReactElement, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Map as MapboxMap,
  Marker as MapboxMarker,
  LngLatBounds,
  Popup,
} from 'mapbox-gl';
import { mapBox } from '../utils/mapbox';

export type Marker = {
  position: [number, number];
  bgColor: string;
  borderColor: string;
  popup?: ReactElement;
};

export const Map = ({
  initial,
  markers,
  loading,
}: {
  initial: {
    position: [number, number];
    zoom: number;
  };
  markers: Marker[];
  loading?: string;
}) => {
  const mapRef = useRef<MapboxMap>(null);
  const markersRef = useRef<MapboxMarker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapContainerCallbackRef = (mapContainer: HTMLDivElement) => {
    if (mapRef.current !== null) return;

    const map = new mapBox.Map({
      container: mapContainer,
      center: initial.position,
      zoom: initial.zoom,
    });
    mapRef.current = map;

    map.on('load', () => setMapLoaded(true));
  };

  // Update markers on map
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Collect all positions for bounds calculation
    const positions: [number, number][] = [];

    // Add markers to the map
    markers.forEach(({ position, bgColor, borderColor, popup }) => {
      const [lat, lng] = position;
      positions.push([lng, lat]);

      let mapboxPopup: Popup | null = null;
      let popupContainer: HTMLDivElement | null = null;

      if (popup) {
        popupContainer = document.createElement('div');
        const popupRoot = createRoot(popupContainer);
        let closePopup: (() => void) | null = null;

        popupRoot.render(
          <div className="relative">
            {popup}
            <button
              type="button"
              className="popup-close-btn absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
              onClick={() => closePopup?.()}
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
        );

        mapboxPopup = new Popup({
          closeOnClick: true,
          closeButton: false,
        }).setDOMContent(popupContainer);

        closePopup = () => mapboxPopup?.remove();
      }

      // Create custom marker element
      const markerElement = document.createElement('div');
      const markerRoot = createRoot(markerElement);
      markerRoot.render(
        <button className="flex h-6 w-6 items-center justify-center transition-all duration-300 hover:scale-125 hover:cursor-pointer">
          <div className="relative">
            <div
              className={`absolute -inset-2 animate-ping rounded-full ${bgColor}`}
            />
            <div
              className={`relative h-4 w-4 rounded-full border-2 ${borderColor}`}
            >
              <div className={`absolute inset-0 rounded-full ${bgColor}`} />
            </div>
          </div>
        </button>
      );

      // Add marker to map with popup
      const mapBoxMarker = new mapBox.Marker({
        element: markerElement,
        anchor: 'center',
      })
        .setLngLat([lng, lat])
        .setPopup(mapboxPopup)
        .addTo(mapRef.current!);

      // Ensure popup toggles on marker click
      mapBoxMarker.getElement().addEventListener('click', () => {
        mapBoxMarker.togglePopup();
      });
      markersRef.current.push(mapBoxMarker);
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
  }, [markers, mapLoaded]);

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

  return (
    <div className="relative  h-96">
      {(loading || !mapLoaded) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-muted/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span className="text-sm font-medium text-muted-foreground">
              {loading || 'Loading map…'}
            </span>
          </div>
        </div>
      )}
      <div ref={mapContainerCallbackRef} className="h-full w-full" />
    </div>
  );
};
