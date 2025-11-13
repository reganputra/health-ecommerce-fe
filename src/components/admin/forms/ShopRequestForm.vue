<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
      <div class="modal-content" @click.stop>
      <h3 class="text-xl font-bold text-gray-900 mb-4">Create Shop Request</h3>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Shop Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.shop_name"
            type="text"
            required
            minlength="3"
            maxlength="100"
            placeholder="Enter shop name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p class="text-xs text-gray-500 mt-1">3-100 characters</p>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            required
            minlength="10"
            maxlength="500"
            rows="4"
            placeholder="Describe your shop"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">10-500 characters</p>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
          </button>
          <button
            type="button"
            @click="handleClose"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
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

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

function handleSubmit() {
  if (isSubmitting.value) return

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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
</style>
