<template>
  <div class="orders-view">
    <h1>My Orders</h1>

    <div v-if="loading" class="loading">Loading orders...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="orders.length === 0" class="empty">
      <p>You haven't placed any orders yet</p>
      <button @click="goToProducts" class="btn-primary">Start Shopping</button>
    </div>

    <div v-else class="orders-list">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
        @click="viewOrder(order.id)"
      >
        <div class="order-header">
          <div>
            <h3>Order #{{ order.id }}</h3>
            <p class="order-date">{{ formatDate(order.created_at) }}</p>
          </div>
          <span class="status-badge" :class="`status-${order.status}`">
            {{ order.status }}
          </span>
        </div>

        <div class="order-details">
          <div class="detail-item">
            <span class="label">Total:</span>
            <span class="value">${{ order.total_price.toFixed(2) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Payment:</span>
            <span class="value">{{ formatPaymentMethod(order.payment_method) }}</span>
          </div>
        </div>

        <div class="order-actions">
          <button
            v-if="canDownloadReceipt(order.status)"
            @click.stop="downloadReceipt(order.id)"
            class="btn-receipt"
            :disabled="downloadingReceipt === order.id"
          >
            {{ downloadingReceipt === order.id ? 'Downloading...' : '📄 Download Receipt' }}
          </button>
          <button
            v-if="order.status === 'pending' || order.status === 'paid'"
            @click.stop="cancelOrder(order.id)"
            class="btn-cancel"
            :disabled="cancelingOrder === order.id"
          >
            {{ cancelingOrder === order.id ? 'Canceling...' : 'Cancel Order' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification, useConfirm } from '@/composables'
import api from '@/services/api'

const router = useRouter()
const { success, error: notifyError } = useNotification()
const { confirm } = useConfirm()

const orders = ref([])
const loading = ref(false)
const error = ref(null)
const cancelingOrder = ref(null)
const downloadingReceipt = ref(null)

onMounted(async () => {
  await fetchOrders()
})

async function fetchOrders() {
  try {
    loading.value = true
    error.value = null

    const response = await api.getOrders()
    orders.value = response.orders || []
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatPaymentMethod(method) {
  const methods = {
    paypal: 'PayPal',
    debit: 'Debit Card',
    cc: 'Credit Card',
    cod: 'Cash on Delivery',
  }
  return methods[method] || method
}

function goToProducts() {
  router.push('/products')
}

function viewOrder(id) {
  router.push(`/orders/${id}`)
}

function canDownloadReceipt(status) {
  // Receipt is available for paid, shipped, and delivered orders
  // Not available for pending (not yet paid) or cancelled orders
  const allowedStatuses = ['paid', 'shipped', 'delivered']
  return allowedStatuses.includes(status)
}

async function cancelOrder(id) {
  const confirmed = await confirm({
    title: 'Cancel Order',
    message: 'Are you sure you want to cancel this order? This action cannot be undone.',
    confirmText: 'Yes, Cancel Order',
    cancelText: 'Keep Order',
    variant: 'danger'
  })

  if (!confirmed) {
    return
  }

  try {
    cancelingOrder.value = id
    await api.cancelOrder(id)
    await fetchOrders()
    success('Order canceled successfully')
  } catch (err) {
    notifyError(err.message)
  } finally {
    cancelingOrder.value = null
  }
}

async function downloadReceipt(id) {
  try {
    downloadingReceipt.value = id
    await api.downloadOrderReceipt(id)
    success('Receipt downloaded successfully')
  } catch (err) {
    notifyError(err.message || 'Failed to download receipt')
  } finally {
    downloadingReceipt.value = null
  }
}
</script>

<style scoped>
.orders-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  margin: 0 0 32px 0;
  font-size: 36px;
  color: #333;
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

.empty p {
  margin-bottom: 24px;
  font-size: 20px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.order-header h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #333;
}

.order-date {
  margin: 0;
  color: #999;
  font-size: 14px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pending {
  background: #fff3e0;
  color: #e65100;
}

.status-paid {
  background: #e3f2fd;
  color: #0277bd;
}

.status-shipped {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-cancelled {
  background: #ffebee;
  color: #c62828;
}

.order-details {
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  gap: 8px;
}

.label {
  color: #999;
  font-size: 14px;
}

.value {
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-receipt {
  padding: 8px 16px;
  background: #e3f2fd;
  color: #0277bd;
  border: 1px solid #bbdefb;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-receipt:hover:not(:disabled) {
  background: #bbdefb;
}

.btn-receipt:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 8px 16px;
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover:not(:disabled) {
  background: #ffcdd2;
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>
