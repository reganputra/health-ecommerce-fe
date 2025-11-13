<template>
  <div>
    <Card>
      <Title>Manage Shops</Title>

      <div class="mb-6 flex gap-4">
        <select
          v-model="selectedStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          @change="loadRequests"
        >
          <option value="">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <Button @click="loadRequests" :loading="isLoading">
          Refresh
        </Button>
      </div>

      <div v-if="isLoading" class="text-center py-8">
        <Spinner />
      </div>

      <div v-else-if="requests.length === 0" class="text-center py-8 text-gray-500">
        No shop requests found.
      </div>

      <div v-else class="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Shop Name</TableHeader>
              <TableHeader>Admin</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow v-for="request in requests" :key="request.id">
              <TableCell>
                <div>
                  <p class="font-semibold text-gray-900">{{ request.shop_name }}</p>
                  <p class="text-xs text-gray-600">{{ request.description }}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p class="font-medium">{{ request.username }}</p>
                  <p class="text-xs text-gray-600">{{ request.email }}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="statusVariant(request.status)">
                  {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button
                    v-if="request.status === 'pending'"
                    @click="approveRequest(request.id)"
                    variant="success"
                    size="sm"
                  >
                    Approve
                  </Button>
                  <Button
                    v-if="request.status === 'pending'"
                    @click="showRejectModal(request.id)"
                    variant="danger"
                    size="sm"
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>

    <Modal :show="showReject" @close="showReject = false">
      <div class="p-6">
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
import Card from '@/components/ui/Card.vue'
import Title from '@/components/ui/Title.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@/components/ui/Table.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'

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

function statusVariant(status) {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'approved':
      return 'success'
    case 'rejected':
      return 'danger'
    default:
      return 'secondary'
  }
}
</script>
