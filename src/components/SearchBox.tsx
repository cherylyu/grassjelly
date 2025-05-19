'use client';

import { useState, KeyboardEvent } from 'react';
import Image from 'next/image';
import { GeoJSONFeature, SearchBoxProps } from '@/interfaces';

const SearchBox = ({ locations, onSelectLocation }: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const filteredLocations = locations?.filter(location =>
    location.properties.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(e.target.value.length > 0);
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
    if (!showResults || filteredLocations.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredLocations.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredLocations.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredLocations.length) {
          handleSelectLocation(filteredLocations[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1001] w-[300px]">
      <div className="relative left-[40px]">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="搜尋地點..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 pr-10 rounded-md bg-white/60 backdrop-blur-md border border-gray-300 shadow-md hover:border-gray-400 focus:outline-none focus:border-emerald-400 focus:ring focus:ring-emerald-400 duration-300 ease-in-out"
          />
          <span className="absolute right-2 p-1.5 rounded-md bg-transparent">
            <Image src="/images/search.svg" alt="搜尋" width={20} height={20} />
          </span>
        </div>
        {showResults && filteredLocations.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-[200px] overflow-y-auto">
            {filteredLocations.map((location, index) => (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer ${
                  index === selectedIndex
                    ? 'bg-emerald-400 text-white font-medium'
                    : 'hover:bg-gray-100'
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
