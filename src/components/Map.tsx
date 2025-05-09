'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationsData from '@/data/locations.json';
import { GeoJSONFeature, GeoJSONData, MapProps } from '@/interfaces';
import Sidebar from './Sidebar';
import SearchBox from './SearchBox';
import './pulsatingMarker.css';
import './customPopup.css';

const Map = ({ center, zoom }: MapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [locations, setLocations] = useState<GeoJSONData | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
  const [searchedFeature, setSearchedFeature] = useState<GeoJSONFeature | null>(null);
  const [pulsatingMarkerId, setPulsatingMarkerId] = useState<string | null>(null);
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

  const handleSearchSelect = (feature: GeoJSONFeature) => {
    setSearchedFeature(feature);
    setSelectedFeature(feature);
  };

  if (!isMounted) {
    return <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>;
  }

  return (
    <>
      <Sidebar onCategorySelect={(id) => console.log('類別選擇:', id)} />
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

          const isPulsating = pulsatingMarkerId === feature.properties.id;

          const icon = L.divIcon({
            className: '',
            html: `<div class="marker-icon-wrapper ${isPulsating ? 'marker-pulse' : ''}">
                    <img src="/images/marker-icon-${feature.properties.category || 'default'}.png" alt="Marker" width="25" height="41" />
                  </div>`,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          });

          return (
            <Marker
              key={index}
              position={position}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setSelectedFeature(feature);
                  setPulsatingMarkerId(feature.properties.id);
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="popup-container">
                  <div className="popup-header">
                    <h3 className="popup-title">{feature.properties.name}</h3>
                  </div>
                  <div className="popup-body">
                    {feature.properties.description && (
                      <div className="popup-description">{feature.properties.description}</div>
                    )}

                    {feature.properties.address && (
                      <div className="popup-info-row">
                        <img src="/images/popup-icon-building.svg" alt="地址" className="popup-icon" />
                        <span className="popup-text">{feature.properties.address}</span>
                      </div>
                    )}

                    {feature.properties.phone && (
                      <div className="popup-info-row">
                        <img src="/images/popup-icon-phone.svg" alt="電話" className="popup-icon" />
                        <span className="popup-text">{feature.properties.phone}</span>
                      </div>
                    )}

                    {feature.properties.website && (
                      <div className="popup-info-row">
                        <img src="/images/popup-icon-global.svg" alt="網站" className="popup-icon" />
                        <a href={feature.properties.website} target="_blank" rel="noopener noreferrer" className="popup-text popup-link">
                          {feature.properties.website}
                        </a>
                      </div>
                    )}

                    {feature.properties.glink && (
                      <div className="popup-info-row">
                        <img src="/images/popup-icon-google.svg" alt="Google 地圖" className="popup-icon" />
                        <a href={feature.properties.glink} target="_blank" rel="noopener noreferrer" className="popup-text popup-link">
                          在 Google 地圖中開啟
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default Map;
