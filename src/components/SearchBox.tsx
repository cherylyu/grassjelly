'use client';

import { useState } from 'react';
import { GeoJSONFeature, SearchBoxProps } from '@/interfaces';

const SearchBox = ({ locations, onSelectLocation }: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredLocations = locations?.filter(location =>
    location.properties.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(e.target.value.length > 0);
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
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1001] w-[300px]">
      <div className="relative">
        <input
          type="text"
          placeholder="搜尋地點..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          className="w-full px-4 py-2 rounded-full bg-white/60 backdrop-blur-xs border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {showResults && filteredLocations.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-[200px] overflow-y-auto">
            {filteredLocations.map((location, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectLocation(location)}
              >
                {location.properties.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
