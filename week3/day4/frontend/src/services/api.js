import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: API_BASE_URL ||'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export const projectAPI = {
  getAll: () => API.get('/projects'),
  getById: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
  getStats: () => API.get('/projects/stats'),
};

export const memberAPI = {
  getAll: () => API.get('/members'),
  getById: (id) => API.get(`/members/${id}`),
  create: (data) => API.post('/members', data),
  update: (id, data) => API.put(`/members/${id}`, data),
  delete: (id) => API.delete(`/members/${id}`),
};

export default API;
