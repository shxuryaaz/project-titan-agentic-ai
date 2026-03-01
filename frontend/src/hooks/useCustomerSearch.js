import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook to handle real-time search logic for customer data.
 * @param {string} query - The search query input by the user.
 * @returns {Object} The search results and loading state.
 */
const useCustomerSearch = (query) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Function to fetch filtered customer data
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.example.com/customers/search?q=${query}`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch customer data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (query.length > 0) {
      fetchFilteredData();
    } else {
      setData([]);
    }
  }, [query]);

  return { data, loading };
};

export default useCustomerSearch;