import React from 'react';
import Input from './ui/Input';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="w-full">
      <Input 
        placeholder="Search for gyms by name, area, or zip code..." 
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
