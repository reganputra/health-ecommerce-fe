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

      <div class="max-w-xl mx-auto">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const form = ref({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

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
</script>
