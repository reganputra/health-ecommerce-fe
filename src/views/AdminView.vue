<template>
  <div class="admin-view">
    <h1>Admin Dashboard</h1>

    <div class="admin-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'products'" class="products-admin">
        <div class="section-header">
          <h2>Manage Products</h2>
          <button @click="showProductForm = true" class="btn-primary">Add Product</button>
        </div>

        <div v-if="productsStore.loading" class="loading">Loading...</div>

        <div v-else class="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in productsStore.products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>${{ product.price.toFixed(2) }}</td>
                <td>{{ product.stock }}</td>
                <td>{{ getCategoryName(product.category_id) }}</td>
                <td class="actions">
                  <button @click="editProduct(product)" class="btn-edit">Edit</button>
                  <button @click="deleteProduct(product.id)" class="btn-delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="showProductForm" class="modal">
          <div class="modal-content">
            <h3>{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h3>
            <form @submit.prevent="saveProduct">
              <div class="form-group">
                <label>Name</label>
                <input v-model="productForm.name" required />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="productForm.description" required rows="3"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Price</label>
                  <input v-model.number="productForm.price" type="number" step="0.01" required />
                </div>
                <div class="form-group">
                  <label>Stock</label>
                  <input v-model.number="productForm.stock" type="number" required />
                </div>
              </div>
              <div class="form-group">
                <label>Category</label>
                <select v-model.number="productForm.category_id" required>
                  <option value="">Select category</option>
                  <option v-for="cat in productsStore.categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Image URL</label>
                <input v-model="productForm.image_url" type="url" required />
              </div>
              <div class="form-actions">
                <button type="button" @click="closeProductForm" class="btn-secondary">Cancel</button>
                <button type="submit" class="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'orders'" class="orders-admin">
        <h2>Manage Orders</h2>

        <div v-if="loadingOrders" class="loading">Loading...</div>

        <div v-else class="admin-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in allOrders" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.user_id }}</td>
                <td>${{ order.total_price.toFixed(2) }}</td>
                <td>{{ order.payment_method }}</td>
                <td>
                  <span class="status-badge" :class="`status-${order.status}`">
                    {{ order.status }}
                  </span>
                </td>
                <td>{{ formatDate(order.created_at) }}</td>
                <td class="actions">
                  <select
                    :value="order.status"
                    @change="updateOrderStatus(order.id, $event.target.value)"
                    class="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'users'" class="users-admin">
        <h2>Manage Users</h2>

        <div v-if="loadingUsers" class="loading">Loading...</div>

        <div v-else class="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in allUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user.city }}</td>
                <td class="actions">
                  <button @click="deleteUser(user.id)" class="btn-delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'reports'" class="reports-admin">
        <h2>Generate Reports</h2>

        <div class="reports-form">
          <div class="form-row">
            <div class="form-group">
              <label>Report Type</label>
              <select v-model="reportForm.type">
                <option value="summary">Summary</option>
                <option value="detailed">Detailed</option>
                <option value="financial">Financial</option>
              </select>
            </div>
            <div class="form-group">
              <label>Format</label>
              <select v-model="reportForm.format">
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Start Date</label>
              <input v-model="reportForm.startDate" type="date" />
            </div>
            <div class="form-group">
              <label>End Date</label>
              <input v-model="reportForm.endDate" type="date" />
            </div>
          </div>
          <button @click="generateReport" class="btn-primary" :disabled="generatingReport">
            {{ generatingReport ? 'Generating...' : 'Generate Report' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import api from '@/services/api'

const productsStore = useProductsStore()

const activeTab = ref('products')
const tabs = [
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
  { id: 'users', label: 'Users' },
  { id: 'reports', label: 'Reports' },
]

const showProductForm = ref(false)
const editingProduct = ref(null)
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: '',
  image_url: '',
})

const allOrders = ref([])
const loadingOrders = ref(false)

const allUsers = ref([])
const loadingUsers = ref(false)

const reportForm = ref({
  type: 'summary',
  format: 'pdf',
  startDate: '',
  endDate: '',
})
const generatingReport = ref(false)

onMounted(async () => {
  await productsStore.fetchProducts()
  await productsStore.fetchCategories()
  await fetchOrders()
  await fetchUsers()
})

function getCategoryName(categoryId) {
  const category = productsStore.categories.find(c => c.id === categoryId)
  return category ? category.name : 'N/A'
}

function editProduct(product) {
  editingProduct.value = product
  productForm.value = { ...product }
  showProductForm.value = true
}

async function saveProduct() {
  try {
    if (editingProduct.value) {
      await productsStore.updateProduct(editingProduct.value.id, productForm.value)
    } else {
      await productsStore.createProduct(productForm.value)
    }
    closeProductForm()
    alert('Product saved successfully')
  } catch (error) {
    alert(error.message)
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return

  try {
    await productsStore.deleteProduct(id)
    alert('Product deleted successfully')
  } catch (error) {
    alert(error.message)
  }
}

function closeProductForm() {
  showProductForm.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: '',
    image_url: '',
  }
}

async function fetchOrders() {
  try {
    loadingOrders.value = true
    allOrders.value = await api.getAllOrders()
  } catch (error) {
    alert(error.message)
  } finally {
    loadingOrders.value = false
  }
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    await api.updateOrderStatus(orderId, newStatus)
    await fetchOrders()
    alert('Order status updated successfully')
  } catch (error) {
    alert(error.message)
  }
}

async function fetchUsers() {
  try {
    loadingUsers.value = true
    allUsers.value = await api.getAllUsers()
  } catch (error) {
    alert(error.message)
  } finally {
    loadingUsers.value = false
  }
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    await api.deleteUser(id)
    await fetchUsers()
    alert('User deleted successfully')
  } catch (error) {
    alert(error.message)
  }
}

async function generateReport() {
  try {
    generatingReport.value = true
    await api.generateReport(
      reportForm.value.type,
      reportForm.value.format,
      reportForm.value.startDate || null,
      reportForm.value.endDate || null
    )
  } catch (error) {
    alert(error.message)
  } finally {
    generatingReport.value = false
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.admin-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

h1 {
  margin: 0 0 32px 0;
  font-size: 36px;
  color: #333;
}

.admin-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 2px solid #eee;
}

.tab-button {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #667eea;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

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

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.admin-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

td {
  color: #666;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-secondary,
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #f5f7ff;
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

.modal {
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
  padding: 32px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #333;
}

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

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pending {
  background: #fff3e0;
  color: #e65100;
}

.status-paid {
  background: #e3f2fd;
  color: #0277bd;
}

.status-shipped {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-cancelled {
  background: #ffebee;
  color: #c62828;
}

.status-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.reports-form {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}
</style>
