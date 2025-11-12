<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Our Partner Shops
        </h1>
        <p class="text-xl text-gray-600">
          Discover our network of trusted health and wellness partners
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>

      <div v-else-if="shops.length === 0" class="text-center py-12">
        <p class="text-gray-600 text-lg">No partner shops available at this time.</p>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="shop in shops"
          :key="shop.id"
          class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        >
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 class="text-xl font-bold text-white">{{ shop.shop_name }}</h2>
          </div>

          <div class="p-6">
            <div class="mb-4">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">Owner</h3>
              <p class="text-gray-900 font-medium">{{ shop.user.username }}</p>
              <p class="text-sm text-gray-600">{{ shop.user.email }}</p>
            </div>

            <div class="mb-4">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p class="text-gray-700 text-sm leading-relaxed">{{ shop.description }}</p>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  :class="[
                    'w-3 h-3 rounded-full',
                    shop.is_active ? 'bg-green-500' : 'bg-gray-400',
                  ]"
                ></div>
                <span class="text-sm text-gray-600">
                  {{ shop.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>

            <div class="mt-4 text-xs text-gray-500">
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
