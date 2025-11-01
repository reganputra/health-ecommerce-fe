<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-row">
      <FormInput
        id="username"
        v-model="form.username"
        label="Username *"
        type="text"
        placeholder="Choose a username"
        required
        minlength="3"
        maxlength="50"
      />

      <FormInput
        id="email"
        v-model="form.email"
        label="Email *"
        type="email"
        placeholder="your@email.com"
        required
      />
    </div>

    <div class="form-row">
      <FormInput
        id="password"
        v-model="form.password"
        label="Password *"
        type="password"
        placeholder="Min 6 characters"
        required
        minlength="6"
      />

      <FormInput
        id="contact_number"
        v-model="form.contact_number"
        label="Contact Number *"
        type="tel"
        placeholder="1234567890"
        required
        minlength="10"
        maxlength="15"
      />
    </div>

    <div class="form-row">
      <FormInput
        id="dob"
        v-model="form.dob"
        label="Date of Birth *"
        type="date"
        required
      />

      <FormInput
        id="gender"
        v-model="form.gender"
        label="Gender *"
        type="select"
        placeholder="Select gender"
        required
        :options="genderOptions"
      />
    </div>

    <FormInput
      id="address"
      v-model="form.address"
      label="Address *"
      type="text"
      placeholder="Full address"
      required
      minlength="10"
      maxlength="255"
    />

    <FormInput
      id="city"
      v-model="form.city"
      label="City *"
      type="text"
      placeholder="City name"
      required
      minlength="2"
      maxlength="100"
    />

    <AlertMessage :message="errorMessage" type="error" />
    <AlertMessage :message="successMessage" type="success" />

    <button type="submit" class="btn-primary" :disabled="loading">
      {{ loading ? 'Creating account...' : 'Register' }}
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
  email: '',
  dob: '',
  gender: '',
  address: '',
  city: '',
  contact_number: '',
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const genderOptions = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
]

async function handleSubmit() {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    await authStore.register(form.value)

    successMessage.value = 'Account created successfully! Redirecting to login...'

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

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

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
