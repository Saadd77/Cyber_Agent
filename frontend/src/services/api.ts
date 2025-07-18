import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('pentestUser');
      localStorage.removeItem('currentProject');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },
  signup: async (userData: { email: string; password: string; first_name: string; last_name: string }) => {
    const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
    return response.data;
  },
};

// Projects API calls
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get(API_ENDPOINTS.PROJECTS.LIST);
    return response.data;
  },
  create: async (projectData: any) => {
    const response = await api.post(API_ENDPOINTS.PROJECTS.CREATE, projectData);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(API_ENDPOINTS.PROJECTS.GET(id));
    return response.data;
  },
  update: async (id: string, projectData: any) => {
    const response = await api.put(API_ENDPOINTS.PROJECTS.UPDATE(id), projectData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
    return response.data;
  },
};

// Targets API calls
export const targetsAPI = {
  getByProject: async (projectId: string) => {
    const response = await api.get(API_ENDPOINTS.TARGETS.LIST(projectId));
    return response.data;
  },
  create: async (targetData: any) => {
    const response = await api.post(API_ENDPOINTS.TARGETS.CREATE, targetData);
    return response.data;
  },
};

export default api;