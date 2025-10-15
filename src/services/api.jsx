// src/services/apiService.js

import axios from 'axios';

// Base URL from .env or default
const API_BASE_URL = 'http://localhost:5000/api';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

class ApiService {
  /**
   * Save or remove token in localStorage.
   */
  setToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Return current token
   */
  get token() {
    return localStorage.getItem('authToken');
  }

  /**
   * Return true if user is authenticated
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Build query string from params object
   */
  buildQuery(params) {
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : '';
  }

  /**
   * Perform an API request using axios
   * @param {string} endpoint - API endpoint (e.g. '/auth/login')
   * @param {object} options - { method, body, params, headers }
   * @returns {Promise<object>}
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body,
      params,
      headers = {},
    } = options;

    try {
      const response = await axiosInstance.request({
        url: endpoint,
        method,
        headers,
        data: body,
        params,
      });

      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      throw new Error(message);
    }
  }

  // === AUTH METHODS ===

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async login(credentials) {
    console.log('📨 login appelé avec:', credentials);
    
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });

    if (data?.data?.token) {
      this.setToken(data.data.token);
    }

    return data;
  }

  async verifyEmail(email, code) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: { email, code },
    });
  }

  async verifyOTP(email, otpCode) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: { email, otpCode },
    });
  }

  async resendOTP(email) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: { email },
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  }

  async resetPassword(email, code, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { email, code, newPassword },
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: profileData,
    });
  }

  logout() {
    this.setToken(null);
  }
}

export const apiService = new ApiService();
