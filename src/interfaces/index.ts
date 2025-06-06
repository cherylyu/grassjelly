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
  currentView?: 'filter' | 'about';
  locations?: GeoJSONData | null;
  categories: Category[];
  selectedCategory?: string | null;
  onSearchSelect?: () => void;
}

// Sidebar component interfaces
export interface SidebarProps {
  currentView?: 'filter' | 'about';
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  collapsed: boolean;
  onCollapseStateChange?: (collapsed: boolean) => void;
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

// Navbar component interfaces
export interface NavbarProps {
  currentView?: 'filter' | 'about';
  sidebarCollapsed: boolean;
  onToggleView?: (view: 'filter' | 'about') => void;
  onToggleSidebar?: (collapsed: boolean) => void;
}
