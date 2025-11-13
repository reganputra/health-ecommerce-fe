<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="confirm-modal-overlay" @click.self="handleCancel">
        <div class="confirm-modal">
          <div class="confirm-icon" :class="`confirm-icon-${variant}`">
            <span v-if="variant === 'danger'">⚠️</span>
            <span v-else-if="variant === 'warning'">⚡</span>
            <span v-else-if="variant === 'info'">ℹ️</span>
            <span v-else>❓</span>
          </div>

          <h3 class="confirm-title">{{ title }}</h3>
          <p class="confirm-message">{{ message }}</p>

          <div class="confirm-actions">
            <button
              @click="handleCancel"
              class="btn-cancel"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="btn-confirm"
              :class="`btn-${variant}`"
              :disabled="loading"
            >
              {{ loading ? 'Processing...' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  variant: {
    type: String,
    default: 'danger', // danger, warning, info, default
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'cancel', 'update:isOpen'])

function handleConfirm() {
  emit('confirm')
  emit('update:isOpen', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:isOpen', false)
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.confirm-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.confirm-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  text-align: center;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirm-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.confirm-icon-danger {
  background: #fee;
  border: 2px solid #fcc;
}

.confirm-icon-warning {
  background: #fff3e0;
  border: 2px solid #ffe0b2;
}

.confirm-icon-info {
  background: #e3f2fd;
  border: 2px solid #bbdefb;
}

.confirm-icon-default {
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
}

.confirm-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.confirm-message {
  margin: 0 0 28px 0;
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel,
.btn-confirm {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover:not(:disabled) {
  background: #e0e0e0;
}

.btn-confirm {
  color: white;
}

.btn-danger {
  background: linear-gradient(135deg, #ef5350 0%, #c62828 100%);
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 83, 80, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #ff9800 0%, #ef6c00 100%);
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
}

.btn-info:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 165, 245, 0.4);
}

.btn-default {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-default:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-cancel:disabled,
.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
