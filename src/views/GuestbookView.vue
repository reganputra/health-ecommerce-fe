<template>
  <div class="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-pink-50 py-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <div class="mb-4">
          <span class="text-6xl">📖</span>
        </div>
        <h1 class="text-6xl font-extrabold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
          GuestBook
        </h1>
        <p class="text-xl text-gray-700 max-w-2xl mx-auto">
          Share your experience with our Health Store community
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 border border-purple-100">
          <h2 class="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">Leave Your Message</h2>
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

        <div class="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300 border border-blue-100">
          <h2 class="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">Recent Messages</h2>
          <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <div v-if="entries.length === 0" class="text-center py-12 bg-linear-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 p-6">
              <span class="text-5xl mb-4 block">💬</span>
              <p class="text-gray-600 font-medium text-lg">No messages yet</p>
              <p class="text-gray-500 text-sm mt-2">Be the first to leave a message!</p>
            </div>

            <div
              v-for="entry in entries"
              :key="entry.id"
              class="border-l-4 border-linear-to-b from-purple-500 to-blue-500 bg-linear-to-r from-purple-50 to-blue-50 pl-4 py-3 rounded-r-lg hover:shadow-md transition-all duration-200"
            >
              <div class="flex justify-between items-start mb-1">
                <h3 class="font-semibold text-gray-900">{{ entry.name }}</h3>
                <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  {{ formatDate(entry.created_at) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ entry.email }}</p>
              <p class="text-gray-700 leading-relaxed">{{ entry.message }}</p>
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
    const response = await api.getGuestbookEntries()
    if (response && Array.isArray(response)) {
      entries.value = response
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

    // Reload entries to show the new message
    const response = await api.getGuestbookEntries()
    if (response && Array.isArray(response)) {
      entries.value = response
    }

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
