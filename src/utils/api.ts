import axios from 'axios';
import { API_URL } from '../config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('instapark_token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API for authentication
export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/admin');
    return response.data;
  }
};

// API for admin users
export const adminsApi = {
  getAll: async () => {
    const response = await api.get('/admins');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/admins/${id}`);
    return response.data;
  },
  create: async (adminData: any) => {
    const response = await api.post('/admins', adminData);
    return response.data;
  },
  update: async (id: string, adminData: any) => {
    const response = await api.put(`/admins/${id}`, adminData);
    return response.data;
  },
  updatePassword: async (id: string, password: string) => {
    const response = await api.put(`/admins/${id}/password`, { password });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/admins/${id}`);
    return response.data;
  }
};

// API for bookings
export const bookingsApi = {
  getAll: async (filters = {}) => {
    const response = await api.get('/bookings', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  create: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  update: async (id: string, bookingData: any) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/bookings/stats/counts');
    return response.data;
  }
};

// API for contacts
export const contactsApi = {
  getAll: async (filters = {}) => {
    const response = await api.get('/contacts', { params: filters });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },
  create: async (contactData: any) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },
  update: async (id: string, contactData: any) => {
    const response = await api.put(`/contacts/${id}`, contactData);
    return response.data;
  },
  resolve: async (id: string, isResolved: boolean, response: string) => {
    const responseData = await api.put(`/contacts/${id}/resolve`, { isResolved, response });
    return responseData.data;
  },
  assign: async (id: string, adminId: string | null) => {
    const response = await api.put(`/contacts/${id}/assign`, { adminId });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/contacts/stats/counts');
    return response.data;
  }
};

// API for dashboard
export const dashboardApi = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getBookingsByDay: async () => {
    const response = await api.get('/dashboard/bookings/daily');
    return response.data;
  },
  getLocationStats: async () => {
    const response = await api.get('/dashboard/locations');
    return response.data;
  }
};

export default api;