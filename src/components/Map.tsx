'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationsData from '@/data/locations.json';
import { GeoJSONFeature, GeoJSONData, MapProps } from '@/interfaces';
import { getIconByType } from '@/utils/mapIcons';
import Sidebar from './Sidebar';
import SearchBox from './SearchBox';

const Map = ({ center, zoom }: MapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [locations, setLocations] = useState<GeoJSONData | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
  const [searchedFeature, setSearchedFeature] = useState<GeoJSONFeature | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setLocations(locationsData as GeoJSONData);
  }, []);

  // Monitor `searchedFeature` state and control the map center movement
  useEffect(() => {
    if (searchedFeature && mapRef.current) {
      const position: [number, number] = [
        searchedFeature.geometry.coordinates[1],
        searchedFeature.geometry.coordinates[0]
      ];
      mapRef.current.flyTo(position, zoom);
    }
  }, [searchedFeature]);

  const handleCloseSidebar = () => {
    setSelectedFeature(null);
  };

  const handleSearchSelect = (feature: GeoJSONFeature) => {
    setSearchedFeature(feature);
    setSelectedFeature(feature);
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
      {locations && (
        <SearchBox
          locations={locations.features}
          onSelectLocation={handleSearchSelect}
        />
      )}
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
        className="rounded-lg shadow-md"
        ref={mapRef}
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
