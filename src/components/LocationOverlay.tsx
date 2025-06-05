'use client';

import { useState } from 'react';
import Image from 'next/image';
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
      className={`fixed bottom-0 left-[50%] transform -translate-x-1/2 w-[600px] max-w-[95vw] bg-white rounded-t-lg shadow-xl transition-all duration-300 ease-in-out z-[1000] ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="location-overlay-container">
        <div className="bg-gray-100 px-4 py-3 rounded-t-lg flex justify-between items-center border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{feature.properties.name}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="關閉"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-4">
          {feature.properties.description && (
            <div className="mb-4 text-gray-700">
              {feature.properties.description.length > DESCRIPTION_CHAR_LIMIT && !expandedDescriptions[feature.properties.id] ? (
                <>
                  {feature.properties.description.substring(0, DESCRIPTION_CHAR_LIMIT)}...
                  <a
                    href="#"
                    className="text-teal-600 hover:text-teal-700 ml-1 font-medium"
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
                      className="text-teal-600 hover:text-teal-700 ml-1 font-medium"
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

          <div className="space-y-3">
            {feature.properties.address && (
              <div className="flex items-center">
                <Image src="/images/popup-icons/building.svg" alt="地址" width={18} height={18} className="mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature.properties.address}</span>
              </div>
            )}

            {feature.properties.phone && (
              <div className="flex items-center">
                <Image src="/images/popup-icons/phone.svg" alt="電話" width={18} height={18} className="mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature.properties.phone}</span>
              </div>
            )}

            {feature.properties.website && (
              <div className="flex items-center">
                <Image src="/images/popup-icons/global.svg" alt="網站" width={18} height={18} className="mr-3 flex-shrink-0" />
                <a href={feature.properties.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 hover:underline">
                  {feature.properties.website}
                </a>
              </div>
            )}

            {feature.properties.glink && (
              <div className="flex items-center">
                <Image src="/images/popup-icons/google.svg" alt="Google 地圖" width={18} height={18} className="mr-3 flex-shrink-0" />
                <a href={feature.properties.glink} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 hover:underline">
                  在 Google 地圖中開啟
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationOverlay;
