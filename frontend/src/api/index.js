import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const register = (data) => API.post('/api/auth/register', data);
export const login = (data) => API.post('/api/auth/login', data);
export const getProfile = () => API.get('/api/auth/profile');
export const updateProfile = (data) => API.put('/api/auth/profile', data);

// PROPERTIES
export const getProperties = (params) => API.get('/api/properties', { params });
export const getPropertyById = (id) => API.get(`/api/properties/${id}`);
export const createProperty = (data) => API.post('/api/properties', data);
export const updateProperty = (id, data) => API.put(`/api/properties/${id}`, data);
export const deleteProperty = (id) => API.delete(`/api/properties/${id}`);
export const toggleSaveProperty = (id) => API.put(`/api/properties/${id}/save`);

// AI
export const chatWithAI = (data) => API.post('/api/ai/chat', data);
export const predictPrice = (data) => API.post('/api/ai/predict-price', data);
export const generateSummary = (id) => API.get(`/api/ai/summary/${id}`);

// ENQUIRIES
export const createEnquiry = (data) => API.post('/api/enquiries', data);
export const getEnquiries = () => API.get('/api/enquiries');
export const getEnquiryStats = () => API.get('/api/enquiries/stats');
export const updateEnquiry = (id, data) => API.put(`/api/enquiries/${id}`, data);
export const deleteEnquiry = (id) => API.delete(`/api/enquiries/${id}`);