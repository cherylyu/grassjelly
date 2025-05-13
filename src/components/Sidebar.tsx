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

            <div className={`w-5 h-5 mr-2 flex-shrink-0 rounded-xs checkbox ${level > 0 ? 'opacity-70' : ''} ${isSelected ? 'checked' : ''}`}
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
      className={`fixed top-0 left-[80px] h-full w-[300px] p-4 bg-white shadow-lg z-500 transition-all duration-300 ease-in-out ${
        collapsed ? 'transform -translate-x-[300px]' : ''
      }`}
    >
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
