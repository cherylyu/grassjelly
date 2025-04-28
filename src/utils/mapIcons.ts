import L from 'leaflet';

const greenIcon = new L.Icon({
  iconUrl: '/images/marker-icon-green.png',
  iconRetinaUrl: '/images/marker-icon-2x-green.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const goldIcon = new L.Icon({
  iconUrl: '/images/marker-icon-gold.png',
  iconRetinaUrl: '/images/marker-icon-2x-gold.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = new L.Icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Get icon based on location type
export const getIconByType = (type: string): L.Icon => {
  switch (type) {
    case '公園':
      return greenIcon;
    case 'YouBike 站點':
      return goldIcon;
    default:
      return defaultIcon;
  }
};

// Export all icons for direct usage
export { greenIcon, goldIcon, defaultIcon };
