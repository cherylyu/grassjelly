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
    description: string;
    address: string;
    phone: string;
    website: string;
    glink: string;
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
  locations?: GeoJSONData | null;
  categories: Category[];
  selectedCategory?: string | null;
}

// Sidebar component interfaces
export interface SidebarProps {
  categories: Category[];
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
  filteredLocations: GeoJSONFeature[] | null;
  categories?: Category[];
  selectedCategory?: string | null;
  onSelectLocation: (feature: GeoJSONFeature) => void;
}
