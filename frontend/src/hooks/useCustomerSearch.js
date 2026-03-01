import { useState, useEffect } from 'react';

/**
 * Custom hook to filter customer data based on search input.
 * 
 * @param {Array} customers - The initial list of customers.
 * @param {string} searchQuery - The search query to filter customers.
 * @returns {Array} - The filtered list of customers.
 */
const useCustomerSearch = (customers, searchQuery) => {
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(lowercasedQuery) ||
        customer.email.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customers, searchQuery]);

  return filteredCustomers;
};

export default useCustomerSearch;