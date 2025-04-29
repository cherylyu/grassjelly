'use client';

import { SidebarProps } from '@/interfaces';

const Sidebar = ({ feature, onClose }: SidebarProps) => {
  if (!feature) return null;

  return (
    <div className="fixed top-0 left-0 h-full w-[400px] bg-white shadow-lg z-[1000] overflow-auto transition-transform duration-300 ease-in-out">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{feature.properties.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="p-4">
        <p><strong>類型:</strong> {feature.properties.type || '未指定'}</p>
        <p><strong>座標:</strong> {feature.geometry.coordinates[1]}, {feature.geometry.coordinates[0]}</p>
      </div>
    </div>
  );
};

export default Sidebar;
