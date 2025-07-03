'use client';

import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';

const Navbar = () => {
  const {
    currentView,
    sidebarCollapsed,
    setCurrentView,
    toggleSidebar
  } = useAppStore();

  const handleViewToggle = (view: 'filter' | 'about') => {
    if (currentView === view && !sidebarCollapsed) {
      toggleSidebar();
    } else {
      setCurrentView(view);
      if (sidebarCollapsed) {
        toggleSidebar();
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
          priority={true}
        />
      </div>

      <div className="flex flex-row md:flex-col items-center justify-end md:justify-center
                      md:mt-auto md:mb-auto md:space-y-2">
        <button
          className={`flex flex-row md:flex-col items-center justify-center cursor-pointer rounded-md
                      w-10 md:w-16 h-10 md:h-16 mr-2 md:mr-0 md:mb-4 p-2 transition-all duration-200
                     ${
            currentView === 'filter' && !sidebarCollapsed
              ? 'bg-[#00d5be33] text-emerald-600'
              : 'hover:bg-slate-200'
          }`}
          onClick={() => handleViewToggle('filter')}
          aria-label="篩選"
        >
          <Image
            src={`/images/filter${
              currentView === 'filter' && !sidebarCollapsed ? '-active' : ''
            }.svg`}
            alt="篩選"
            width={24}
            height={24}
            className="md:mb-2"
          />
          <span className="text-xs hidden md:inline">篩選</span>
        </button>

        <button
          className={`flex flex-row md:flex-col items-center justify-center cursor-pointer rounded-md
                      w-10 md:w-16 h-10 md:h-16 mr-2 md:mr-0 md:mb-4 p-2 transition-all duration-200
                     ${
            currentView === 'about' && !sidebarCollapsed
              ? 'bg-[#00d5be33] text-emerald-600'
              : 'hover:bg-slate-200'
          }`}
          onClick={() => handleViewToggle('about')}
          aria-label="關於"
        >
          <Image
            src={`/images/info${
              currentView === 'about' && !sidebarCollapsed ? '-active' : ''
            }.svg`}
            alt="關於"
            width={24}
            height={24}
            className="md:mb-2"
          />
          <span className="text-xs hidden md:inline">關於</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
