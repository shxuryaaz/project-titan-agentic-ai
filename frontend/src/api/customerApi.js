import axios from 'axios';

/**
 * Fetches customer data from the backend.
 * @returns {Promise} A promise that resolves with the fetched customer data.
 */
export const fetchCustomers = () => {
  return axios.get('/api/customers')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching customers:', error);
      throw error;
    });
};