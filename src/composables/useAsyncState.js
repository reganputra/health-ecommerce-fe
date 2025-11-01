import { ref } from 'vue'

/**
 * Composable for managing async operation state (loading, error, data)
 * @template T
 * @returns {Object} Async state management utilities
 */
export function useAsyncState() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Execute an async function with automatic loading and error handling
   * @param {Function} asyncFn - Async function to execute
   * @param {Object} options - Options for execution
   * @param {Function} options.onSuccess - Callback on success
   * @param {Function} options.onError - Callback on error
   * @param {Function} options.onFinally - Callback that always runs
   * @returns {Promise<T>} Result of async function
   */
  async function execute(asyncFn, options = {}) {
    const { onSuccess, onError, onFinally } = options

    loading.value = true
    error.value = null

    try {
      const result = await asyncFn()
      if (onSuccess) onSuccess(result)
      return result
    } catch (err) {
      error.value = err.message || 'An error occurred'
      if (onError) onError(err)
      throw err
    } finally {
      loading.value = false
      if (onFinally) onFinally()
    }
  }

  /**
   * Reset state to initial values
   */
  function reset() {
    loading.value = false
    error.value = null
  }

  return {
    loading,
    error,
    execute,
    reset,
  }
}
