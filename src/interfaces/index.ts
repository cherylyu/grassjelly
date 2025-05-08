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
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
}

// Category interfaces
export interface Category {
  id: string;
  name: string;
  color: string;
  subcategories?: Category[];
}

// Search box component interfaces
export interface SearchBoxProps {
  locations: GeoJSONFeature[] | null;
  onSelectLocation: (feature: GeoJSONFeature) => void;
}
