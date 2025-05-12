'use client';

import { useState, useEffect } from 'react';
import { SidebarProps, Category } from '@/interfaces';
import Image from 'next/image';
import categoriesData from '@/data/categories.json';

const Sidebar = ({ onCategorySelect, selectedCategory }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    setCategories(categoriesData as Category[]);
  }, []);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  const renderCategoryItem = (category: Category, categoryColor = 'transparent', level = 0) => {
    const isExpanded = expandedCategories.includes(category.id);
    const isSelected = selectedCategory === category.id;
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    const iconStyle = {
      marginLeft: `${level * 25}px`
    };

    return (
      <div key={category.id}>
        <div
          className={`flex items-center py-2 rounded-sm cursor-pointer hover:bg-gray-100 ${
            isSelected ? 'bg-gray-100' : ''
          }`}
          onClick={() => handleCategorySelect(category.id)}
        >
          <div className="flex items-center" style={iconStyle}>
            {hasSubcategories ? (
              <span
                className="w-5 h-5 mx-1 flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
              >
                {isExpanded ? '▼' : '►'}
              </span>
            ) : (
              <div className="w-5 h-5 mx-1"></div>
            )}

            <div className={`w-5 h-5 mr-2 flex-shrink-0 ${level > 0 ? 'opacity-70' : ''}`}
              style={{
                backgroundColor: categoryColor,
                borderRadius: '2px'
              }}
            ></div>

            <span className="text-sm">{category.name}</span>
          </div>
        </div>

        {isExpanded && hasSubcategories && (
          <div className="subcategories">
            {category.subcategories?.map(subCategory =>
              renderCategoryItem(subCategory, category.color, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed top-0 left-[80px] h-full w-[300px] p-4 bg-white shadow-lg z-500 transition-all duration-300 ease-in-out ${
        collapsed ? 'transform -translate-x-[300px]' : ''
      }`}
    >
      <h2 className="text-md font-medium">類別</h2>

      <div className="category-tree py-2">
        {categories.map(category => renderCategoryItem(category, category.color))}
      </div>

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
