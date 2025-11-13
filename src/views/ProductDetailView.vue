<template>
  <div class="product-detail-view">
    <div v-if="loading" class="loading">Loading product...</div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="goBack" class="btn-secondary">Go Back</button>
    </div>

    <div v-else-if="product" class="product-detail">
      <button @click="goBack" class="back-button">&larr; Back to Products</button>

      <div class="detail-content">
        <div class="image-section">
          <img
            :src="product.image_url"
            :alt="product.name"
            class="product-image"
            @error="handleImageError"
          />
        </div>

        <div class="info-section">
          <h1>{{ product.name }}</h1>
          <p class="description">{{ product.description }}</p>

          <div class="price-stock">
            <span class="price">${{ product.price.toFixed(2) }}</span>
            <span class="stock" :class="{ 'low-stock': product.stock < 10 }">
              {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
            </span>
          </div>

          <div class="quantity-selector">
            <label for="quantity">Quantity:</label>
            <input
              id="quantity"
              v-model.number="quantity"
              type="number"
              min="1"
              :max="product.stock"
              :disabled="product.stock === 0"
            />
          </div>

          <button
            @click="addToCart"
            class="btn-primary btn-large"
            :disabled="product.stock === 0 || addingToCart"
          >
            {{ addingToCart ? 'Adding to Cart...' : 'Add to Cart' }}
          </button>

          <div class="feedback-section">
            <h2>Customer Reviews</h2>
            <div v-if="feedbacks.length > 0" class="rating-summary">
              <div class="average-rating">
                <span class="rating-value">{{ averageRating }}</span>
                <span class="rating-stars">{{ averageStars }}</span>
                <span class="review-count">{{ feedbacks.length }} {{ feedbacks.length === 1 ? 'review' : 'reviews' }}</span>
              </div>
            </div>

            <button @click="showFeedbackForm = !showFeedbackForm" class="btn-secondary">
              {{ showFeedbackForm ? 'Cancel' : 'Write a Review' }}
            </button>

            <div v-if="showFeedbackForm" class="feedback-form">
              <textarea
                v-model="feedbackForm.comment"
                placeholder="Share your experience with this product..."
                rows="4"
              ></textarea>
              <div class="rating-input">
                <label>Rating:</label>
                <select v-model.number="feedbackForm.rating">
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <button @click="submitFeedback" class="btn-primary" :disabled="submittingFeedback">
                {{ submittingFeedback ? 'Submitting...' : 'Submit Review' }}
              </button>
            </div>

            <div class="reviews-list">
              <div v-if="loadingFeedbacks" class="loading-reviews">Loading reviews...</div>
              <div v-else-if="feedbacks.length === 0" class="no-reviews">
                No reviews yet. Be the first to review this product!
              </div>
              <div v-else class="review-items">
                <div v-for="feedback in feedbacks" :key="feedback.id" class="review-item">
                  <div class="review-header">
                    <span class="reviewer-name">{{ feedback.user.username }}</span>
                    <span class="review-rating">{{ '★'.repeat(feedback.rating) }}{{ '☆'.repeat(5 - feedback.rating) }}</span>
                  </div>
                  <p class="review-comment">{{ feedback.comment }}</p>
                  <span class="review-date">{{ formatDate(feedback.createdAt) }}</span>
                </div>
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
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { success, warning, error: notifyError } = useNotification()

const product = ref(null)
const loading = ref(false)
const error = ref(null)
const quantity = ref(1)
const addingToCart = ref(false)
const showFeedbackForm = ref(false)
const submittingFeedback = ref(false)
const feedbacks = ref([])
const loadingFeedbacks = ref(false)

const feedbackForm = ref({
  comment: '',
  rating: 5,
})

const averageRating = computed(() => {
  if (feedbacks.value.length === 0) return 0
  const sum = feedbacks.value.reduce((acc, f) => acc + f.rating, 0)
  return (sum / feedbacks.value.length).toFixed(1)
})

const averageStars = computed(() => {
  const rating = parseFloat(averageRating.value)
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return '★'.repeat(fullStars) + (hasHalfStar ? '⯨' : '') + '☆'.repeat(emptyStars)
})

onMounted(async () => {
  await fetchProduct()
  await fetchFeedbacks()
})

async function fetchProduct() {
  try {
    loading.value = true
    error.value = null
    product.value = await productsStore.fetchProduct(route.params.id)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function handleImageError(event) {
  event.target.src = 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=600'
}

function goBack() {
  router.push('/products')
}

async function addToCart() {
  if (!authStore.isAuthenticated) {
    warning('Please login to add items to cart')
    router.push('/login')
    return
  }

  try {
    addingToCart.value = true
    await cartStore.addToCart(product.value.id, quantity.value)
    success('Added to cart successfully!')
    quantity.value = 1
  } catch (err) {
    notifyError(err.message)
  } finally {
    addingToCart.value = false
  }
}

async function fetchFeedbacks() {
  try {
    loadingFeedbacks.value = true
    const data = await api.getProductFeedback(route.params.id)
    feedbacks.value = data.feedbacks || []
  } catch (err) {
    console.error('Error loading feedbacks:', err)
    feedbacks.value = []
  } finally {
    loadingFeedbacks.value = false
  }
}

async function submitFeedback() {
  if (!authStore.isAuthenticated) {
    warning('Please login to submit a review')
    router.push('/login')
    return
  }

  if (!feedbackForm.value.comment.trim()) {
    warning('Please write a comment')
    return
  }

  try {
    submittingFeedback.value = true
    await api.submitFeedback(
      product.value.id,
      feedbackForm.value.comment,
      feedbackForm.value.rating
    )
    success('Review submitted successfully!')
    feedbackForm.value.comment = ''
    feedbackForm.value.rating = 5
    showFeedbackForm.value = false
    // Refresh feedbacks to show the new review
    await fetchFeedbacks()
  } catch (err) {
    notifyError(err.message)
  } finally {
    submittingFeedback.value = false
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.product-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
}

.error {
  color: #c33;
}

.back-button {
  background: none;
  border: none;
  color: #667eea;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 24px;
  padding: 8px 0;
  transition: color 0.2s;
}

.back-button:hover {
  color: #764ba2;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.image-section {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.product-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.info-section h1 {
  margin: 0 0 16px 0;
  font-size: 32px;
  color: #333;
}

.description {
  margin: 0 0 32px 0;
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

.price-stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
}

.price {
  font-size: 32px;
  font-weight: 700;
  color: #667eea;
}

.stock {
  font-size: 14px;
  color: #4caf50;
  font-weight: 500;
}

.stock.low-stock {
  color: #ff9800;
}

.quantity-selector {
  margin-bottom: 24px;
}

.quantity-selector label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.quantity-selector input {
  width: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.btn-primary,
.btn-secondary {
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-large {
  width: 100%;
  padding: 16px;
  font-size: 18px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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

.feedback-section {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #eee;
}

.feedback-section h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #333;
}

.feedback-form {
  margin-top: 16px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.feedback-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
}

.rating-input {
  margin-bottom: 16px;
}

.rating-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.rating-input select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.rating-summary {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-value {
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
}

.rating-stars {
  color: #ffc107;
  font-size: 24px;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.reviews-list {
  margin-top: 24px;
}

.loading-reviews,
.no-reviews {
  text-align: center;
  padding: 32px;
  color: #666;
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  padding: 16px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reviewer-name {
  font-weight: 600;
  color: #333;
}

.review-rating {
  color: #ffc107;
  font-size: 16px;
}

.review-comment {
  color: #555;
  line-height: 1.6;
  margin: 8px 0;
}

.review-date {
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .image-section {
    position: static;
  }
}
</style>
