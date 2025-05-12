'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locationsData from '@/data/locations.json';
import categoriesData from '@/data/categories.json';
import { GeoJSONFeature, GeoJSONData, MapProps, Category } from '@/interfaces';
import CustomPopup from './CustomPopup';
import SearchBox from './SearchBox';
import Sidebar from './Sidebar';
import './common.css';
import './customPopup.css';
import './pulsatingMarker.css';

const Map = ({ center, zoom }: MapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [locations, setLocations] = useState<GeoJSONData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
  const [searchedFeature, setSearchedFeature] = useState<GeoJSONFeature | null>(null);
  const [pulsatingMarkerId, setPulsatingMarkerId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  useEffect(() => {
    setIsMounted(true);
    setLocations(locationsData as GeoJSONData);
    setCategories(categoriesData as Category[]);
  }, []);

  // Monitor `searchedFeature` state and control the map center movement and popup display
  useEffect(() => {
    if (searchedFeature && mapRef.current) {
      const position: [number, number] = [
        searchedFeature.geometry.coordinates[1],
        searchedFeature.geometry.coordinates[0]
      ];
      mapRef.current.flyTo(position, zoom);

      const markerId = searchedFeature.properties.id;
      const marker = markerRefs.current[markerId];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
          setSelectedFeature(searchedFeature);
          setPulsatingMarkerId(searchedFeature.properties.id);
        }, 300); // Short delay to ensure the map has moved to the position
      }
    }
  }, [searchedFeature]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchSelect = (feature: GeoJSONFeature) => {
    setSearchedFeature(feature);
    setSelectedFeature(feature);
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

  if (!isMounted) {
    return <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>;
  }

  return (
    <>
      <Sidebar
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
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
              ref={(marker) => {
                markerRefs.current[feature.properties.id] = marker;
              }}
              eventHandlers={{
                click: () => {
                  setSelectedFeature(feature);
                  setPulsatingMarkerId(feature.properties.id);
                }
              }}
            >
              <CustomPopup feature={feature} />
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default Map;
