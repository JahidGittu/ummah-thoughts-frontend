'use client';

// Stub implementations for map components
// These are placeholder exports to satisfy the build
// In production, replace with proper Leaflet or similar library

export const Map = ({ children, center, zoom, ...props }: any) => (
  <div {...props} className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
    {children || <p>Map component - replace with Leaflet.js implementation</p>}
  </div>
);

export const MapTileLayer = (props: any) => null;
export const MapMarker = (props: any) => null;
export const MapPopup = (props: any) => null;
export const MapZoomControl = (props: any) => null;
export const MapLayerGroup = (props: any) => null;
export const MapLayers = (props: any) => null;
export const MapLayersControl = (props: any) => null;
export const MapFeatureGroup = (props: any) => null;
export const MapMarkerClusterGroup = (props: any) => null;
export const MapCircle = (props: any) => null;
export const MapCircleMarker = (props: any) => null;
export const MapPolyline = (props: any) => null;
export const MapPolygon = (props: any) => null;
export const MapRectangle = (props: any) => null;
export const MapFullscreenControl = (props: any) => null;
export const MapLocateControl = (props: any) => null;
export const MapSearchControl = (props: any) => null;
export const MapControlContainer = (props: any) => null;
export const MapDrawControl = (props: any) => null;
export const MapDrawPolyline = (props: any) => null;
export const MapDrawCircle = (props: any) => null;
export const MapDrawRectangle = (props: any) => null;
export const MapDrawPolygon = (props: any) => null;

