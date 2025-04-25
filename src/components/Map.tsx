'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationsData from '@/data/locations.json';

// Leaflet in Next.js requires this approach to fix icon broken issues
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
  });
};

// Define GeoJSON related interfaces
interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // longitude, latitude
  };
  properties: {
    name: string;
  };
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

interface MapProps {
  center: [number, number];
  zoom: number;
}

const Map = ({ center, zoom }: MapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [locations, setLocations] = useState<GeoJSONData | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fixLeafletIcon();
    setLocations(locationsData as GeoJSONData);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>;
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      className="rounded-lg shadow-md"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations && locations.features.map((feature, index) => {
        // GeoJSON coordinates are [longitude, latitude], but Leaflet needs [latitude, longitude]
        const position: [number, number] = [
          feature.geometry.coordinates[1],
          feature.geometry.coordinates[0]
        ];

        return (
          <Marker key={index} position={position}>
            <Popup>
              {feature.properties.name}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
