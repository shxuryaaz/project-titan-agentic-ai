import React, { useState } from 'react';

// Defines a SearchFilter component for user input
const SearchFilter = () => {
  // State to hold the input value
  const [inputValue, setInputValue] = useState('');

  // Handles input changes
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search..."
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchFilter;