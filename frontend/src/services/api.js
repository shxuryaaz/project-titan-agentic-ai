import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API
export const customerAPI = {
  getAll: (start_date = '', end_date = '') => api.get(`/api/customers/?start_date=${start_date}&end_date=${end_date}`),
  getById: (id) => api.get(`/api/customers/${id}`),
  create: (data) => api.post('/api/customers/', data),
  update: (id, data) => api.put(`/api/customers/${id}`, data),
  delete: (id) => api.delete(`/api/customers/${id}`),
  search: (query, companyName) => api.get(`/api/customers/search/?q=${query}&companyName=${companyName}`),
};

// Lead API
export const leadAPI = {
  getAll: (stage = null) => {
    const params = stage ? `?stage=${stage}` : '';
    return api.get(`/api/leads/${params}`);
  },
  getById: (id) => api.get(`/api/leads/${id}`),
  create: (data) => api.post('/api/leads/', data),
  update: (id, data) => api.put(`/api/leads/${id}`, data),
  delete: (id) => api.delete(`/api/leads/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/api/analytics/dashboard'),
  getPipeline: () => api.get('/api/analytics/leads/pipeline'),
};

export default api;
