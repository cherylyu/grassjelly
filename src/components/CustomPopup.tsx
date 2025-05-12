'use client';

import { useState } from 'react';
import { Popup } from 'react-leaflet';
import { GeoJSONFeature } from '@/interfaces';

interface CustomPopupProps {
  feature: GeoJSONFeature;
}

const CustomPopup = ({ feature }: CustomPopupProps) => {
  const DESCRIPTION_CHAR_LIMIT = 52;

  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  return (
    <Popup className="custom-popup">
      <div className="popup-container">
        <div className="popup-header">
          <h3 className="popup-title">{feature.properties.name}</h3>
        </div>
        <div className="popup-body">
          {feature.properties.description && (
            <div className="popup-description">
              {feature.properties.description.length > DESCRIPTION_CHAR_LIMIT && !expandedDescriptions[feature.properties.id] ? (
                <>
                  {feature.properties.description.substring(0, DESCRIPTION_CHAR_LIMIT)}...
                  <a
                    href="#"
                    className="popup-toggle-description"
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
                      className="popup-toggle-description"
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

          {feature.properties.address && (
            <div className="popup-info-row">
              <img src="/images/popup-icon-building.svg" alt="地址" className="popup-icon" />
              <span className="popup-text">{feature.properties.address}</span>
            </div>
          )}

          {feature.properties.phone && (
            <div className="popup-info-row">
              <img src="/images/popup-icon-phone.svg" alt="電話" className="popup-icon" />
              <span className="popup-text">{feature.properties.phone}</span>
            </div>
          )}

          {feature.properties.website && (
            <div className="popup-info-row">
              <img src="/images/popup-icon-global.svg" alt="網站" className="popup-icon" />
              <a href={feature.properties.website} target="_blank" rel="noopener noreferrer" className="popup-text popup-link">
                {feature.properties.website}
              </a>
            </div>
          )}

          {feature.properties.glink && (
            <div className="popup-info-row">
              <img src="/images/popup-icon-google.svg" alt="Google 地圖" className="popup-icon" />
              <a href={feature.properties.glink} target="_blank" rel="noopener noreferrer" className="popup-text popup-link">
                在 Google 地圖中開啟
              </a>
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default CustomPopup;
