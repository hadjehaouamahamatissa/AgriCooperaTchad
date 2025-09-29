// services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    async request(endpoint, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur API');
        }

        return data;
    }

    // Auth methods
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        
        if (data.success && data.data.token) {
            this.setToken(data.data.token);
        }
        
        return data;
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    async getPlatformStats() {
        return this.request('/auth/stats/platform');
    }

    // Cooperatives methods
    async getCooperatives(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/cooperatives?${queryString}`);
    }

    async createCooperative(cooperativeData) {
        return this.request('/cooperatives', {
            method: 'POST',
            body: JSON.stringify(cooperativeData),
        });
    }

    // Products methods
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products?${queryString}`);
    }

    async createProduct(productData) {
        return this.request('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    }

    logout() {
        this.setToken(null);
    }
}

export const apiService = new ApiService();