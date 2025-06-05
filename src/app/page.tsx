'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

// Dynamically load the map component to avoid SSR
const MapWithNoSSR = dynamic(
  () => import('@/components/Map'),
  {
    loading: () => <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">Loading map...</div>,
    ssr: false
  }
);

export default function Home() {
  const [currentView, setCurrentView] = useState<'filter' | 'about'>('filter');

  const handleToggleView = (view: 'filter' | 'about') => {
    setCurrentView(view);
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Navbar currentView={currentView} onToggleView={handleToggleView} />
      <div className="pl-[80px] w-full h-full">
        <MapWithNoSSR
          center={[25.011905, 121.216255]}
          zoom={16}
          currentView={currentView}
        />
      </div>
    </div>
  );
}
