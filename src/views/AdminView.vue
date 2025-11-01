<template>
  <div class="admin-view">
    <h1>Admin Dashboard</h1>

    <AdminTabs v-model="activeTab" :tabs="tabs" />

    <div class="tab-content">
      <ProductsTab v-if="activeTab === 'products'" />
      <CategoriesTab v-if="activeTab === 'categories'" />
      <OrdersTab v-if="activeTab === 'orders'" />
      <UsersTab v-if="activeTab === 'users'" />
      <ReportsTab v-if="activeTab === 'reports'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import AdminTabs from '@/components/admin/AdminTabs.vue'
import ProductsTab from '@/components/admin/tabs/ProductsTab.vue'
import CategoriesTab from '@/components/admin/tabs/CategoriesTab.vue'
import OrdersTab from '@/components/admin/tabs/OrdersTab.vue'
import UsersTab from '@/components/admin/tabs/UsersTab.vue'
import ReportsTab from '@/components/admin/tabs/ReportsTab.vue'

const productsStore = useProductsStore()

const activeTab = ref('products')
const tabs = [
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'orders', label: 'Orders' },
  { id: 'users', label: 'Users' },
  { id: 'reports', label: 'Reports' },
]

onMounted(async () => {
  await productsStore.fetchProducts()
  await productsStore.fetchCategories()
})
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
</style>
