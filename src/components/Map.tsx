'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
  const [, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
  const [, setSearchedFeature] = useState<GeoJSONFeature | null>(null);
  const [pulsatingMarkerId, setPulsatingMarkerId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  useEffect(() => {
    setIsMounted(true);

    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');

        if (!response.ok) {
          throw new Error(`取得地點資料時發生錯誤: ${response.status}`);
        }

        const data = await response.json();
        setLocations(data as GeoJSONData);
      } catch (err) {
        console.error('取得地點資料失敗:', err);
        setError(err instanceof Error ? err.message : '取得地點資料時發生未知錯誤');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');

        if (!response.ok) {
          throw new Error(`取得類別資料時發生錯誤: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data as Category[]);
      } catch (err) {
        console.error('取得類別資料失敗:', err);
        setError(err instanceof Error ? err.message : '取得類別資料時發生未知錯誤');
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchLocations(), fetchCategories()]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const moveToLocation = (feature: GeoJSONFeature) => {
    if (mapRef.current) {
      const position: [number, number] = [
        feature.geometry.coordinates[1] + 0.002, // Adjusted for better centering
        feature.geometry.coordinates[0]
      ];
      mapRef.current.flyTo(position, zoom);

      const markerId = feature.properties.id;
      const marker = markerRefs.current[markerId];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
          setPulsatingMarkerId(feature.properties.id);
        }, 300); // Short delay to ensure the map has moved to the position
      }
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchSelect = (feature: GeoJSONFeature) => {
    setSelectedCategory('all');

    setTimeout(() => {
      setSearchedFeature(feature);
      setSelectedFeature(feature);
      moveToLocation(feature);
    }, 100); // Short delay to ensure the markers have been rendered
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

  if (!isMounted || isLoading) {
    return <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-500">{error}</div>;
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
