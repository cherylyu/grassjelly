'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { NavbarProps } from '@/interfaces';

const Navbar = ({ currentView = 'filter', sidebarCollapsed = false, onToggleView, onToggleSidebar }: NavbarProps) => {
  const [activeView, setActiveView] = useState<'filter' | 'about'>(currentView);

  useEffect(() => {
    setActiveView(currentView);
  }, [currentView]);

  const handleViewToggle = (view: 'filter' | 'about') => {
    if (activeView === view && !sidebarCollapsed) {
      if (onToggleSidebar) {
        onToggleSidebar(true);
      }
    } else {
      setActiveView(view);
      if (onToggleView) {
        onToggleView(view);
      }
      if (sidebarCollapsed && onToggleSidebar) {
        onToggleSidebar(false);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-[90px] h-full p-2 bg-[#efefef] z-600 flex flex-col items-center shadow-[5px_0_10px_-5px_rgba(0,0,0,0.15)]">
      <div className="p-2">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>

      <div className="flex flex-col items-center justify-center mt-auto mb-auto space-y-2">
        <button
          className={`flex flex-col items-center justify-center w-16 h-16 mb-4 p-2 cursor-pointer rounded-md transition-all duration-200 ${
            activeView === 'filter' && !sidebarCollapsed
              ? 'bg-[#1fb14114] text-teal-600'
              : 'hover:bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleViewToggle('filter')}
          aria-label="篩選器"
        >
          <i className={`fa-solid fa-list text-xl mb-2 ${
            activeView === 'filter' && !sidebarCollapsed ? 'text-teal-600' : ''
          }`}></i>
          <span className="text-xs font-medium">篩選器</span>
        </button>

        <button
          className={`flex flex-col items-center justify-center w-16 h-16 mb-4 p-2 cursor-pointer rounded-md transition-all duration-200 ${
            activeView === 'about' && !sidebarCollapsed
              ? 'bg-[#1fb14114] text-teal-600'
              : 'hover:bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleViewToggle('about')}
          aria-label="關於本站"
        >
          <i className={`fa-solid fa-lightbulb text-xl mb-2 ${
            activeView === 'about' && !sidebarCollapsed ? 'text-teal-600' : ''
          }`}></i>
          <span className="text-xs font-medium">關於本站</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
