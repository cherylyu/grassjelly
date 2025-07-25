'use client';

import { useState } from 'react';
import { GeoJSONFeature } from '@/interfaces';

interface LocationOverlayProps {
  feature: GeoJSONFeature | null;
  isOpen: boolean;
  onClose: () => void;
}

const LocationOverlay = ({ feature, isOpen, onClose }: LocationOverlayProps) => {
  const DESCRIPTION_CHAR_LIMIT = 52;
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  if (!feature) return null;

  return (
    <div
      className={`location-overlay-container fixed bottom-0 left-[50%] transform -translate-x-1/2 w-[360px] max-w-full bg-white rounded-t-lg transition-all duration-300 ease-in-out z-500 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="location-overlay text-sm md:text-md">
        <div className="px-5 pt-5 pb-1 rounded-t-lg flex justify-between items-center">
          <h3 className="text-base md:text-lg font-semibold">{feature.properties.name}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="關閉"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="px-5 pt-1 pb-3">
          {feature.properties.description && (
            <div className="mb-3">
              {feature.properties.description.length > DESCRIPTION_CHAR_LIMIT && !expandedDescriptions[feature.properties.id] ? (
                <>
                  {feature.properties.description.substring(0, DESCRIPTION_CHAR_LIMIT)}...
                  <a
                    href="#"
                    className="text-emerald-600 hover:text-emerald-700 ml-1 font-semibold"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setExpandedDescriptions(prev => ({ ...prev, [feature.properties.id]: true }));
                    }}
                  >
                    顯示更多
                  </a>
                </>
              ) : (
                <>
                  {feature.properties.description}
                  {feature.properties.description.length > DESCRIPTION_CHAR_LIMIT && (
                    <a
                      href="#"
                      className="text-emerald-600 hover:text-emerald-700 ml-1 font-semibold"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setExpandedDescriptions(prev => ({ ...prev, [feature.properties.id]: false }));
                      }}
                    >
                      顯示較少
                    </a>
                  )}
                </>
              )}
            </div>
          )}

          <div className="space-y-2">
            {feature.properties.address && (
              <div className="flex items-center">
                <i className="fa-solid fa-building text-center w-4 mr-2"></i>
                <span>{feature.properties.address}</span>
              </div>
            )}

            {feature.properties.phone && (
              <div className="flex items-center">
                <i className="fa-solid fa-phone text-center w-4 mr-2"></i>
                <span>{feature.properties.phone}</span>
              </div>
            )}

            {/* Buttons Area */}
            <div className="flex justify-center gap-2 mt-3">
              {feature.properties.website && (
                <a
                  href={feature.properties.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-capsule font-semibold flex items-center justify-center w-1/2"
                >
                  <i className="fa-solid fa-earth-americas mr-2"></i>
                  <span>官方網站</span>
                </a>
              )}

              <a
                href={feature.properties.glink || `https://www.google.com/maps?q=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-capsule font-semibold flex items-center justify-center w-1/2"
              >
                <i className="fa-solid fa-map mr-2"></i>
                <span>Google 地圖</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationOverlay;
