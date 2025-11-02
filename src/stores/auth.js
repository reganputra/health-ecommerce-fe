import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import { storage } from '@/composables/useStorage'
import { STORAGE_KEYS } from '@/constants'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function loadStoredAuth() {
    const storedToken = storage.get(STORAGE_KEYS.AUTH_TOKEN)
    const storedUser = storage.get(STORAGE_KEYS.USER_DATA)

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = storedUser
    }
  }

  async function login(username, password) {
    try {
      loading.value = true
      error.value = null

      const response = await api.login(username, password)

      token.value = response.token
      user.value = response.user

      storage.set(STORAGE_KEYS.AUTH_TOKEN, response.token)
      storage.set(STORAGE_KEYS.USER_DATA, response.user)

      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    try {
      loading.value = true
      error.value = null

      const response = await api.register(userData)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null

    storage.remove(STORAGE_KEYS.AUTH_TOKEN)
    storage.remove(STORAGE_KEYS.USER_DATA)
  }

  loadStoredAuth()

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  }
})
