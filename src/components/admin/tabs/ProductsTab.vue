<template>
  <div class="products-admin">
    <div class="section-header">
      <h2>Manage Products</h2>
      <button @click="handleAdd" class="btn-primary">Add Product</button>
    </div>

    <DataTable
      :columns="columns"
      :data="productsStore.products"
      :loading="productsStore.loading"
    >
      <template #cell-price="{ value }">
        ${{ value.toFixed(2) }}
      </template>

      <template #cell-category_id="{ value }">
        {{ getCategoryName(value) }}
      </template>

      <template #cell-actions="{ row }">
        <div class="actions">
          <button @click="handleEdit(row)" class="btn-edit">Edit</button>
          <button @click="handleDelete(row.id)" class="btn-delete">Delete</button>
        </div>
      </template>
    </DataTable>

    <ProductForm
      v-model="showForm"
      :product="editingProduct"
      :categories="productsStore.categories"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import DataTable from '@/components/common/DataTable.vue'
import ProductForm from '@/components/admin/forms/ProductForm.vue'

const productsStore = useProductsStore()

const showForm = ref(false)
const editingProduct = ref(null)

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock' },
  { key: 'category_id', label: 'Category' },
  { key: 'actions', label: 'Actions' },
]

function getCategoryName(categoryId) {
  const category = productsStore.categories.find(c => c.id === categoryId)
  return category ? category.name : 'N/A'
}

function handleAdd() {
  editingProduct.value = null
  showForm.value = true
}

function handleEdit(product) {
  editingProduct.value = product
  showForm.value = true
}

async function handleSave(formData) {
  try {
    if (editingProduct.value) {
      await productsStore.updateProduct(editingProduct.value.id, formData)
    } else {
      await productsStore.createProduct(formData)
    }
    alert('Product saved successfully')
  } catch (error) {
    alert(error.message)
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    await productsStore.deleteProduct(id)
    alert('Product deleted successfully')
  } catch (error) {
    alert(error.message)
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
