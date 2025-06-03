import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    // Log request details in development
    if (import.meta.env.DEV) {
      console.log('Request:', {
        url: config.url,
        method: config.method,
        cookies: document.cookie,
        headers: config.headers,
      });
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    // Log response details in development
    if (import.meta.env.DEV) {
      console.log('Response:', {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('Response error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    return Promise.reject(error);
  }
);

export default axios; 