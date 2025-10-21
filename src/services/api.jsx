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
    // console.error('❌ API Error:', error?.response?.data || error.message);
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

 
  isAuthenticated() {
    return !!this.token;
  }


  buildQuery(params) {
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : '';
  }


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


  // === COOPERATIVE METHODS ===

  async getCooperatives(params = {}) {
    // Les paramètres attendus par votre contrôleur
    const { region, activite, page = 1, limit = 10 } = params;
    const queryParams = {};

    if (region) queryParams.region = region;
    if (activite) queryParams.activite = activite;
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const query = this.buildQuery(queryParams);
    return this.request(`/cooperatives${query}`);
  }

  async getCooperativeById(id) {
    return this.request(`/cooperatives/${id}`);
  }

  async createCooperative(cooperativeData) {
    return this.request('/cooperatives', {
      method: 'POST',
      body: cooperativeData,
    });
  }

  async updateCooperative(id, cooperativeData) {
    return this.request(`/cooperatives/${id}`, {
      method: 'PUT',
      body: cooperativeData,
    });
  }

  async deleteCooperative(id) {
    return this.request(`/cooperatives/${id}`, {
      method: 'DELETE',
    });
  }

  // Méthodes spécifiques pour les membres
  // === MEMBER METHODS ===

  async addMember(cooperativeId, memberData) {
    return this.request(`/cooperatives/${cooperativeId}/members`, {
      method: 'POST',
      body: memberData,
    });
  }

  async getCooperativeMembers(cooperativeId) {
    return this.request(`/cooperatives/${cooperativeId}/members`);
  }

  async removeMember(cooperativeId, memberId) {
    return this.request(`/cooperatives/${cooperativeId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  // Méthode pour les statistiques
  async getCooperativeStats() {
    return this.request('/cooperatives/stats');
  }
}


export const apiService = new ApiService();
