<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          GuestBook
        </h1>
        <p class="text-xl text-gray-600">
          Share your experience with our Health Store community
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Leave Your Message</h2>
          <form @submit.prevent="submitEntry" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="John Doe"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="john@example.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                v-model="form.message"
                placeholder="Share your thoughts about our store..."
                rows="5"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Message' }}
            </button>

            <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {{ successMessage }}
            </div>

            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {{ errorMessage }}
            </div>
          </form>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Recent Messages</h2>
          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div v-if="entries.length === 0" class="text-gray-500 text-center py-8">
              No messages yet. Be the first to leave a message!
            </div>

            <div
              v-for="entry in entries"
              :key="entry.id"
              class="border-l-4 border-blue-500 pl-4 py-2"
            >
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-semibold text-gray-900">{{ entry.name }}</h3>
                <span class="text-xs text-gray-500">
                  {{ formatDate(entry.created_at) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ entry.email }}</p>
              <p class="text-gray-700">{{ entry.message }}</p>
            </div>
          </div>
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

const form = ref({
  name: '',
  email: '',
  message: '',
})

const entries = ref([])
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await api.getShops()
    if (response && Array.isArray(response)) {
      entries.value = []
    }
  } catch (error) {
    console.error('Error loading guestbook:', error)
  }
})

async function submitEntry() {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await api.createGuestbookEntry({
      name: form.value.name,
      email: form.value.email,
      message: form.value.message,
    })

    successMessage.value = 'Thank you! Your message has been submitted.'
    form.value = { name: '', email: '', message: '' }

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    errorMessage.value = error.message || 'Failed to submit message. Please try again.'
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
