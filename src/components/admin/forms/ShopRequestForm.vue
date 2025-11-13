<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <Transition name="modal-slide">
          <div v-if="isOpen" class="modal-content" @click.stop>
            <!-- Header -->
            <div class="modal-header">
              <div class="header-icon-wrapper">
                <div class="header-icon-bg"></div>
                <span class="header-icon">🏪</span>
              </div>
              <h3 class="modal-title">Create Shop Request</h3>
              <p class="modal-subtitle">Submit your shop details for approval</p>
              <button 
                type="button"
                @click="handleClose"
                :disabled="isSubmitting"
                class="close-button"
                aria-label="Close"
              >
                <span class="close-icon">✕</span>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="modal-body">
              <div class="form-group">
                <label for="shop-name" class="form-label">
                  <span class="label-icon">🏷️</span>
                  <span class="label-text">Shop Name</span>
                  <span class="label-required">*</span>
                </label>
                <div class="input-wrapper">
                  <input
                    id="shop-name"
                    v-model="form.shop_name"
                    type="text"
                    required
                    minlength="3"
                    maxlength="100"
                    placeholder="Enter your shop name"
                    class="form-input"
                    :class="{ 'input-error': shopNameError }"
                  />
                  <div class="input-indicator">
                    <span class="char-count" :class="{ 'text-warning': form.shop_name.length > 90 }">
                      {{ form.shop_name.length }}/100
                    </span>
                  </div>
                </div>
                <p class="form-hint">Choose a unique and memorable name (3-100 characters)</p>
                <p v-if="shopNameError" class="form-error">{{ shopNameError }}</p>
              </div>

              <div class="form-group">
                <label for="description" class="form-label">
                  <span class="label-icon">📝</span>
                  <span class="label-text">Description</span>
                  <span class="label-required">*</span>
                </label>
                <div class="input-wrapper">
                  <textarea
                    id="description"
                    v-model="form.description"
                    required
                    minlength="10"
                    maxlength="500"
                    rows="5"
                    placeholder="Describe your shop, products, and what makes it special..."
                    class="form-textarea"
                    :class="{ 'input-error': descriptionError }"
                  ></textarea>
                  <div class="textarea-indicator">
                    <span class="char-count" :class="{ 'text-warning': form.description.length > 450 }">
                      {{ form.description.length }}/500
                    </span>
                  </div>
                </div>
                <p class="form-hint">Tell us about your shop and what you offer (10-500 characters)</p>
                <p v-if="descriptionError" class="form-error">{{ descriptionError }}</p>
              </div>

              <!-- Progress Bar -->
              <div class="form-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: formProgress + '%' }"></div>
                </div>
                <p class="progress-text">{{ formProgress }}% Complete</p>
              </div>

              <!-- Actions -->
              <div class="modal-actions">
                <button
                  type="button"
                  @click="handleClose"
                  :disabled="isSubmitting"
                  class="btn-cancel"
                >
                  <span class="btn-icon">✕</span>
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting || !isFormValid"
                  class="btn-submit"
                >
                  <span v-if="!isSubmitting" class="btn-content">
                    <span class="btn-icon">✨</span>
                    Submit Request
                  </span>
                  <span v-else class="btn-loading">
                    <span class="spinner"></span>
                    Submitting...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const form = ref({
  shop_name: '',
  description: '',
})

const isSubmitting = ref(false)

// Validation
const shopNameError = computed(() => {
  if (!form.value.shop_name) return ''
  if (form.value.shop_name.length < 3) return 'Shop name must be at least 3 characters'
  if (form.value.shop_name.length > 100) return 'Shop name must not exceed 100 characters'
  return ''
})

const descriptionError = computed(() => {
  if (!form.value.description) return ''
  if (form.value.description.length < 10) return 'Description must be at least 10 characters'
  if (form.value.description.length > 500) return 'Description must not exceed 500 characters'
  return ''
})

const isFormValid = computed(() => {
  return form.value.shop_name.length >= 3 &&
         form.value.shop_name.length <= 100 &&
         form.value.description.length >= 10 &&
         form.value.description.length <= 500
})

const formProgress = computed(() => {
  let progress = 0
  if (form.value.shop_name.length >= 3) progress += 50
  if (form.value.description.length >= 10) progress += 50
  return progress
})

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

function handleSubmit() {
  if (isSubmitting.value || !isFormValid.value) return

  isSubmitting.value = true
  emit('save', { ...form.value })

  // Reset submitting state after a short delay
  setTimeout(() => {
    isSubmitting.value = false
  }, 500)
}

function handleClose() {
  if (isSubmitting.value) return
  resetForm()
  emit('update:modelValue', false)
}

function resetForm() {
  form.value = {
    shop_name: '',
    description: '',
  }
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* Modal Content */
.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

/* Modal Header */
.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 32px 24px;
  position: relative;
  text-align: center;
  color: white;
}

.header-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.header-icon-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.header-icon {
  font-size: 48px;
  display: block;
  position: relative;
  z-index: 1;
  animation: float 3s ease-in-out infinite;
}

.modal-title {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal-subtitle {
  font-size: 15px;
  opacity: 0.95;
  margin: 0;
  font-weight: 400;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.close-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.close-icon {
  font-size: 20px;
  font-weight: 600;
}

/* Modal Body */
.modal-body {
  padding: 32px;
  overflow-y: auto;
  flex: 1;
}

/* Form Group */
.form-group {
  margin-bottom: 28px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.label-icon {
  font-size: 20px;
}

.label-text {
  flex: 1;
}

.label-required {
  color: #ef4444;
  font-size: 18px;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
}

/* Form Input */
.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: inherit;
  background: #f9fafb;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.input-error {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
}

.input-error:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
}

/* Input Indicators */
.input-indicator,
.textarea-indicator {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.textarea-indicator {
  top: 12px;
  transform: none;
}

.char-count {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  background: white;
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.text-warning {
  color: #f59e0b;
}

/* Form Hints and Errors */
.form-hint {
  font-size: 13px;
  color: #6b7280;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-error {
  font-size: 13px;
  color: #ef4444;
  margin-top: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-error::before {
  content: '⚠️';
}

/* Progress Bar */
.form-progress {
  margin: 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f0f4ff 0%, #fff0f6 100%);
  border-radius: 12px;
  border: 2px solid #e0e7ff;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.progress-text {
  font-size: 13px;
  font-weight: 700;
  color: #667eea;
  text-align: center;
  margin: 0;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-cancel:hover:not(:disabled) {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-submit:disabled,
.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-icon {
  font-size: 18px;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.3;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: all 0.3s ease;
}

.modal-slide-leave-active {
  transition: all 0.2s ease;
}

.modal-slide-enter-from {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

/* Responsive */
@media (max-width: 640px) {
  .modal-header {
    padding: 24px 20px 20px;
  }

  .modal-body {
    padding: 24px 20px;
  }

  .modal-title {
    font-size: 24px;
  }

  .modal-subtitle {
    font-size: 14px;
  }

  .header-icon {
    font-size: 40px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
