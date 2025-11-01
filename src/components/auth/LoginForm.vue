<template>
  <form @submit.prevent="handleSubmit">
    <FormInput
      id="username"
      v-model="form.username"
      label="Username"
      type="text"
      placeholder="Enter your username"
      required
    />

    <FormInput
      id="password"
      v-model="form.password"
      label="Password"
      type="password"
      placeholder="Enter your password"
      required
    />

    <AlertMessage :message="errorMessage" type="error" />

    <button type="submit" class="btn-primary" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import FormInput from '@/components/common/FormInput.vue'
import AlertMessage from '@/components/common/AlertMessage.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  try {
    loading.value = true
    errorMessage.value = ''

    await authStore.login(form.value.username, form.value.password)

    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/products')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 8px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
