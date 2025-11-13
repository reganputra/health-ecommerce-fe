<template>
  <div class="cart-view">
    <h1>Shopping Cart</h1>

    <div v-if="cartStore.loading" class="loading">
      <div class="spinner"></div>
      <p>Loading your cart...</p>
    </div>

    <div v-else-if="cartStore.error" class="error">
      <div class="error-icon">⚠️</div>
      <p>{{ cartStore.error }}</p>
      <button @click="cartStore.fetchCart()" class="btn-secondary">Try Again</button>
    </div>

    <div v-else-if="!cartStore.cart || cartStore.cart.items.length === 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added any items to your cart yet.</p>
      <button @click="goToProducts" class="btn-primary">Start Shopping</button>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div
          v-for="item in cartStore.cart.items"
          :key="item.id"
          class="cart-item"
        >
          <img
            :src="item.product.image_url"
            :alt="item.product.name"
            class="item-image"
            @error="handleImageError"
          />
          <div class="item-info">
            <h3>{{ item.product.name }}</h3>
            <p class="description">{{ item.product.description }}</p>
            <div class="item-details">
              <span class="price">${{ item.product.price.toFixed(2) }}</span>
              <span class="quantity">Quantity: {{ item.quantity }}</span>
              <span class="subtotal">
                Subtotal: ${{ (item.product.price * item.quantity).toFixed(2) }}
              </span>
            </div>
          </div>
          <button
            @click="removeItem(item.id)"
            class="remove-button"
            :disabled="removingItem === item.id"
          >
            {{ removingItem === item.id ? 'Removing...' : 'Remove' }}
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Items ({{ cartStore.itemCount }})</span>
          <span>${{ cartStore.total.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>${{ cartStore.total.toFixed(2) }}</span>
        </div>
        <button @click="proceedToCheckout" class="btn-primary btn-large">
          Proceed to Checkout
        </button>
        <button @click="goToProducts" class="btn-secondary btn-large">
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useNotification } from '@/composables'

const router = useRouter()
const cartStore = useCartStore()
const { error } = useNotification()

const removingItem = ref(null)

onMounted(async () => {
  await cartStore.fetchCart()
})

function handleImageError(event) {
  event.target.src = 'https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=200'
}

async function removeItem(itemId) {
  try {
    removingItem.value = itemId
    await cartStore.removeFromCart(itemId)
  } catch (err) {
    error(err.message)
  } finally {
    removingItem.value = null
  }
}

function goToProducts() {
  router.push('/products')
}

function proceedToCheckout() {
  router.push('/checkout')
}
</script>

<style scoped>
.cart-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  margin: 0 0 32px 0;
  font-size: 36px;
  color: #333;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  font-size: 18px;
  color: #666;
  margin: 0;
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: #fff5f5;
  border-radius: 12px;
  border: 2px dashed #fcc;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error p {
  color: #c33;
  font-size: 18px;
  margin: 0 0 24px 0;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
  background: linear-gradient(135deg, #f5f7ff 0%, #fef5ff 100%);
  border-radius: 16px;
  border: 2px dashed #d0d7ff;
}

.empty-icon {
  font-size: 120px;
  margin-bottom: 24px;
  opacity: 0.8;
}

.empty-cart h2 {
  font-size: 28px;
  color: #333;
  margin: 0 0 12px 0;
}

.empty-cart p {
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
  max-width: 400px;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 32px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  background: #f5f5f5;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.description {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.item-details {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 14px;
}

.price {
  color: #667eea;
  font-weight: 600;
  font-size: 16px;
}

.quantity {
  color: #666;
}

.subtotal {
  color: #333;
  font-weight: 600;
}

.remove-button {
  padding: 8px 16px;
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  height: fit-content;
}

.remove-button:hover:not(:disabled) {
  background: #fdd;
}

.remove-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-summary {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.cart-summary h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  color: #666;
  font-size: 14px;
}

.summary-row.total {
  border-top: 2px solid #eee;
  margin-top: 12px;
  padding-top: 20px;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.btn-primary,
.btn-secondary {
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-large {
  width: 100%;
  margin-top: 16px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #f5f7ff;
}

@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }
}
</style>
