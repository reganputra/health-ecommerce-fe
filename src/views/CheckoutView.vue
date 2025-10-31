<template>
  <div class="checkout-view">
    <h1>Checkout</h1>

    <div v-if="loading" class="loading">Processing...</div>

    <div v-else class="checkout-content">
      <div class="payment-section">
        <h2>Payment Information</h2>

        <form @submit.prevent="handlePlaceOrder">
          <div class="form-group">
            <label for="payment_method">Payment Method *</label>
            <select id="payment_method" v-model="form.payment_method" required>
              <option value="">Select payment method</option>
              <option value="paypal">PayPal</option>
              <option value="debit">Debit Card</option>
              <option value="cc">Credit Card</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>

          <div
            v-if="form.payment_method === 'debit' || form.payment_method === 'cc'"
            class="form-group"
          >
            <label for="bank_name">Bank Name</label>
            <input
              id="bank_name"
              v-model="form.bank_name"
              type="text"
              placeholder="Enter your bank name"
            />
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-primary btn-large" :disabled="submitting">
            {{ submitting ? 'Placing Order...' : 'Place Order' }}
          </button>
        </form>
      </div>

      <div class="order-summary">
        <h2>Order Summary</h2>

        <div v-if="cartStore.cart" class="summary-items">
          <div
            v-for="item in cartStore.cart.items"
            :key="item.id"
            class="summary-item"
          >
            <span>{{ item.product.name }} x{{ item.quantity }}</span>
            <span>${{ (item.product.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <div class="summary-total">
          <span>Total</span>
          <span>${{ cartStore.total.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import api from '@/services/api'

const router = useRouter()
const cartStore = useCartStore()

const loading = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

const form = ref({
  payment_method: '',
  bank_name: '',
})

onMounted(async () => {
  if (!cartStore.cart) {
    await cartStore.fetchCart()
  }

  if (!cartStore.cart || cartStore.cart.items.length === 0) {
    alert('Your cart is empty')
    router.push('/products')
  }
})

async function handlePlaceOrder() {
  try {
    submitting.value = true
    errorMessage.value = ''

    await api.placeOrder(form.value.payment_method, form.value.bank_name)

    cartStore.clearCart()

    alert('Order placed successfully!')
    router.push('/orders')
  } catch (error) {
    errorMessage.value = error.message || 'Failed to place order. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.checkout-view {
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
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #666;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
}

.payment-section,
.order-summary {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

input,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus,
select:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

.btn-primary {
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-large {
  width: 100%;
  padding: 16px;
  font-size: 18px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.summary-items {
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #eee;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 2px solid #eee;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

@media (max-width: 968px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}
</style>
