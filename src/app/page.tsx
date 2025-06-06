'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('無法獲取類別資料');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('取得類別資料失敗:', error);
      }
    };

    fetchCategories();
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

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Navbar
        currentView={currentView}
        sidebarCollapsed={sidebarCollapsed}
        onToggleView={handleToggleView}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className="pl-[80px] w-full h-full">
        <MapWithNoSSR
          center={[25.011905, 121.216255]}
          zoom={16}
          currentView={currentView}
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
