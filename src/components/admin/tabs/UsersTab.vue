<template>
  <div class="users-admin">
    <h2>Manage Users</h2>

    <DataTable
      :columns="columns"
      :data="users"
      :loading="loading"
    >
      <template #cell-actions="{ row }">
        <button @click="handleDelete(row.id)" class="btn-delete">Delete</button>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import DataTable from '@/components/common/DataTable.vue'

const users = ref([])
const loading = ref(false)

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'city', label: 'City' },
  { key: 'actions', label: 'Actions' },
]

onMounted(() => {
  fetchUsers()
})

async function fetchUsers() {
  try {
    loading.value = true
    users.value = await api.getAllUsers()
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this user?')) return

  try {
    await api.deleteUser(id)
    await fetchUsers()
    alert('User deleted successfully')
  } catch (error) {
    alert(error.message)
  }
}
</script>

<style scoped>
h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #333;
}

.btn-delete {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #ffebee;
  color: #c62828;
}

.btn-delete:hover {
  background: #ffcdd2;
}
</style>
