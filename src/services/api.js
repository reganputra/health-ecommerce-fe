import { apiClient } from './apiClient'
import { API_ENDPOINTS } from '@/constants'

/**
 * Health Store API Service
 * High-level API methods for all backend operations
 */
class HealthStoreAPI {
  constructor(client = apiClient) {
    this.client = client
  }

  // ==================== Auth ====================
  async register(userData) {
    return this.client.post(API_ENDPOINTS.REGISTER, userData, { auth: false })
  }

  async login(username, password) {
    return this.client.post(
      API_ENDPOINTS.LOGIN,
      { username, password },
      { auth: false }
    )
  }

  // ==================== Products ====================
  async getProducts() {
    return this.client.get(API_ENDPOINTS.PRODUCTS, { auth: false })
  }

  async getProduct(id) {
    return this.client.get(API_ENDPOINTS.PRODUCT(id), { auth: false })
  }

  async createProduct(productData) {
    const formData = this._buildProductFormData(productData)
    return this.client.post(API_ENDPOINTS.ADMIN_PRODUCTS, formData)
  }

  async updateProduct(id, productData) {
    const formData = this._buildProductFormData(productData)
    return this.client.put(API_ENDPOINTS.ADMIN_PRODUCT(id), formData)
  }

  async deleteProduct(id) {
    return this.client.delete(API_ENDPOINTS.ADMIN_PRODUCT(id))
  }

  /**
   * Build FormData for product create/update
   * @private
   */
  _buildProductFormData(productData) {
    const formData = new FormData()

    // Add text fields
    if (productData.name) formData.append('name', productData.name)
    if (productData.description) formData.append('description', productData.description)
    if (productData.price !== undefined) formData.append('price', productData.price.toString())
    if (productData.stock !== undefined) formData.append('stock', productData.stock.toString())
    if (productData.category_id) formData.append('category_id', productData.category_id.toString())

    // Add image file if present
    if (productData.imageFile) {
      formData.append('image', productData.imageFile)
    } else if (productData.image_url && !productData.imageFile) {
      // If no new file but has image_url (for updates without changing image)
      formData.append('image_url', productData.image_url)
    }

    return formData
  }

  // ==================== Categories ====================
  async getCategories() {
    return this.client.get(API_ENDPOINTS.CATEGORIES, { auth: false })
  }

  async getCategory(id) {
    return this.client.get(API_ENDPOINTS.CATEGORY(id), { auth: false })
  }

  async createCategory(categoryData) {
    return this.client.post(API_ENDPOINTS.ADMIN_CATEGORIES, categoryData)
  }

  async updateCategory(id, categoryData) {
    return this.client.put(API_ENDPOINTS.ADMIN_CATEGORY(id), categoryData)
  }

  async deleteCategory(id) {
    return this.client.delete(API_ENDPOINTS.ADMIN_CATEGORY(id))
  }

  // ==================== Cart ====================
  async getCart() {
    return this.client.get(API_ENDPOINTS.CART)
  }

  async addToCart(productId, quantity) {
    return this.client.post(API_ENDPOINTS.CART, {
      product_id: productId,
      quantity,
    })
  }

  async removeFromCart(cartItemId) {
    return this.client.delete(API_ENDPOINTS.CART_ITEM(cartItemId))
  }

  // ==================== Orders ====================
  async placeOrder(paymentMethod, bankName = '') {
    return this.client.post(API_ENDPOINTS.ORDERS, {
      payment_method: paymentMethod,
      bank_name: bankName,
    })
  }

  async getOrders() {
    return this.client.get(API_ENDPOINTS.ORDERS)
  }

  async getOrder(id) {
    return this.client.get(API_ENDPOINTS.ORDER(id))
  }

  async cancelOrder(id) {
    return this.client.put(API_ENDPOINTS.CANCEL_ORDER(id))
  }

  async downloadOrderReceipt(orderId) {
    const filename = `purchase-receipt-${orderId}.pdf`
    await this.client.downloadFile(API_ENDPOINTS.ORDER_RECEIPT(orderId), filename)
  }

  // ==================== Admin - Orders ====================
  async getAllOrders() {
    return this.client.get(API_ENDPOINTS.ADMIN_ORDERS)
  }

  async updateOrderStatus(orderId, status) {
    return this.client.put(API_ENDPOINTS.ADMIN_ORDER_STATUS(orderId), {
      status,
    })
  }

  // ==================== Admin - Users ====================
  async getAllUsers() {
    return this.client.get(API_ENDPOINTS.ADMIN_USERS)
  }

  async getUser(id) {
    return this.client.get(API_ENDPOINTS.ADMIN_USER(id))
  }

  async updateUser(id, userData) {
    return this.client.put(API_ENDPOINTS.ADMIN_USER(id), userData)
  }

  async deleteUser(id) {
    return this.client.delete(API_ENDPOINTS.ADMIN_USER(id))
  }

  // ==================== Feedback ====================
  async getProductFeedback(productId) {
    return this.client.get(API_ENDPOINTS.PRODUCT_FEEDBACK(productId), { auth: false })
  }

  async submitFeedback(productId, comment, rating) {
    return this.client.post(API_ENDPOINTS.FEEDBACK, {
      productId: productId,
      comment,
      rating,
    })
  }

  // ==================== Reports ====================
  async generateReport(type = 'summary', format = 'pdf', startDate = null, endDate = null) {
    const params = new URLSearchParams()
    params.append('type', type)
    params.append('format', format)
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)

    const filename = `report_${type}_${Date.now()}.${format}`
    await this.client.downloadFile(
      `${API_ENDPOINTS.ADMIN_REPORT}?${params.toString()}`,
      filename
    )
  }

}

// Export singleton instance
const api = new HealthStoreAPI()
export default api

// Also export the class for testing
export { HealthStoreAPI }
