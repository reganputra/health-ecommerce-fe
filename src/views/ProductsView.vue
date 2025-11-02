<template>
  <div class="products-view">
    <div class="products-header">
      <h1>Health Products</h1>
      <div class="filters">
        <input
          v-model="productsStore.searchQuery"
          type="search"
          placeholder="Search products..."
          class="search-input"
        />
        <select v-model="productsStore.selectedCategory" class="category-filter">
          <option :value="null">All Categories</option>
          <option
            v-for="category in productsStore.categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="productsStore.loading" class="loading">Loading products...</div>

    <div v-else-if="productsStore.error" class="error">
      {{ productsStore.error }}
    </div>

    <div v-else-if="productsStore.filteredProducts.length === 0" class="empty">
      No products found
    </div>

    <div v-else class="products-grid">
      <div
        v-for="product in productsStore.filteredProducts"
        :key="product.id"
        class="product-card"
      >
        <img
          :src="product.image_url"
          :alt="product.name"
          class="product-image"
          @error="handleImageError"
        />
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="description">{{ truncateDescription(product.description) }}</p>
          <div class="product-footer">
            <span class="price">${{ product.price.toFixed(2) }}</span>
            <span class="stock" :class="{ 'low-stock': product.stock < 10 }">
              {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
            </span>
          </div>
          <div class="actions">
            <button
              @click="viewProduct(product.id)"
              class="btn-secondary"
            >
              View Details
            </button>
            <button
              @click="addToCart(product.id)"
              class="btn-primary"
              :disabled="product.stock === 0 || addingToCart === product.id"
            >
              {{ addingToCart === product.id ? 'Adding...' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useNotification } from '@/composables'

const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const { error } = useNotification()

const addingToCart = ref(null)

onMounted(async () => {
  await Promise.all([
    productsStore.fetchProducts(),
    productsStore.fetchCategories(),
  ])
})

function truncateDescription(description) {
  if (description.length > 100) {
    return description.substring(0, 100) + '...'
  }
  return description
}

function handleImageError(event) {
  event.target.src = 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=400'
}

function viewProduct(id) {
  router.push(`/products/${id}`)
}

async function addToCart(productId) {
  try {
    addingToCart.value = productId
    await cartStore.addToCart(productId, 1)
  } catch (err) {
    error(err.message)
  } finally {
    addingToCart.value = null
  }
}
</script>

<style scoped>
.products-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.products-header {
  margin-bottom: 40px;
}

h1 {
  margin: 0 0 24px 0;
  font-size: 36px;
  color: #333;
}

.filters {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.search-input,
.category-filter {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.category-filter {
  min-width: 200px;
}

.search-input:focus,
.category-filter:focus {
  outline: none;
  border-color: #667eea;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #c33;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f5f5f5;
}

.product-info {
  padding: 20px;
}

h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.stock {
  font-size: 12px;
  color: #4caf50;
  font-weight: 500;
}

.stock.low-stock {
  color: #ff9800;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #f5f7ff;
}
</style>
