<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Register</h1>
      <p class="subtitle">Create your Health Store account</p>

      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label for="username">Username *</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              minlength="3"
              maxlength="50"
              placeholder="Choose a username"
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="password">Password *</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              placeholder="Min 6 characters"
            />
          </div>

          <div class="form-group">
            <label for="contact_number">Contact Number *</label>
            <input
              id="contact_number"
              v-model="form.contact_number"
              type="tel"
              required
              minlength="10"
              maxlength="15"
              placeholder="1234567890"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="dob">Date of Birth *</label>
            <input
              id="dob"
              v-model="form.dob"
              type="date"
              required
            />
          </div>

          <div class="form-group">
            <label for="gender">Gender *</label>
            <select id="gender" v-model="form.gender" required>
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address *</label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            required
            minlength="10"
            maxlength="255"
            placeholder="Full address"
          />
        </div>

        <div class="form-group">
          <label for="city">City *</label>
          <input
            id="city"
            v-model="form.city"
            type="text"
            required
            minlength="2"
            maxlength="100"
            placeholder="City name"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>

      <div class="footer-text">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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

async function handleRegister() {
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
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
}

.subtitle {
  margin: 0 0 32px 0;
  color: #666;
  font-size: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

input,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus,
select:focus {
  outline: none;
  border-color: #667eea;
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

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

.success-message {
  background: #efe;
  color: #363;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

.footer-text {
  margin-top: 24px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.footer-text a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.footer-text a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
