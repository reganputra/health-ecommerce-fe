<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Our Shops
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover our amazing partner shops.
        </p>
      </div>

      <div v-if="isLoading" class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading shops...</p>
      </div>

      <div v-else-if="shops.length === 0" class="text-center">
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-900">No Shops Found</h2>
          <p class="mt-2 text-gray-600">We are working on adding new shops. Please check back later.</p>
        </div>
      </div>

      <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="shop in shops" :key="shop.id" class="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-900">{{ shop.shop_name }}</h2>
            <p class="mt-2 text-sm text-gray-600">{{ shop.description }}</p>
            <div class="mt-4 flex items-center justify-between">
              <div class="text-sm font-medium text-gray-500">
                <p class="text-gray-900 font-semibold">{{ shop.user.username }}</p>
                <p>{{ shop.user.email }}</p>
              </div>
              <div :class="[
                'px-2 py-1 text-xs font-semibold rounded-full',
                shop.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ shop.is_active ? 'Active' : 'Inactive' }}
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
              Established: {{ formatDate(shop.created_at) }}
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
