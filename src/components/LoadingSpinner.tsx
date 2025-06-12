'use client';

import React from 'react';
import Image from 'next/image';
import './pulsating.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <div className="loading-marker">
        <Image
          src="/images/pure-marker.svg"
          alt="載入中圖示"
          width={48}
          height={48}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
