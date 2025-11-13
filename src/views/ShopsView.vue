<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <div class="mb-4">
          <span class="text-6xl">🏪</span>
        </div>
        <h1 class="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
          Our Partner Shops
        </h1>
        <p class="text-xl text-gray-700 max-w-2xl mx-auto">
          Discover our network of trusted health and wellness partners
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-t-purple-600 border-r-blue-600 border-b-indigo-400 border-l-purple-400"></div>
        </div>
      </div>

      <div v-else-if="shops.length === 0" class="max-w-2xl mx-auto">
        <div class="bg-linear-to-br from-white to-indigo-50 rounded-2xl shadow-2xl p-12 border-2 border-indigo-200">
          <div class="text-center">
            <div class="mb-6">
              <span class="text-8xl">🏪</span>
            </div>
            <h3 class="text-3xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              No Partner Shops Yet
            </h3>
            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              We're currently building our network of trusted health and wellness partners. Check back soon to discover amazing shops!
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div class="flex items-center gap-2 text-gray-600">
                <span class="text-2xl">🔍</span>
                <span>Searching for partners</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600">
                <span class="text-2xl">✨</span>
                <span>Coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="shop in shops"
          :key="shop.id"
          class="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 hover:scale-105 border-2 border-indigo-100"
        >
          <div class="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 text-white/20 text-8xl -mt-4 -mr-4">🏪</div>
            <h2 class="text-2xl font-bold text-white relative z-10">{{ shop.shop_name }}</h2>
          </div>

          <div class="p-6">
            <div class="mb-4 pb-4 border-b border-gray-100">
              <h3 class="text-sm font-semibold text-indigo-600 mb-2 flex items-center gap-2">
                <span class="text-lg">👤</span> Owner
              </h3>
              <p class="text-gray-900 font-semibold text-lg">{{ shop.user.username }}</p>
              <p class="text-sm text-gray-600">{{ shop.user.email }}</p>
            </div>

            <div class="mb-4 pb-4 border-b border-gray-100">
              <h3 class="text-sm font-semibold text-indigo-600 mb-2 flex items-center gap-2">
                <span class="text-lg">📝</span> Description
              </h3>
              <p class="text-gray-700 leading-relaxed">{{ shop.description }}</p>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div
                  :class="[
                    'w-3 h-3 rounded-full animate-pulse',
                    shop.is_active ? 'bg-green-500 shadow-lg shadow-green-300' : 'bg-gray-400',
                  ]"
                ></div>
                <span
                  :class="[
                    'text-sm font-semibold px-3 py-1 rounded-full',
                    shop.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600',
                  ]"
                >
                  {{ shop.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 flex items-center gap-2">
              <span class="text-base">📅</span>
              <span>Established: {{ formatDate(shop.created_at) }}</span>
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

const shops = ref([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await api.getShops()
    shops.value = Array.isArray(response) ? response : []
  } catch (error) {
    console.error('Error loading shops:', error)
    shops.value = []
  } finally {
    isLoading.value = false
  }
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
