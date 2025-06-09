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
    <nav className="fixed top-0 left-0 right-0 p-2 w-full md:w-[90px] h-[70px] md:h-full z-800
                    flex-row md:flex-col flex items-center justify-between">
      <div className="p-2">
        <Image
          src="/images/logo.svg"
          alt="Logo"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>

      <div className="flex flex-row md:flex-col items-center justify-end md:justify-center
                      md:mt-auto md:mb-auto md:space-y-2">
        <button
          className={`flex flex-row md:flex-col items-center justify-center cursor-pointer rounded-md
                      w-9 md:w-16 h-9 md:h-16 mr-2 md:mr-0 md:mb-4 p-2 transition-all duration-200
                     ${
            activeView === 'filter' && !sidebarCollapsed
              ? 'bg-[#00d5be33] text-teal-600'
              : 'hover:bg-[#4c4c4c14] text-gray-700'
          }`}
          onClick={() => handleViewToggle('filter')}
          aria-label="篩選"
        >
          <Image
            src={`/images/filter${
              activeView === 'filter' && !sidebarCollapsed ? '-active' : ''
            }.svg`}
            alt="篩選"
            width={24}
            height={24}
            className="md:mb-2"
          />
          <span className="text-xs font-medium hidden md:inline">篩選</span>
        </button>

        <button
          className={`flex flex-row md:flex-col items-center justify-center cursor-pointer rounded-md
                      w-9 md:w-16 h-9 md:h-16 mr-2 md:mr-0 md:mb-4 p-2 transition-all duration-200
                     ${
            activeView === 'about' && !sidebarCollapsed
              ? 'bg-[#00d5be33] text-teal-600'
              : 'hover:bg-[#4c4c4c14] text-gray-700'
          }`}
          onClick={() => handleViewToggle('about')}
          aria-label="關於"
        >
          <Image
            src={`/images/info${
              activeView === 'about' && !sidebarCollapsed ? '-active' : ''
            }.svg`}
            alt="關於"
            width={24}
            height={24}
            className="md:mb-2"
          />
          <span className="text-xs font-medium hidden md:inline">關於</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
