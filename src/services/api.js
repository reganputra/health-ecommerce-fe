const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

class HealthStoreAPI {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    }

    if (includeAuth) {
      const token = localStorage.getItem('authToken')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(options.auth !== false),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `Request failed with status ${response.status}`)
    }

    return await response.json()
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      auth: false,
    })
  }

  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      auth: false,
    })
  }

  async getProducts() {
    return this.request('/api/products', { auth: false })
  }

  async getProduct(id) {
    return this.request(`/api/products/${id}`, { auth: false })
  }

  async createProduct(productData) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id, productData) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    })
  }

  async getCategories() {
    return this.request('/api/categories', { auth: false })
  }

  async getCategory(id) {
    return this.request(`/api/categories/${id}`, { auth: false })
  }

  async createCategory(categoryData) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  }

  async updateCategory(id, categoryData) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    })
  }

  async deleteCategory(id) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE',
    })
  }

  async getCart() {
    return this.request('/cart/')
  }

  async addToCart(productId, quantity) {
    return this.request('/cart/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    })
  }

  async removeFromCart(cartItemId) {
    return this.request(`/cart/${cartItemId}`, {
      method: 'DELETE',
    })
  }

  async placeOrder(paymentMethod, bankName = '') {
    return this.request('/orders/', {
      method: 'POST',
      body: JSON.stringify({
        payment_method: paymentMethod,
        bank_name: bankName,
      }),
    })
  }

  async getOrders() {
    return this.request('/orders/')
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`)
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PUT',
    })
  }

  async getAllOrders() {
    return this.request('/admin/orders/')
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  async submitFeedback(productId, comment, rating) {
    return this.request('/feedback/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, comment, rating }),
    })
  }

  async getAllUsers() {
    return this.request('/admin/users')
  }

  async getUser(id) {
    return this.request(`/admin/users/${id}`)
  }

  async updateUser(id, userData) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    })
  }

  async generateReport(type = 'summary', format = 'pdf', startDate = null, endDate = null) {
    const params = new URLSearchParams()
    params.append('type', type)
    params.append('format', format)
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)

    const token = localStorage.getItem('authToken')
    const response = await fetch(`${this.baseURL}/admin/report?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to generate report')
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_${type}_${Date.now()}.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}

export default new HealthStoreAPI()
