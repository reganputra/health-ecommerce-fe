<template>
  <div>
    <Card>
      <div class="flex justify-between items-center mb-6">
        <Title>GuestBook Entries</Title>
        <Button @click="loadEntries" :loading="isLoading">
          Refresh
        </Button>
      </div>

      <div v-if="isLoading" class="text-center py-8">
        <Spinner />
      </div>

      <div v-else-if="entries.length === 0" class="text-center py-8 text-gray-500">
        No guestbook entries found.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="entry in entries"
          :key="entry.id"
          class="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ entry.name }}</h3>
              <p class="text-sm text-gray-600">{{ entry.email }}</p>
            </div>
            <span class="text-xs text-gray-500">
              {{ formatDate(entry.created_at) }}
            </span>
          </div>

          <p class="text-gray-700 mb-4 leading-relaxed">{{ entry.message }}</p>

          <Button @click="deleteEntry(entry.id)" variant="danger" size="sm">
            Delete
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useNotification, useConfirm } from '@/composables'
import Card from '@/components/ui/Card.vue'
import Title from '@/components/ui/Title.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'

const { showNotification } = useNotification()
const { confirm } = useConfirm()

const entries = ref([])
const isLoading = ref(false)

onMounted(() => {
  loadEntries()
})

async function loadEntries() {
  isLoading.value = true
  try {
    const response = await api.getGuestbookEntries()
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
