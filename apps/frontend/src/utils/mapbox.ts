import mapboxgl from 'mapbox-gl';

// access token from https://account.mapbox.com
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export { mapboxgl as mapBox };
