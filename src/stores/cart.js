import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useCartStore = defineStore('cart', () => {
  const cart = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const itemCount = computed(() => {
    if (!cart.value?.items) return 0
    return cart.value.items.reduce((sum, item) => sum + item.quantity, 0)
  })

  const total = computed(() => {
    if (!cart.value?.items) return 0
    return cart.value.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
  })

  async function fetchCart() {
    try {
      loading.value = true
      error.value = null

      const response = await api.getCart()
      cart.value = response.cart

      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addToCart(productId, quantity = 1) {
    try {
      loading.value = true
      error.value = null

      await api.addToCart(productId, quantity)
      await fetchCart()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeFromCart(cartItemId) {
    try {
      loading.value = true
      error.value = null

      await api.removeFromCart(cartItemId)
      await fetchCart()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearCart() {
    cart.value = null
  }

  return {
    cart,
    loading,
    error,
    itemCount,
    total,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
  }
})
