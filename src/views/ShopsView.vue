<template>
  <div class="shops-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="icon-wrapper">
          <div class="icon-bg"></div>
          <span class="hero-icon">🏪</span>
        </div>
        <h1 class="hero-title">
          Partner <span class="gradient-text">Shops</span>
        </h1>
        <p class="hero-subtitle">
          Discover our network of trusted health and wellness partners
        </p>
      </div>
      <div class="hero-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <!-- Search and Filter Bar -->
      <div class="filter-bar">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search shops by name or owner..."
            class="search-input"
          />
        </div>
        <div class="filter-actions">
          <button
            @click="showActiveOnly = !showActiveOnly"
            :class="['filter-btn', { active: showActiveOnly }]"
          >
            <span class="filter-icon">{{ showActiveOnly ? '✅' : '⚪' }}</span>
            Active Only
          </button>
          <div class="results-count">
            <span class="count-number">{{ filteredShops.length }}</span>
            <span class="count-label">{{ filteredShops.length === 1 ? 'Shop' : 'Shops' }}</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="spinner-large"></div>
        <p class="loading-text">Loading partner shops...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="error-container">
        <div class="error-card">
          <span class="error-icon">⚠️</span>
          <h3 class="error-title">Failed to Load Shops</h3>
          <p class="error-message">{{ errorMessage }}</p>
          <button @click="loadShops" class="retry-btn">
            <span>🔄</span>
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredShops.length === 0 && !isLoading" class="empty-container">
        <div class="empty-card">
          <div class="empty-icon">
            <span>{{ searchQuery || showActiveOnly ? '🔍' : '🏪' }}</span>
          </div>
          <h3 class="empty-title">
            {{ searchQuery || showActiveOnly ? 'No Shops Found' : 'No Partner Shops Yet' }}
          </h3>
          <p class="empty-description">
            {{
              searchQuery || showActiveOnly
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'We\'re currently building our network of trusted health and wellness partners. Check back soon!'
            }}
          </p>
          <button
            v-if="searchQuery || showActiveOnly"
            @click="clearFilters"
            class="clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Shops Grid -->
      <div v-else class="shops-grid">
        <div
          v-for="shop in filteredShops"
          :key="shop.id"
          class="shop-card"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div class="header-decoration">
              <span class="header-icon">🏪</span>
            </div>
            <div class="status-badge" :class="{ active: shop.is_active }">
              <div class="status-dot"></div>
              <span>{{ shop.is_active ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <h2 class="shop-name">{{ shop.shop_name }}</h2>

            <div class="info-section">
              <div class="info-item">
                <span class="info-icon">👤</span>
                <div class="info-content">
                  <span class="info-label">Owner</span>
                  <span class="info-value">{{ shop.user?.username || 'Unknown' }}</span>
                </div>
              </div>

              <div class="info-item">
                <span class="info-icon">📧</span>
                <div class="info-content">
                  <span class="info-label">Contact</span>
                  <span class="info-value">{{ shop.user?.email || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="description-section">
              <h3 class="description-label">
                <span class="description-icon">📝</span>
                About
              </h3>
              <p class="description-text">{{ shop.description }}</p>
            </div>

            <div class="card-footer">
              <div class="footer-item">
                <span class="footer-icon">📅</span>
                <span class="footer-text">Est. {{ formatDate(shop.created_at) }}</span>
              </div>
              <div class="footer-item">
                <span class="footer-icon">🆔</span>
                <span class="footer-text">ID: {{ shop.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useNotification } from '@/composables'

const { error: showError } = useNotification()

const shops = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const showActiveOnly = ref(false)

// Computed filtered shops
const filteredShops = computed(() => {
  let filtered = shops.value

  // Filter by active status
  if (showActiveOnly.value) {
    filtered = filtered.filter(shop => shop.is_active)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(shop => {
      const shopName = shop.shop_name?.toLowerCase() || ''
      const ownerName = shop.user?.username?.toLowerCase() || ''
      const description = shop.description?.toLowerCase() || ''
      return shopName.includes(query) || ownerName.includes(query) || description.includes(query)
    })
  }

  return filtered
})

onMounted(() => {
  loadShops()
})

async function loadShops() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.getAllShops()
    shops.value = Array.isArray(response) ? response : []
  } catch (err) {
    console.error('Error loading shops:', err)
    errorMessage.value = err.message || 'Failed to load shops. Please try again later.'
    showError(errorMessage.value)
    shops.value = []
  } finally {
    isLoading.value = false
  }
}

function clearFilters() {
  searchQuery.value = ''
  showActiveOnly.value = false
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<style scoped>
/* Page Layout */
.shops-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 60px 20px 40px;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.icon-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.hero-icon {
  font-size: 64px;
  display: block;
  position: relative;
  z-index: 1;
  animation: float 3s ease-in-out infinite;
}

.hero-title {
  font-size: 72px;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.gradient-text {
  background: linear-gradient(to right, #ffd89b, #19547b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -100px;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: 20%;
  animation: float 7s ease-in-out infinite;
}

/* Container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}

/* Filter Bar */
.filter-bar {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-wrapper {
  flex: 1;
  min-width: 250px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 20px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 48px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.filter-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.filter-icon {
  font-size: 16px;
}

.results-count {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.count-number {
  font-size: 24px;
  font-weight: 700;
}

.count-label {
  font-size: 14px;
  font-weight: 500;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.spinner-large {
  width: 64px;
  height: 64px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

.loading-text {
  font-size: 18px;
  color: white;
  font-weight: 500;
}

/* Error State */
.error-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.error-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.error-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.error-title {
  font-size: 24px;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 12px;
}

.error-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Empty State */
.empty-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.empty-card {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.empty-icon {
  font-size: 96px;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

.empty-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.empty-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.clear-filters-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Shops Grid */
.shops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .shops-grid {
    grid-template-columns: 1fr;
  }
}

/* Shop Card */
.shop-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.shop-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

/* Card Header */
.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 100px;
}

.header-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.1;
}

.header-icon {
  font-size: 80px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.9);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  animation: pulse 2s ease-in-out infinite;
}

/* Card Body */
.card-body {
  padding: 24px;
}

.shop-name {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.3;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4ff 0%, #fff0f6 100%);
  border-radius: 10px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.description-section {
  margin-bottom: 20px;
}

.description-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.description-icon {
  font-size: 18px;
}

.description-text {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
}

.footer-icon {
  font-size: 16px;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-actions {
    flex-direction: column;
    width: 100%;
  }

  .filter-btn,
  .results-count {
    width: 100%;
    justify-content: center;
  }
}
</style>
