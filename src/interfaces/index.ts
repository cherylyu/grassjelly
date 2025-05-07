// GeoJSON related interfaces
export interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // longitude, latitude
  };
  properties: {
    id: string;
    name: string;
    category: string;
  };
}

export interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

// Map component interfaces
export interface MapProps {
  center: [number, number];
  zoom: number;
}

// Sidebar component interfaces
export interface SidebarProps {
  feature: GeoJSONFeature | null;
}

// Search box component interfaces
export interface SearchBoxProps {
  locations: GeoJSONFeature[] | null;
  onSelectLocation: (feature: GeoJSONFeature) => void;
}
