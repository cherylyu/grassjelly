'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
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

export default function Home() {
  const [currentView, setCurrentView] = useState<'filter' | 'about'>('filter');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<GeoJSONData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations');

        if (!response.ok) {
          throw new Error(`取得地點資料時發生錯誤: ${response.status}`);
        }

        const data = await response.json();
        setLocations(data as GeoJSONData);
      } catch (err) {
        console.error('取得地點資料失敗:', err);
        setError(err instanceof Error ? err.message : '取得地點資料時發生未知錯誤');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');

        if (!response.ok) {
          throw new Error(`取得類別資料時發生錯誤: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data as Category[]);
      } catch (err) {
        console.error('取得類別資料失敗:', err);
        setError(err instanceof Error ? err.message : '取得類別資料時發生未知錯誤');
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchLocations(), fetchCategories()]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleView = (view: 'filter' | 'about') => {
    setCurrentView(view);
  };

  const handleToggleSidebar = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  if (isLoading) {
    return <div className="w-full h-full min-h-screen flex items-center justify-center bg-white"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="w-full h-full min-h-screen flex items-center justify-center bg-red-100 text-red-500">{error}</div>;
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
          locations={locations}
          categories={categories}
          selectedCategory={selectedCategory}
        />
        <Sidebar
          currentView={currentView}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          collapsed={sidebarCollapsed}
          onCollapseStateChange={handleToggleSidebar}
        />
      </div>
    </div>
  );
}
