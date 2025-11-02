<template>
  <div class="orders-admin">
    <h2>Manage Orders</h2>

    <DataTable
      :columns="columns"
      :data="orders"
      :loading="loading"
    >
      <template #cell-total_price="{ value }">
        ${{ value.toFixed(2) }}
      </template>

      <template #cell-status="{ value }">
        <span class="status-badge" :class="`status-${value}`">
          {{ value }}
        </span>
      </template>

      <template #cell-created_at="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #cell-actions="{ row }">
        <select
          :value="row.status"
          @change="handleStatusChange(row.id, $event.target.value)"
          class="status-select"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import DataTable from '@/components/common/DataTable.vue'
import { useNotification } from '@/composables'

const orders = ref([])
const loading = ref(false)
const { success, error } = useNotification()

const columns = [
  { key: 'id', label: 'Order ID' },
  { key: 'user_id', label: 'User ID' },
  { key: 'total_price', label: 'Total' },
  { key: 'payment_method', label: 'Payment' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Date' },
  { key: 'actions', label: 'Actions' },
]

onMounted(() => {
  fetchOrders()
})

async function fetchOrders() {
  try {
    loading.value = true
    orders.value = await api.getAllOrders()
  } catch (err) {
    error(err.message)
  } finally {
    loading.value = false
  }
}

async function handleStatusChange(orderId, newStatus) {
  try {
    await api.updateOrderStatus(orderId, newStatus)
    await fetchOrders()
    success('Order status updated successfully')
  } catch (err) {
    error(err.message)
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
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

.status-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}
</style>
