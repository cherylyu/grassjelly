'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from 'react-leaflet';
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

interface SidebarProps {
  feature: GeoJSONFeature | null;
  onClose: () => void;
}

const Sidebar = ({ feature, onClose }: SidebarProps) => {
  if (!feature) return null;

  return (
    <div className="fixed top-0 left-0 h-full w-[400px] bg-white shadow-lg z-[1000] overflow-auto transition-transform duration-300 ease-in-out">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{feature.properties.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="p-4">
        <p><strong>類型:</strong> {feature.properties.type || '未指定'}</p>
        <p><strong>座標:</strong> {feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}</p>
      </div>
    </div>
  );
};

const Map = ({ center, zoom }: MapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [locations, setLocations] = useState<GeoJSONData | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setLocations(locationsData as GeoJSONData);
  }, []);

  const handleCloseSidebar = () => {
    setSelectedFeature(null);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: () => {
        setSelectedFeature(null);
      }
    });
    return null;
  };

  if (!isMounted) {
    return <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>;
  }

  return (
    <>
      <Sidebar feature={selectedFeature} onClose={handleCloseSidebar} />
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
        className="rounded-lg shadow-md"
      >
        <MapClickHandler />
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
            <Marker
              key={index}
              position={position}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedFeature(feature);
                }
              }}
            >
              <Popup>
                {feature.properties.name}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default Map;
