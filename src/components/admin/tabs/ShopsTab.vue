<template>
  <div class="shops-admin">
    <div class="section-header">
      <h2>Manage Shop Requests</h2>
      <button @click="handleAdd" class="btn-primary">Add Shop Request</button>
    </div>

    <div class="filters">
      <select
        v-model="selectedStatus"
        @change="loadRequests"
        class="filter-select"
      >
        <option value="">All Requests</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <DataTable
      :columns="columns"
      :data="requests"
      :loading="isLoading"
    >
      <template #cell-shop_name="{ row }">
        <div>
          <p class="font-medium">{{ row.shop_name }}</p>
          <p class="text-xs text-gray-500">{{ row.description }}</p>
        </div>
      </template>

      <template #cell-username="{ row }">
        <div>
          <p class="font-medium">{{ row.username }}</p>
          <p class="text-xs text-gray-500">{{ row.email }}</p>
        </div>
      </template>

      <template #cell-status="{ value }">
        <span
          :class="[
            'status-badge',
            value === 'pending' && 'status-pending',
            value === 'approved' && 'status-approved',
            value === 'rejected' && 'status-rejected',
          ]"
        >
          {{ value.charAt(0).toUpperCase() + value.slice(1) }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="actions">
          <button
            v-if="row.status === 'pending'"
            @click="approveRequest(row.id)"
            class="btn-approve"
          >
            Approve
          </button>
          <button
            v-if="row.status === 'pending'"
            @click="showRejectModal(row.id)"
            class="btn-reject"
          >
            Reject
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Reject Modal -->
    <div v-if="showReject" class="modal-overlay" @click="showReject = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Reject Shop Request</h3>
        <textarea
          v-model="rejectionReason"
          placeholder="Enter rejection reason (optional)"
          rows="4"
          class="modal-textarea"
        ></textarea>
        <div class="modal-actions">
          <button @click="rejectRequest" class="btn-reject">
            Reject
          </button>
          <button @click="showReject = false" class="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Create Shop Request Form -->
    <ShopRequestForm
      v-model="showCreateForm"
      @save="handleCreateRequest"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useNotification, useConfirm } from '@/composables'
import DataTable from '@/components/common/DataTable.vue'
import ShopRequestForm from '@/components/admin/forms/ShopRequestForm.vue'

const { showNotification } = useNotification()
const { confirm } = useConfirm()

const requests = ref([])
const isLoading = ref(false)
const selectedStatus = ref('')
const showReject = ref(false)
const rejectingRequestId = ref(null)
const rejectionReason = ref('')
const showCreateForm = ref(false)

const columns = [
  { key: 'shop_name', label: 'Shop Name' },
  { key: 'username', label: 'Admin' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

onMounted(() => {
  loadRequests()
})

async function loadRequests() {
  isLoading.value = true
  try {
    const response = await api.getAllShopRequests(selectedStatus.value || null)
    requests.value = Array.isArray(response) ? response : []
  } catch (error) {
    showNotification('Error loading shop requests', 'error')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function approveRequest(requestId) {
  try {
    await api.approveShopRequest(requestId)
    showNotification('Shop request approved successfully', 'success')
    await loadRequests()
  } catch (error) {
    showNotification('Error approving request', 'error')
    console.error(error)
  }
}

function showRejectModal(requestId) {
  rejectingRequestId.value = requestId
  rejectionReason.value = ''
  showReject.value = true
}

async function rejectRequest() {
  try {
    await api.rejectShopRequest(rejectingRequestId.value, rejectionReason.value)
    showNotification('Shop request rejected', 'success')
    showReject.value = false
    await loadRequests()
  } catch (error) {
    showNotification('Error rejecting request', 'error')
    console.error(error)
  }
}

async function handleCreateRequest(formData) {
  try {
    await api.createShopRequest(formData)
    showNotification('Shop request created successfully', 'success')
    showCreateForm.value = false
    await loadRequests()
  } catch (error) {
    showNotification('Error creating shop request', 'error')
    console.error(error)
  }
}

function handleAdd() {
  showCreateForm.value = true
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.filters {
  margin-bottom: 16px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}

.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-rejected {
  background: #fee2e2;
  color: #dc2626;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-approve,
.btn-reject,
.btn-cancel {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-approve {
  background: #d1fae5;
  color: #065f46;
  font-size: 13px;
  padding: 6px 12px;
}

.btn-approve:hover {
  background: #a7f3d0;
}

.btn-reject {
  background: #fee2e2;
  color: #dc2626;
  font-size: 13px;
  padding: 6px 12px;
}

.btn-reject:hover {
  background: #fecaca;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.modal-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
