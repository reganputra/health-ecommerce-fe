<template>
  <div class="categories-admin">
    <div class="section-header">
      <h2>Manage Categories</h2>
      <button @click="handleAdd" class="btn-primary">Add Category</button>
    </div>

    <DataTable
      :columns="columns"
      :data="productsStore.categories"
      :loading="loading"
    >
      <template #cell-actions="{ row }">
        <div class="actions">
          <button @click="handleEdit(row)" class="btn-edit">Edit</button>
          <button @click="handleDelete(row.id)" class="btn-delete">Delete</button>
        </div>
      </template>
    </DataTable>

    <CategoryForm
      v-model="showForm"
      :category="editingCategory"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import api from '@/services/api'
import DataTable from '@/components/common/DataTable.vue'
import CategoryForm from '@/components/admin/forms/CategoryForm.vue'

const productsStore = useProductsStore()

const showForm = ref(false)
const editingCategory = ref(null)
const loading = ref(false)

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'actions', label: 'Actions' },
]

function handleAdd() {
  editingCategory.value = null
  showForm.value = true
}

function handleEdit(category) {
  editingCategory.value = category
  showForm.value = true
}

async function handleSave(formData) {
  try {
    loading.value = true
    if (editingCategory.value) {
      await api.updateCategory(editingCategory.value.id, formData)
    } else {
      await api.createCategory(formData)
    }
    await productsStore.fetchCategories()
    alert('Category saved successfully')
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this category?')) return

  try {
    loading.value = true
    await api.deleteCategory(id)
    await productsStore.fetchCategories()
    alert('Category deleted successfully')
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-edit,
.btn-delete {
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

.btn-edit {
  background: #e3f2fd;
  color: #0277bd;
}

.btn-edit:hover {
  background: #bbdefb;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
}

.btn-delete:hover {
  background: #ffcdd2;
}
</style>
