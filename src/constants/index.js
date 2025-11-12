/**
 * Application-wide constants
 */

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
}

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

// Order Status Labels (for display)
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
}

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: '#f59e0b',
  [ORDER_STATUS.PROCESSING]: '#3b82f6',
  [ORDER_STATUS.SHIPPED]: '#8b5cf6',
  [ORDER_STATUS.DELIVERED]: '#10b981',
  [ORDER_STATUS.CANCELLED]: '#ef4444',
}

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
}

// Payment Method Labels
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CREDIT_CARD]: 'Credit Card',
  [PAYMENT_METHODS.DEBIT_CARD]: 'Debit Card',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHODS.CASH_ON_DELIVERY]: 'Cash on Delivery',
}

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
}

// Report Types
export const REPORT_TYPES = {
  SUMMARY: 'summary',
  DETAILED: 'detailed',
  SALES: 'sales',
  INVENTORY: 'inventory',
}

// Report Formats
export const REPORT_FORMATS = {
  PDF: 'pdf',
  CSV: 'csv',
  EXCEL: 'excel',
}

// API Endpoints (relative paths)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',

  // Products
  PRODUCTS: '/api/products',
  PRODUCT: (id) => `/api/products/${id}`,

  // Categories
  CATEGORIES: '/api/categories',
  CATEGORY: (id) => `/api/categories/${id}`,

  // Cart
  CART: '/cart/',
  CART_ITEM: (id) => `/cart/${id}`,

  // Orders
  ORDERS: '/orders/',
  ORDER: (id) => `/orders/${id}`,
  CANCEL_ORDER: (id) => `/orders/${id}/cancel`,

  // Admin
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT: (id) => `/admin/products/${id}`,
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CATEGORY: (id) => `/admin/categories/${id}`,
  ADMIN_ORDERS: '/admin/orders/',
  ADMIN_ORDER_STATUS: (id) => `/admin/orders/${id}/status`,
  ADMIN_USERS: '/admin/users',
  ADMIN_USER: (id) => `/admin/users/${id}`,
  ADMIN_REPORT: '/admin/report',

  // Feedback
  FEEDBACK: '/feedback/',

  // Shops
  SHOPS: '/shops',
  ADMIN_SHOP_REQUESTS: '/admin/shop-requests',
  ADMIN_SHOP_REQUEST: (id) => `/admin/shop-requests/${id}`,
  ADMIN_SHOP_REQUEST_APPROVE: (id) => `/admin/shop-requests/${id}/approve`,
  ADMIN_SHOP_REQUEST_REJECT: (id) => `/admin/shop-requests/${id}/reject`,

  // GuestBook
  GUESTBOOK: '/guestbook',
  ADMIN_GUESTBOOK: '/admin/guestbook',
  ADMIN_GUESTBOOK_ENTRY: (id) => `/admin/guestbook/${id}`,
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
}

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
  MIN_RATING: 1,
  MAX_RATING: 5,
}

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  LOADING_DELAY: 200,
}
