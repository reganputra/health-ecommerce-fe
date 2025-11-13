<template>
  <div class="guestbook-admin">
    <div class="section-header">
      <h2>Manage Guestbook Entries</h2>
      <button @click="loadEntries" class="btn-primary">Refresh</button>
    </div>

    <DataTable
      :columns="columns"
      :data="entries"
      :loading="isLoading"
    >
      <template #cell-message="{ value }">
        <p class="text-sm line-clamp-2">{{ value }}</p>
      </template>

      <template #cell-created_at="{ value }">
        {{ formatDate(value) }}
      </template>

      <template #cell-actions="{ row }">
        <div class="actions">
          <button @click="deleteEntry(row.id)" class="btn-delete">Delete</button>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useNotification, useConfirm } from '@/composables'
import DataTable from '@/components/common/DataTable.vue'

const { showNotification } = useNotification()
const { confirm } = useConfirm()

const entries = ref([])
const isLoading = ref(false)

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'message', label: 'Message' },
  { key: 'created_at', label: 'Date' },
  { key: 'actions', label: 'Actions' },
]

onMounted(() => {
  loadEntries()
})

async function loadEntries() {
  isLoading.value = true
  try {
    const response = await api.getAllGuestbookEntries()
    entries.value = response.entries || []
  } catch (error) {
    showNotification('Error loading guestbook entries', 'error')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function deleteEntry(entryId) {
  const confirmed = await confirm({
    title: 'Delete Guestbook Entry',
    message: 'Are you sure you want to delete this guestbook entry? This action cannot be undone.',
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    variant: 'danger'
  })

  if (!confirmed) return

  try {
    await api.deleteGuestbookEntry(entryId)
    showNotification('Entry deleted successfully', 'success')
    await loadEntries()
  } catch (error) {
    showNotification('Error deleting entry', 'error')
    console.error(error)
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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

.actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-delete {
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

.btn-delete {
  background: #ffebee;
  color: #c62828;
  font-size: 13px;
  padding: 6px 12px;
}

.btn-delete:hover {
  background: #ffcdd2;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
