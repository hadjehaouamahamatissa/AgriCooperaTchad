
const API_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      if (config.body) {
        console.log('📤 Request Body:', JSON.parse(config.body));
      }

      const response = await fetch(url, config);
      const data = await response.json();

      console.log(`📡 API Response (${response.status}):`, data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // 🔥 CORRECTION: Stocker le token et les données utilisateur après une connexion réussie
    if (response.success && response.data && !response.requiresOTP) {
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('✅ Token stocké:', response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('✅ User stocké:', response.data.user);
      }
    }

    return response;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Products methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    const token = localStorage.getItem('token');
    return this.request('/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    const token = localStorage.getItem('token');
    return this.request(`/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
  }

  // Orders methods 
  async createOrder(orderData, token) {
    console.log("🛒 ApiService.createOrder - Données reçues:", orderData);

    // Validation des données requises
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error("Aucun produit dans la commande");
    }

    if (!orderData.shippingAddress) {
      throw new Error("Adresse de livraison requise");
    }

    if (!orderData.payment || !orderData.payment.method) {
      throw new Error("Méthode de paiement requise");
    }

    // Structure des données pour l'API backend
    const apiPayload = {
      items: orderData.items.map(item => ({
        productId: item.productId,
        productName: item.productName || "Produit",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice
      })),
      totalAmount: orderData.totalAmount,
      shippingAddress: {
        fullName: orderData.shippingAddress.fullName || "Client",
        phone: orderData.shippingAddress.phone || "+235",
        region: orderData.shippingAddress.region || "N'Djamena",
        city: orderData.shippingAddress.city || "N'Djamena",
        neighborhood: orderData.shippingAddress.neighborhood || "",
        detailedAddress: orderData.shippingAddress.detailedAddress || "",
        instructions: orderData.shippingAddress.instructions || ""
      },
      payment: {
        method: orderData.payment.method,
        status: orderData.payment.status || "pending",
        transactionId: orderData.payment.transactionId || "",
        paymentDate: orderData.payment.paymentDate || null
      },
      notes: orderData.notes || "",
      desiredDeliveryDate: orderData.desiredDeliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    };

    console.log("📤 ApiService.createOrder - Payload final:", apiPayload);

    return this.request('/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiPayload),
    });
  }

  async getUserOrders(params = {}) {
    const token = localStorage.getItem('token');
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/orders/user${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getCooperativeOrders(params = {}) {
    const token = localStorage.getItem('token');
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/orders/cooperative${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateOrderStatus(orderId, status) {
    const token = localStorage.getItem('token');
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  }

  async cancelOrder(orderId) {
    const token = localStorage.getItem('token');
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Cooperatives methods
  async getCooperatives(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/cooperatives${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getCooperativeById(id) {
    return this.request(`/cooperatives/${id}`);
  }

  async createCooperative(cooperativeData) {
    const token = localStorage.getItem('token');
    return this.request('/cooperatives', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(cooperativeData),
    });
  }

  // Users methods
  async getUserProfile() {
    const token = localStorage.getItem('token');
    return this.request('/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateUserProfile(userData) {
    const token = localStorage.getItem('token');
    return this.request('/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  // Crédits
  async requestCredit(creditData) {
    const token = localStorage.getItem('token');
    return this.request('/credits/request', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(creditData),
    });
  }

  async getUserCredits(params = {}) {
    const token = localStorage.getItem('token');
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/credits/user${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getCooperativeCredits(params = {}) {
    const token = localStorage.getItem('token');
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/credits/cooperative${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async analyzeCredit(creditId, data) {
    const token = localStorage.getItem('token');
    return this.request(`/credits/analyze/${creditId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async payInstallment(creditId, echeanceId) {
    const token = localStorage.getItem('token');
    return this.request(`/credits/pay/${creditId}/${echeanceId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }



}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;