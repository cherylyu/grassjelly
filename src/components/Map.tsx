'use client';

import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoJSONFeature, MapProps, Category } from '@/interfaces';
import { useAppStore } from '@/store/useAppStore';
import LocationOverlay from './LocationOverlay';
import SearchBox from './SearchBox';
import './common.css';
import './pulsating.css';

const Map = ({
  center,
  zoom,
  locations,
  categories
}: MapProps) => {
  const { selectedCategory } = useAppStore();

  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
  const [searchedFeature, setSearchedFeature] = useState<GeoJSONFeature | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [pulsatingMarkerId, setPulsatingMarkerId] = useState<string | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [filteredLocations, setfilteredLocations] = useState<GeoJSONFeature[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  useEffect(() => {
    if (locations && selectedCategory !== undefined) {
      const filtered = locations.features.filter(feature =>
        isInSelectedCategory(feature.properties.category, selectedCategory || '')
      );
      setfilteredLocations(filtered);

      setPulsatingMarkerId(null);
      setIsOverlayOpen(false);
    }
  }, [locations, selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

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
          filteredLocations={filteredLocations}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectLocation={handleSearchSelect}
        />
      )}

      {filteredLocations.length === 0 && (
        <div className="absolute w-[300px] p-2 top-1/2 left-1/2 transform -translate-x-1/2 rounded-md shadow-md
                        bg-amber-50 text-amber-600 border border-amber-600 text-sm text-center z-600">
          <i className="fa-solid fa-circle-exclamation mr-2"></i>
          查無符合的地點，請放寬您的篩選條件
        </div>
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

        {filteredLocations.map((feature, index) => {
          // GeoJSON coordinates are [longitude, latitude], but Leaflet needs [latitude, longitude]
          const position: [number, number] = [
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
          ];

          const isPulsating = pulsatingMarkerId === feature.properties.id;

          const icon = L.divIcon({
            className: '',
            html: `<div class="marker-icon-wrapper ${isPulsating ? 'marker-pulse' : ''}">
                    <img src="/images/marker-icons/${feature.properties.category || 'default'}.svg" alt="Marker" width="36" height="45" />
                  </div>`,
            iconSize: [36, 45],
            iconAnchor: [18, 45],
            popupAnchor: [0, -45]
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
