<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Manage Shops</h2>

      <div class="mb-6 flex gap-4">
        <select
          v-model="selectedStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          @click="loadRequests"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="requests.length === 0" class="text-center py-8 text-gray-500">
        No shop requests found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-4 py-3 text-left font-semibold">Shop Name</th>
              <th class="px-4 py-3 text-left font-semibold">Admin</th>
              <th class="px-4 py-3 text-left font-semibold">Status</th>
              <th class="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request.id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3">
                <div>
                  <p class="font-semibold text-gray-900">{{ request.shop_name }}</p>
                  <p class="text-xs text-gray-600">{{ request.description }}</p>
                </div>
              </td>
              <td class="px-4 py-3">
                <div>
                  <p class="font-medium">{{ request.username }}</p>
                  <p class="text-xs text-gray-600">{{ request.email }}</p>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                    request.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                    request.status === 'approved' && 'bg-green-100 text-green-800',
                    request.status === 'rejected' && 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    v-if="request.status === 'pending'"
                    @click="approveRequest(request.id)"
                    class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    v-if="request.status === 'pending'"
                    @click="showRejectModal(request.id)"
                    class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showReject" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Reject Request</h3>
        <textarea
          v-model="rejectionReason"
          placeholder="Enter rejection reason (optional)"
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <div class="flex gap-3">
          <button
            @click="rejectRequest"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reject
          </button>
          <button
            @click="showReject = false"
            class="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showNotification } = useNotification()

const requests = ref([])
const isLoading = ref(false)
const selectedStatus = ref('')
const showReject = ref(false)
const rejectingRequestId = ref(null)
const rejectionReason = ref('')

onMounted(() => {
  loadRequests()
})

async function loadRequests() {
  isLoading.value = true
  try {
    const response = await api.getShopRequests(selectedStatus.value || null)
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
</script>
