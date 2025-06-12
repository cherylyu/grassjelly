'use client';

import { useState, KeyboardEvent, useEffect } from 'react';
import Image from 'next/image';
import { GeoJSONFeature, SearchBoxProps, Category } from '@/interfaces';

const SearchBox = ({
  filteredLocations,
  categories = [],
  selectedCategory,
  onSelectLocation
}: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [placeholder, setPlaceholder] = useState('搜尋地點...');

  useEffect(() => {
    if (selectedCategory) {
      handleClearSearch();

      const categoryName = findCategoryNameById(selectedCategory, categories);

      if (categoryName) {
        const needsSpace = /^[a-zA-Z0-9]/.test(categoryName);
        setPlaceholder(`搜尋${needsSpace ? ' ' : ''}${categoryName}...`);
      } else {
        setPlaceholder('搜尋地點...');
      }
    } else {
      setPlaceholder('搜尋地點...');
    }
  }, [selectedCategory, categories]);

  const findCategoryNameById = (categoryId: string, categories: Category[]): string | null => {
    for (const category of categories) {
      if (category.id === categoryId) {
        return category.name;
      }
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          if (subcategory.id === categoryId) {
            return subcategory.name;
          }
        }
      }
    }
    return null;
  };

  const searchHints = filteredLocations?.filter(location =>
    location.properties.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(e.target.value.length > 0);
    setSelectedIndex(-1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const handleSearchFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Pre-select the input box for quicker text modification
    e.target.select();
    setShowResults(e.target.value.length > 0);
  };

  const handleSelectLocation = (location: GeoJSONFeature) => {
    onSelectLocation(location);
    setSearchTerm(location.properties.name);
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showResults || searchHints.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < searchHints.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : searchHints.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchHints.length) {
          handleSelectLocation(searchHints[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="fixed w-full max-w-[320px] top-20 md:top-4 left-1/2 transform -translate-x-1/2 z-600">
      <div className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onKeyDown={handleKeyDown}
            className="w-full px-10 py-2 rounded-full bg-white/60 backdrop-blur-md border border-gray-300 shadow-md hover:border-gray-400 focus:outline-none focus:border-emerald-400 focus:ring focus:ring-emerald-400 duration-300 ease-in-out"
          />
          <span className="absolute left-2 p-1.5 rounded-md bg-transparent">
            <Image src="/images/search.svg" alt="搜尋" width={20} height={20} />
          </span>
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 p-1 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="清除搜尋"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        {showResults && searchHints.length > 0 && (
          <ul className="search-hints absolute top-full left-0 right-0 mt-1 bg-white rounded-md max-h-[220px] overflow-y-auto">
            {searchHints.map((location, index) => (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer ${
                  index === selectedIndex
                    ? 'bg-emerald-400 text-white font-semibold'
                    : 'hover:bg-slate-100'
                }`}
                onClick={() => handleSelectLocation(location)}
              >
                {location.properties.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
