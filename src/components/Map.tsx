import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  location: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
  markerMarkup?: string;
}

export default function Map({ location, zoom = 17, markerMarkup = '' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (mapRef.current && !mapInstance.current) {
      // Initialize the map
      mapInstance.current = L.map(mapRef.current).setView(
        [location.latitude, location.longitude],
        zoom
      );

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Add marker
      const marker = L.marker([location.latitude, location.longitude]).addTo(mapInstance.current);
      
      if (markerMarkup) {
        marker.bindPopup(markerMarkup);
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [location, zoom, markerMarkup]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[15rem] shadow-md rounded-lg"
    />
  );
} 