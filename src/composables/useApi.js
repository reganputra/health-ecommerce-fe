import { useAsyncState } from './useAsyncState'
import { useNotification } from './useNotification'
import api from '@/services/api'

/**
 * Composable for making API calls with automatic loading/error handling
 * @param {Object} options - Configuration options
 * @param {boolean} options.showNotification - Show notification on error
 * @returns {Object} API utilities
 */
export function useApi(options = {}) {
  const { showNotification = true } = options
  const { loading, error, execute, reset } = useAsyncState()
  const notification = showNotification ? useNotification() : null

  /**
   * Execute an API call
   * @param {Function} apiCall - API function to call
   * @param {Object} callOptions - Options for this specific call
   */
  async function call(apiCall, callOptions = {}) {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage,
      showError = showNotification,
      showSuccess = false,
    } = callOptions

    return execute(apiCall, {
      onSuccess: (result) => {
        if (showSuccess && successMessage && notification) {
          notification.success(successMessage)
        }
        if (onSuccess) onSuccess(result)
      },
      onError: (err) => {
        if (showError && notification) {
          const message = errorMessage || err.message || 'An error occurred'
          notification.error(message)
        }
        if (onError) onError(err)
      },
    })
  }

  return {
    loading,
    error,
    call,
    reset,
    api,
  }
}
