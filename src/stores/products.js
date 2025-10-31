import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const selectedCategory = ref(null)
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref(null)

  const filteredProducts = computed(() => {
    let filtered = products.value

    if (selectedCategory.value) {
      filtered = filtered.filter(p => p.category_id === selectedCategory.value)
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  async function fetchProducts() {
    try {
      loading.value = true
      error.value = null

      const data = await api.getProducts()
      products.value = data

      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id) {
    try {
      loading.value = true
      error.value = null

      const data = await api.getProduct(id)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const data = await api.getCategories()
      categories.value = data

      return data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  async function createProduct(productData) {
    try {
      loading.value = true
      error.value = null

      const data = await api.createProduct(productData)
      await fetchProducts()

      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(id, productData) {
    try {
      loading.value = true
      error.value = null

      const data = await api.updateProduct(id, productData)
      await fetchProducts()

      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id) {
    try {
      loading.value = true
      error.value = null

      await api.deleteProduct(id)
      await fetchProducts()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    categories,
    selectedCategory,
    searchQuery,
    loading,
    error,
    filteredProducts,
    fetchProducts,
    fetchProduct,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
  }
})
