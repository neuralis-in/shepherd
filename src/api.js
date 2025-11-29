// API Client for Shepherd
// Handles authentication and API key management

const API_URL = import.meta.env.PROD 
  ? 'https://shepherd-api-48963996968.us-central1.run.app'
  : 'https://shepherd-api-48963996968.us-central1.run.app';

const api = {
  // ========================================
  // Auth Helpers
  // ========================================
  
  getToken() {
    return localStorage.getItem('session_token');
  },
  
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isLoggedIn() {
    return !!this.getToken();
  },
  
  headers() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },
  
  // ========================================
  // Google OAuth
  // ========================================
  
  async getGoogleAuthUrl() {
    const response = await fetch(`${API_URL}/auth/google/url`);
    if (!response.ok) {
      throw new Error('Failed to get auth URL');
    }
    return response.json();
  },
  
  async exchangeCode(code, redirectUri) {
    const response = await fetch(`${API_URL}/auth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: redirectUri })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Authentication failed');
    }
    
    return response.json();
  },
  
  // ========================================
  // User
  // ========================================
  
  async getMe() {
    const response = await fetch(`${API_URL}/auth/me`, { 
      headers: this.headers() 
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
      }
      throw new Error('Not authenticated');
    }
    
    return response.json();
  },
  
  async logout() {
    try {
      await fetch(`${API_URL}/auth/logout`, { 
        method: 'POST', 
        headers: this.headers() 
      });
    } catch (error) {
      // Ignore logout errors
    }
    this.clearSession();
  },
  
  clearSession() {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user');
  },
  
  setSession(token, user) {
    localStorage.setItem('session_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // ========================================
  // API Keys
  // ========================================
  
  async listApiKeys() {
    const response = await fetch(`${API_URL}/v1/accounts/me/api-keys`, { 
      headers: this.headers() 
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to list API keys');
    }
    
    const data = await response.json();
    
    // Handle different response formats
    // Could be: [...], { api_keys: [...] }, { keys: [...] }, or { data: [...] }
    if (Array.isArray(data)) {
      return data;
    }
    if (data.api_keys && Array.isArray(data.api_keys)) {
      return data.api_keys;
    }
    if (data.keys && Array.isArray(data.keys)) {
      return data.keys;
    }
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    // If it's an object but not in expected format, return empty array
    console.warn('Unexpected API keys response format:', data);
    return [];
  },
  
  async createApiKey(name = 'Default') {
    const response = await fetch(`${API_URL}/v1/accounts/me/api-keys`, {
      method: 'POST',
      headers: {
        ...this.headers(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to create API key');
    }
    
    const data = await response.json();
    
    // Handle different response formats
    // Could be: { api_key, key_prefix, name } or wrapped in another object
    if (data.api_key || data.key) {
      return data;
    }
    if (data.data && (data.data.api_key || data.data.key)) {
      return data.data;
    }
    if (data.key_data && (data.key_data.api_key || data.key_data.key)) {
      return data.key_data;
    }
    
    // Return as-is if we can't determine the structure
    return data;
  },
  
  async revokeApiKey(keyId) {
    const response = await fetch(`${API_URL}/v1/accounts/me/api-keys/${keyId}`, {
      method: 'DELETE',
      headers: this.headers()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to revoke API key');
    }
    
    return response.json();
  },
  
  // ========================================
  // Usage
  // ========================================
  
  async getUsage() {
    const response = await fetch(`${API_URL}/v1/accounts/me`, {
      headers: this.headers()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to fetch usage');
    }
    
    return response.json();
  },
  
  // ========================================
  // Razorpay Subscriptions
  // ========================================
  
  /**
   * Create a new subscription
   * @param {Object} params
   * @param {string} params.clientId - Unique client identifier
   * @param {number} params.amount - Amount in INR (e.g., 4999)
   * @param {Object} params.billingDetails - Billing information
   * @param {string} params.billingDetails.name - Full name
   * @param {string} params.billingDetails.email - Email address
   * @param {string} params.billingDetails.phone - Phone number
   * @param {string} [params.billingDetails.company] - Company name (optional)
   * @returns {Promise<{subscription_id: string, status: string, short_url: string}>}
   */
  async createSubscriptionOrder({ clientId, amount, billingDetails }) {
    const response = await fetch(`${API_URL}/v1/subscriptions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        amount: amount,
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email,
          phone: billingDetails.phone,
          company: billingDetails.company || ''
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to create subscription');
    }
    
    return response.json();
  },
  
  /**
   * Verify payment after Razorpay checkout
   * @param {Object} razorpayResponse - Response from Razorpay handler
   * @param {string} razorpayResponse.razorpay_payment_id
   * @param {string} razorpayResponse.razorpay_subscription_id
   * @param {string} razorpayResponse.razorpay_signature
   * @returns {Promise<{status: string, subscription_id: string, client_id: string, valid_until: string}>}
   */
  async verifySubscription({ razorpay_payment_id, razorpay_subscription_id, razorpay_signature }) {
    const response = await fetch(`${API_URL}/v1/subscriptions/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Payment verification failed');
    }
    
    return response.json();
  },
  
  /**
   * Get current subscription for a client
   * @param {string} clientId - Client identifier
   * @returns {Promise<Object|null>} Subscription object or null if not found
   */
  async getSubscription(clientId) {
    const url = new URL(`${API_URL}/v1/subscriptions/current`);
    if (clientId) {
      url.searchParams.set('client_id', clientId);
    }
    
    const response = await fetch(url.toString(), {
      headers: this.headers()
    });
    
    if (response.status === 404) {
      return null; // No active subscription
    }
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to fetch subscription');
    }
    
    return response.json();
  },
  
  /**
   * Cancel subscription
   * @param {string} clientId - Client identifier
   * @param {boolean} [cancelAtCycleEnd=true] - If true, cancel at end of billing period
   * @returns {Promise<{status: string, effective_date: string}>}
   */
  async cancelSubscription(clientId, cancelAtCycleEnd = true) {
    const url = new URL(`${API_URL}/v1/subscriptions/current/cancel`);
    if (clientId) {
      url.searchParams.set('client_id', clientId);
    }
    url.searchParams.set('cancel_at_cycle_end', cancelAtCycleEnd.toString());
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: this.headers()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to cancel subscription');
    }
    
    return response.json();
  },
  
  /**
   * Get billing/payment history
   * @param {string} clientId - Client identifier
   * @param {number} [limit=10] - Maximum number of records to return
   * @returns {Promise<{client_id: string, payments: Array}>}
   */
  async getBillingHistory(clientId, limit = 10) {
    const url = new URL(`${API_URL}/v1/billing/history`);
    if (clientId) {
      url.searchParams.set('client_id', clientId);
    }
    url.searchParams.set('limit', limit.toString());
    
    const response = await fetch(url.toString(), {
      headers: this.headers()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to fetch billing history');
    }
    
    return response.json();
  }
};

// ========================================
// Utility Functions
// ========================================

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}

export async function signInWithGoogle() {
  const { url } = await api.getGoogleAuthUrl();
  window.location.href = url;
}

export default api;

