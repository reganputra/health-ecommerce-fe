import { ref } from 'vue'

/**
 * Notification types
 */
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

/**
 * Global notification state
 */
const notifications = ref([])
let notificationId = 0

/**
 * Composable for managing notifications/toasts
 * @returns {Object} Notification utilities
 */
export function useNotification() {
  /**
   * Show a notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {number} duration - Auto-dismiss duration in ms (0 for no auto-dismiss)
   */
  function notify(message, type = NotificationType.INFO, duration = 5000) {
    const id = ++notificationId
    const notification = {
      id,
      message,
      type,
      timestamp: Date.now(),
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  /**
   * Show success notification
   */
  function success(message, duration) {
    return notify(message, NotificationType.SUCCESS, duration)
  }

  /**
   * Show error notification
   */
  function error(message, duration) {
    return notify(message, NotificationType.ERROR, duration)
  }

  /**
   * Show warning notification
   */
  function warning(message, duration) {
    return notify(message, NotificationType.WARNING, duration)
  }

  /**
   * Show info notification
   */
  function info(message, duration) {
    return notify(message, NotificationType.INFO, duration)
  }

  /**
   * Dismiss a notification by ID
   */
  function dismiss(id) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  /**
   * Clear all notifications
   */
  function clear() {
    notifications.value = []
  }

  return {
    notifications,
    notify,
    success,
    error,
    warning,
    info,
    dismiss,
    clear,
  }
}
