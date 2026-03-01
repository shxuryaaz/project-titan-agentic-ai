import React, { useState } from 'react';

// SearchFilter component for dashboard search functionality
const SearchFilter = () => {
  // State to hold the search input value
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle the change in the search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex justify-center mt-5">
      <div className="mb-3 xl:w-96">
        <div className="input-group relative flex items-stretch w-full mb-4">
          <input
            type="search"
            className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Search..."
            aria-label="Search"
            aria-describedby="button-addon2"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span
            className="input-group-text flex items-center px-3 py-1.5 text-base font-normal text-gray-500 text-center whitespace-nowrap rounded"
            id="basic-addon2"
          >
            🔍
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;