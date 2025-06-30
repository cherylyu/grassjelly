'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { GeoJSONData, Category } from '@/interfaces';

// Dynamically load the map component to avoid SSR
const MapWithNoSSR = dynamic(
  () => import('@/components/Map'),
  {
    loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-100 animate-pulse">載入地圖中...</div>,
    ssr: false
  }
);

const fetchLocations = async (): Promise<GeoJSONData> => {
  const response = await fetch('/api/locations');
  if (!response.ok) {
    throw new Error(`取得地點資料時發生錯誤: ${response.status}`);
  }
  return response.json();
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error(`取得類別資料時發生錯誤: ${response.status}`);
  }
  return response.json();
};

export default function Home() {
  const [currentView, setCurrentView] = useState<'filter' | 'about'>('filter');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');

  const locationsQuery = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const handleToggleView = (view: 'filter' | 'about') => {
    setCurrentView(view);
  };

  const handleToggleSidebar = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const isLoading = locationsQuery.isLoading || categoriesQuery.isLoading;
  const error = locationsQuery.error || categoriesQuery.error;
  const errorMessage = error instanceof Error ? error.message : '取得資料時發生未知錯誤';

  if (isLoading) {
    return <div className="w-full h-full min-h-screen flex items-center justify-center bg-white"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="w-full h-full min-h-screen flex items-center justify-center bg-red-100 text-red-500">{errorMessage}</div>;
  }

  return (
    <div className="w-screen h-screen text-gray-700 overflow-hidden">
      <Navbar
        currentView={currentView}
        sidebarCollapsed={sidebarCollapsed}
        onToggleView={handleToggleView}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className="w-full h-full pt-[70px] md:pt-0 md:pl-[90px]">
        <MapWithNoSSR
          center={[25.011905, 121.216255]}
          zoom={16}
          locations={locationsQuery.data}
          categories={categoriesQuery.data || []}
          selectedCategory={selectedCategory}
        />
        <Sidebar
          currentView={currentView}
          categories={categoriesQuery.data || []}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          collapsed={sidebarCollapsed}
          onCollapseStateChange={handleToggleSidebar}
        />
      </div>
    </div>
  );
}
