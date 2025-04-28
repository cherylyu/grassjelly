'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import locationsData from '@/data/locations.json';
import { getIconByType } from '@/utils/mapIcons';

// Define GeoJSON related interfaces
interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // longitude, latitude
  };
  properties: {
    name: string;
    type: string;
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
    setLocations(locationsData as GeoJSONData);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>;
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      style={{ width: '100%', height: '100%' }}
      className="rounded-lg shadow-md"
    >
      <ZoomControl position="bottomright" />
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

        // Get the appropriate icon based on location type
        const icon = getIconByType(feature.properties.type);

        return (
          <Marker key={index} position={position} icon={icon}>
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
