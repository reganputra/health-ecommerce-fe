import { ref, watch } from 'vue'

/**
 * Composable for localStorage with reactive state
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {Object} Storage utilities
 */
export function useStorage(key, defaultValue = null) {
  const data = ref(defaultValue)

  // Load initial value from storage
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        data.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      data.value = defaultValue
    }
  }

  // Save to storage
  const saveToStorage = (value) => {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  // Initialize
  loadFromStorage()

  // Watch for changes and sync to storage
  watch(data, (newValue) => {
    saveToStorage(newValue)
  }, { deep: true })

  // Manually set value
  const set = (value) => {
    data.value = value
  }

  // Remove from storage
  const remove = () => {
    data.value = defaultValue
    localStorage.removeItem(key)
  }

  return {
    data,
    set,
    remove,
  }
}

/**
 * Storage service with common methods
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error)
      return defaultValue
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing ${key} to storage:`, error)
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error)
    }
  },

  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  },
}
