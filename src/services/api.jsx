
const API_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    // Récupérer le token du localStorage
    const token = localStorage.getItem('token');

    const url = `${this.baseURL}${endpoint}`;

    const headers = {

      'Content-Type': 'application/json',
      ...options.headers,
    }
    console.log('Token envoyé au backend:', token);

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      headers, // ✅ Maintenant headers est bien défini
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      if (config.body) {
        console.log('📤 Request Body:', JSON.parse(config.body));
      }

      const response = await fetch(url, config);
          // ✅ CORRECTION: Gérer les réponses sans contenu JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

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

  async resendOTP(email) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyEmail(email, code) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async verifyOTP(email, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async logout() {
    const token = localStorage.getItem('token');
    return this.request('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(cooperativeData),
    });
  }

  async addMember(cooperativeId, memberData) {
    const token = localStorage.getItem('token');
    return this.request(`/cooperatives/${cooperativeId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(memberData),
    });
  }

  
  async deleteCooperative(id) {
    const token = localStorage.getItem('token');
    return this.request(`/cooperatives/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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

 // Crédits
  getUserCredits() {
    return this.request('/credits'); // GET /api/credits
  }

  async createCreditRequest(formData) {
  const token = localStorage.getItem('token');
  return fetch(`${this.baseURL}/credits`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
}


  // Institutions financières partenaires
  getFinancialInstitutions() {
    return this.request('/credits/finance/institutions'); // GET /api/credits/finance/institutions
  }

  // Statistiques financières
  getFinanceStats() {
    return this.request('/credits/finance/stats'); // GET /api/credits/finance/stats
  }


  // Crédit coopérative
  getCooperativeCredits() {
    return this.request('/cooperative'); // GET /api/credits/cooperative
  }

  // Revue / approbation / rejet (analyste)
  reviewCredit(id, data) {
    return this.request(`/cooperative/${id}/review`, {
      method: 'PUT',
      // headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  // Payer une échéance
  payInstallment(creditId, installmentId) {
    return this.request(`/${creditId}/installments/${installmentId}/pay`, {
      method: 'POST'
    });
  }
}



// Export singleton instance
export const apiService = new ApiService();
export default apiService;