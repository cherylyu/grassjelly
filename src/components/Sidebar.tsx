'use client';

import { useState } from 'react';
import { SidebarProps, Category } from '@/interfaces';
import Image from 'next/image';

const Sidebar = ({ categories, onCategorySelect, selectedCategory, currentView = 'filter' }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
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
      className={`fixed top-0 left-[90px] h-full w-[300px] p-4 bg-white shadow-lg z-500 transition-all duration-300 ease-in-out ${
        collapsed ? 'transform -translate-x-[300px]' : ''
      }`}
    >
      {currentView === 'filter' ? (
        <>
          <h2 className="text-md font-medium">類別</h2>

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
              歡迎使用本地圖！這是一個為協助青埔居民及遊客探索該地區而打造的地圖。
            </p>
            <p>
              您可以透過本站輕鬆找到各種地點，包括醫療設施、便利商店、公園等等。每個地點都被分類並以特定顏色標記，讓您能快速識別。
            </p>
            <p>
              未來將會陸續新增餐廳、店舖等資訊，以及支援其他篩選條件。
            </p>
            <p>
              如您遇到任何關於地圖的問題，麻煩到 <a href="https://github.com/cherylyu/grassjelly/issues" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline underline-offset-4">GitHub</a> 回報給作者。謝謝！
            </p>
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
