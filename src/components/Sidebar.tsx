'use client';

import { useState } from 'react';
import { SidebarProps, Category } from '@/interfaces';
import Image from 'next/image';

const Sidebar = ({ currentView = 'filter', categories, onCategorySelect, selectedCategory, collapsed = false, onCollapseStateChange }: SidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    if (onCategorySelect) {
      onCategorySelect(selectedCategory === categoryId ? null : categoryId);
    }
  };

  const handleCollapseToggle = () => {
    if (onCollapseStateChange) {
      onCollapseStateChange(!collapsed);
    }
  };

  const renderCategoryItem = (
    category: Category,
    categoryColor: string = 'transparent',
    parentCategory: string = '',
    level: number = 0
  ) => {
    const isExpanded = expandedCategories.includes(category.id);
    const isSelected = selectedCategory === category.id ||
      selectedCategory === parentCategory ||
      selectedCategory === 'all';
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    const iconStyle = {
      marginLeft: `${level * 28}px`
    };

    return (
      <div key={category.id} className="category-item">
        <div
          className={`flex items-center py-2 cursor-pointer hover:bg-gray-100 ${
            isSelected ? 'bg-gray-100' : ''
          }`}
          onClick={() => handleCategorySelect(category.id)}
        >
          <div className="flex items-center" style={iconStyle}>
            {hasSubcategories ? (
              <span
                className={`category-expand-toggle w-5 h-5 mx-2 flex items-center justify-center cursor-pointer duration-300 ease-in-out ${isExpanded ? 'rotate-90' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
              >
              </span>
            ) : (
              <div className="w-5 h-5 mx-2"></div>
            )}

            <div className={`w-5 h-5 mr-2 flex-shrink-0 rounded-xs checkbox ${isSelected ? 'checked' : ''}`}
              style={{ backgroundColor: categoryColor }}
            ></div>

            <span>{category.name}</span>
          </div>
        </div>

        {isExpanded && hasSubcategories && (
          <div className="subcategories">
            {category.subcategories?.map(subCategory =>
              renderCategoryItem(subCategory, category.color, category.id, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`sidebar fixed top-[70px] md:top-0 left-0 md:left-[90px] w-full md:w-[300px] h-[calc(100vh-70px)] md:h-full
                  p-4 bg-white z-700 transition-all duration-600 ease-in-out overflow-y-auto md:overflow-visible
                 ${collapsed ? 'transform -translate-y-[100vh] md:translate-y-0 md:-translate-x-[300px]' : ''}`}
    >
      {/* Close button for small screens */}
      <button
        onClick={handleCollapseToggle}
        className="md:hidden absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
        aria-label="關閉側邊欄"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {currentView === 'filter' ? (
        <>
          <h2 className="text-base font-medium pt-2">類別</h2>

          <div className="category-tree py-2 text-sm">
            <div className="category-item">
              <div
                className={`flex items-center py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedCategory === 'all' ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleCategorySelect('all')}
              >
                <span className="mx-1"></span>
                <div className={`w-5 h-5 mr-2 flex-shrink-0 rounded-xs checkbox bg-gray-400 ${selectedCategory === 'all' ? 'checked' : ''}`}></div>
                <span>全部類別</span>
              </div>
            </div>

            {categories.map(category => renderCategoryItem(category, category.color))}
          </div>
        </>
      ) : (
        <div className="about-content py-2">
          <h2 className="text-md font-medium mb-4">關於本站</h2>

          <div className="text-sm text-gray-700 space-y-4">
            <p>
              這是一個協助青埔居民及遊客探索生活周遭環境的互動式地圖，歡迎使用！
            </p>
            <p>
              您可以透過本站輕鬆找到各種地點，包括醫療設施、便利商店、公園等等。每個地點都被分類並以特定顏色標記，讓您能快速識別。
            </p>
            <p>
              未來將會陸續新增餐廳、店舖等資訊，以及支援其他篩選條件。
            </p>
            <p className="mt-6">
              <a href="https://github.com/cherylyu/grassjelly" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-600 hover:text-green-700 underline underline-offset-4">
                <i className="fa-solid fa-code-fork mr-2"></i>
                GitHub
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Collapse button for large screens */}
      <button
        onClick={handleCollapseToggle}
        className={`btn-collapse md:absolute top-1/2 -right-6 w-6 h-12 hidden md:flex items-center justify-center transition-transform cursor-pointer ${
          collapsed ? 'rotate-180 collapsed' : 'bg-white rounded-r-md expanded'
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
