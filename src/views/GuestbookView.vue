<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Guestbook
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Leave a message for our community.
        </p>
      </div>

      <div class="grid gap-12 md:grid-cols-2">
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Leave a Message</h2>
          <form @submit.prevent="submitEntry" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" v-model="form.name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" v-model="form.email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div>
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" v-model="form.message" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required></textarea>
            </div>
            <button type="submit" :disabled="isSubmitting" class="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50">
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
            <p v-if="successMessage" class="text-green-600">{{ successMessage }}</p>
            <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
          </form>
        </div>

        <div v-if="isAdmin" class="bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Guestbook Entries</h2>
          <div v-if="isLoading" class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading entries...</p>
          </div>
          <div v-else-if="entries.length === 0" class="text-center text-gray-500">
            No entries yet.
          </div>
          <div v-else class="space-y-4">
            <div v-for="entry in entries" :key="entry.id" class="border-l-4 border-indigo-500 pl-4">
              <p class="font-semibold">{{ entry.name }} <span class="text-sm text-gray-500">({{ entry.email }})</span></p>
              <p class="text-gray-700">{{ entry.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(entry.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 'admin')

const form = ref({
  name: '',
  email: '',
  message: '',
})

const entries = ref([])
const isSubmitting = ref(false)
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const fetchEntries = async () => {
  if (isAdmin.value) {
    isLoading.value = true
    try {
      const response = await api.getGuestbookEntries()
      entries.value = Array.isArray(response.entries) ? response.entries : []
    } catch (error) {
      console.error('Error loading guestbook entries:', error)
      entries.value = []
    } finally {
      isLoading.value = false
    }
  }
}

onMounted(fetchEntries)

const submitEntry = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await api.createGuestbookEntry(form.value)
    successMessage.value = 'Your message has been submitted!'
    form.value = { name: '', email: '', message: '' }
    if (isAdmin.value) {
      fetchEntries()
    }
  } catch (error) {
    errorMessage.value = 'Failed to submit your message. Please try again.'
    console.error('Error submitting guestbook entry:', error)
  } finally {
    isSubmitting.value = false
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
