'use client';

import { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoJSONFeature, MapProps, Category } from '@/interfaces';
import LocationOverlay from './LocationOverlay';
import SearchBox from './SearchBox';
import './common.css';
import './pulsatingMarker.css';

const Map = ({
  center,
  zoom,
  locations,
  categories,
  selectedCategory,
  onSearchSelect
}: MapProps) => {
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
  const [searchedFeature, setSearchedFeature] = useState<GeoJSONFeature | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [pulsatingMarkerId, setPulsatingMarkerId] = useState<string | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const moveToLocation = (feature: GeoJSONFeature) => {
    if (mapRef.current) {
      const position: [number, number] = [
        feature.geometry.coordinates[1] - 0.001, // Adjusted for better centering
        feature.geometry.coordinates[0]
      ];
      mapRef.current.flyTo(position, zoom);

      const markerId = feature.properties.id;
      const marker = markerRefs.current[markerId];
      if (marker) {
        setTimeout(() => {
          handleMarkerClick(feature);
        }, 300); // Short delay to ensure the map has moved to the position
      }
    }
  };

  const handleSearchSelect = (feature: GeoJSONFeature) => {
    if (onSearchSelect) {
      onSearchSelect();
    }

    setTimeout(() => {
      setSearchedFeature(feature);
      setSelectedFeature(feature);
      setIsOverlayOpen(true);
      moveToLocation(feature);
    }, 100); // Short delay to ensure the markers have been rendered
  };

  const handleMarkerClick = (feature: GeoJSONFeature) => {
    setSelectedFeature(feature);
    setPulsatingMarkerId(feature.properties.id);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setPulsatingMarkerId(null);
    setIsOverlayOpen(false);
  };

  const isInSelectedCategory = (featureCategoryId: string, categoryId: string | null): boolean => {
    if (categoryId === 'all') return true;
    if (!categoryId) return false;

    // Get the selected category object
    const findCategoryById = (categories: Category[], id: string): Category | null => {
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.subcategories) {
          const found = findCategoryById(category.subcategories, id);
          if (found) return found;
        }
      }
      return null;
    };

    // Get IDs of the selected category and all its subcategories
    const getAllCategoryIds = (category: Category): string[] => {
      const ids = [category.id];
      if (category.subcategories) {
        category.subcategories.forEach(sub => {
          ids.push(...getAllCategoryIds(sub));
        });
      }
      return ids;
    };

    const selectedCategoryObj = findCategoryById(categories, categoryId);
    if (!selectedCategoryObj) return false;

    const selectedCategoryIds = getAllCategoryIds(selectedCategoryObj);
    return selectedCategoryIds.includes(featureCategoryId);
  };

  return (
    <>
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
        ref={mapRef}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations && locations.features
          .filter(feature => isInSelectedCategory(feature.properties.category, selectedCategory || ''))
          .map((feature, index) => {
          // GeoJSON coordinates are [longitude, latitude], but Leaflet needs [latitude, longitude]
          const position: [number, number] = [
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
          ];

          const isPulsating = pulsatingMarkerId === feature.properties.id;

          const icon = L.divIcon({
            className: '',
            html: `<div class="marker-icon-wrapper ${isPulsating ? 'marker-pulse' : ''}">
                    <img src="/images/marker-icons/${feature.properties.category || 'default'}.svg" alt="Marker" width="40" height="50" />
                  </div>`,
            iconSize: [40, 50],
            iconAnchor: [20, 50],
            popupAnchor: [0, -50]
          });

          return (
            <Marker
              key={index}
              position={position}
              icon={icon}
              ref={(marker) => {
                markerRefs.current[feature.properties.id] = marker;
              }}
              eventHandlers={{
                click: () => handleMarkerClick(feature)
              }}
            />
          );
        })}
      </MapContainer>

      <LocationOverlay
        feature={selectedFeature}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </>
  );
};

export default Map;
