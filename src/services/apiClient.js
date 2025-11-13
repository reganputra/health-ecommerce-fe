import { storage } from '@/composables/useStorage'
import { STORAGE_KEYS } from '@/constants'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

/**
 * HTTP Client for API requests
 */
export class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Get request headers with optional authentication
   * @param {boolean} includeAuth - Include auth token in headers
   * @param {boolean} isFormData - Whether the request is multipart/form-data
   * @returns {Object} Headers object
   */
  getHeaders(includeAuth = true, isFormData = false) {
    const headers = {}

    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }

    if (includeAuth) {
      const token = storage.get(STORAGE_KEYS.AUTH_TOKEN)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * Make an HTTP request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`

    const isFormData = options.body instanceof FormData

    const config = {
      ...options,
      headers: {
        ...this.getHeaders(options.auth !== false, isFormData),
        ...options.headers,
      },
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Request failed'
      }))
      throw new Error(error.error || `Request failed with status ${response.status}`)
    }

    return await response.json()
  }

  /**
   * Make a GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  /**
   * Make a POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  /**
   * Make a PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  /**
   * Make a DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * Download a file (for reports)
   */
  async downloadFile(endpoint, filename, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = storage.get(STORAGE_KEYS.AUTH_TOKEN)

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to download file')
    }

    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(downloadUrl)
    document.body.removeChild(link)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Also export the class for testing
export default ApiClient
