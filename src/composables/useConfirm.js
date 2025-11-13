import { ref } from 'vue'

/**
 * Global confirm dialog state
 */
const isOpen = ref(false)
const title = ref('Confirm Action')
const message = ref('')
const confirmText = ref('Confirm')
const cancelText = ref('Cancel')
const variant = ref('danger')
const loading = ref(false)
const resolvePromise = ref(null)
const rejectPromise = ref(null)

/**
 * Composable for programmatic confirmation dialogs
 *
 * @example
 * const { confirm } = useConfirm()
 *
 * const confirmed = await confirm({
 *   title: 'Delete Item',
 *   message: 'Are you sure you want to delete this item?',
 *   variant: 'danger'
 * })
 *
 * if (confirmed) {
 *   // Perform deletion
 * }
 */
export function useConfirm() {
  /**
   * Opens a confirmation dialog
   * @param {Object} options - Configuration options
   * @param {string} options.title - Dialog title
   * @param {string} options.message - Dialog message
   * @param {string} options.confirmText - Confirm button text
   * @param {string} options.cancelText - Cancel button text
   * @param {string} options.variant - Visual variant (danger, warning, info, default)
   * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
   */
  function confirm(options = {}) {
    return new Promise((resolve, reject) => {
      title.value = options.title || 'Confirm Action'
      message.value = options.message || 'Are you sure you want to proceed?'
      confirmText.value = options.confirmText || 'Confirm'
      cancelText.value = options.cancelText || 'Cancel'
      variant.value = options.variant || 'danger'
      loading.value = false

      resolvePromise.value = resolve
      rejectPromise.value = reject
      isOpen.value = true
    })
  }

  /**
   * Handles confirmation
   */
  function handleConfirm() {
    if (resolvePromise.value) {
      resolvePromise.value(true)
    }
    closeDialog()
  }

  /**
   * Handles cancellation
   */
  function handleCancel() {
    if (resolvePromise.value) {
      resolvePromise.value(false)
    }
    closeDialog()
  }

  /**
   * Closes the dialog and resets state
   */
  function closeDialog() {
    isOpen.value = false
    loading.value = false
    resolvePromise.value = null
    rejectPromise.value = null
  }

  /**
   * Sets loading state (useful for async operations)
   */
  function setLoading(value) {
    loading.value = value
  }

  return {
    // State
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    variant,
    loading,

    // Methods
    confirm,
    handleConfirm,
    handleCancel,
    setLoading,
  }
}
