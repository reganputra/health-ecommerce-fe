<template>
  <Modal v-model="isOpen" :title="isEditing ? 'Edit Product' : 'Add Product'">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Name</label>
        <input v-model="form.name" required />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" required rows="3"></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Price</label>
          <input v-model.number="form.price" type="number" step="0.01" required />
        </div>
        <div class="form-group">
          <label>Stock</label>
          <input v-model.number="form.stock" type="number" required />
        </div>
      </div>

      <div class="form-group">
        <label>Category</label>
        <select v-model.number="form.category_id" required>
          <option value="">Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Product Image</label>
        <input
          type="file"
          @change="handleImageUpload"
          accept="image/*"
          ref="imageInput"
        />
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="Preview" />
          <button type="button" @click="clearImage" class="btn-clear-image">Remove</button>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleClose" class="btn-secondary">Cancel</button>
        <button type="submit" class="btn-primary">Save</button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Modal from '@/components/common/Modal.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  product: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isEditing = computed(() => !!props.product)

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: '',
  image_url: '',
})

const imagePreview = ref(null)
const imageInput = ref(null)
const selectedImageFile = ref(null) // Store the actual File object

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.value = { ...newProduct }
    imagePreview.value = newProduct.image_url || null
    selectedImageFile.value = null // Clear file when editing existing product
  } else {
    resetForm()
  }
}, { immediate: true })

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    // Store the actual File object
    selectedImageFile.value = file

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function clearImage() {
  imagePreview.value = null
  selectedImageFile.value = null
  form.value.image_url = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

function handleSubmit() {
  // Include the File object if a new image was selected
  const dataToSave = {
    ...form.value,
    imageFile: selectedImageFile.value // Add the File object
  }
  emit('save', dataToSave)
  handleClose()
}

function handleClose() {
  resetForm()
  emit('update:modelValue', false)
}

function resetForm() {
  form.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: '',
    image_url: '',
  }
  imagePreview.value = null
  selectedImageFile.value = null
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input[type="file"] {
  padding: 8px;
}

.image-preview {
  margin-top: 16px;
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: block;
}

.btn-clear-image {
  margin-top: 8px;
  padding: 6px 12px;
  background: #ffebee;
  color: #c62828;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear-image:hover {
  background: #ffcdd2;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #f5f7ff;
}
</style>
