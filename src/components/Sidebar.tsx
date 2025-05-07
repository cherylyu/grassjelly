'use client';

import { SidebarProps } from '@/interfaces';
import { useState } from 'react';
import Image from 'next/image';

const Sidebar = ({ feature }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className={`fixed top-0 left-[80px] h-full w-[320px] bg-white shadow-lg z-500 transition-all duration-300 ease-in-out ${
        collapsed ? 'transform -translate-x-[320px]' : ''
      }`}
    >
      {feature && (
        <div className="p-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-xl font-semibold">{feature.properties.name}</h2>
          </div>
          <div className="mt-4">
            <p><strong>類型:</strong> {feature.properties.category || '未指定'}</p>
            <p><strong>座標:</strong> {feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute top-1/2 -right-6 w-6 h-12 z-501 flex items-center justify-center transition-transform cursor-pointer ${
          collapsed ? 'rotate-180' : 'bg-white rounded-r-md shadow-md'
        }`}
        aria-label={collapsed ? '展開側邊欄' : '收合側邊欄'}
      >
        <Image
          src="/images/slide-arrow.svg"
          alt="收合/展開"
          width={7}
          height={24}
          className="opacity-80"
        />
      </button>
    </div>
  );
};

export default Sidebar;
