<template>
  <div class="guestbook-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="icon-wrapper">
          <div class="icon-bg"></div>
          <span class="hero-icon">📖</span>
        </div>
        <h1 class="hero-title">
          <span class="gradient-text">Guest</span>book
        </h1>
        <p class="hero-subtitle">
          Share your thoughts, experiences, and feedback with our community
        </p>
      </div>
      <div class="hero-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <div class="content-grid">
        <!-- Form Section -->
        <div class="form-card">
          <div class="card-header">
            <div class="header-icon">✍️</div>
            <h2 class="card-title">Leave Your Message</h2>
            <p class="card-subtitle">We'd love to hear from you!</p>
          </div>
          <form @submit.prevent="submitEntry" class="guestbook-form">
            <div class="form-group">
              <label for="name" class="form-label">
                <span class="label-icon">👤</span>
                Your Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Enter your name"
                class="form-input"
                required
                minlength="2"
                maxlength="100"
              />
            </div>

            <div class="form-group">
              <label for="email" class="form-label">
                <span class="label-icon">📧</span>
                Email Address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="message" class="form-label">
                <span class="label-icon">💬</span>
                Your Message
              </label>
              <textarea
                id="message"
                v-model="form.message"
                placeholder="Share your thoughts, experiences, or feedback..."
                rows="6"
                class="form-textarea"
                required
                minlength="10"
                maxlength="1000"
              ></textarea>
              <div class="character-count">
                {{ form.message.length }} / 1000
              </div>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="submit-btn"
            >
              <span v-if="!isSubmitting" class="btn-content">
                <span class="btn-icon">✨</span>
                <span>Submit Message</span>
              </span>
              <span v-else class="btn-loading">
                <span class="spinner"></span>
                Submitting...
              </span>
            </button>

            <transition name="fade">
              <div v-if="successMessage" class="alert alert-success">
                <span class="alert-icon">✅</span>
                {{ successMessage }}
              </div>
            </transition>

            <transition name="fade">
              <div v-if="errorMessage" class="alert alert-error">
                <span class="alert-icon">❌</span>
                {{ errorMessage }}
              </div>
            </transition>
          </form>
        </div>

        <!-- Info Section -->
        <div class="info-card">
          <div class="card-header">
            <div class="header-icon">ℹ️</div>
            <h2 class="card-title">About Guestbook</h2>
          </div>

          <div class="info-content">
            <div class="info-item">
              <div class="info-icon">📝</div>
              <div>
                <h3 class="info-title">Share Your Experience</h3>
                <p class="info-text">Tell us about your experience with our health store. Your feedback helps us improve!</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">🔒</div>
              <div>
                <h3 class="info-title">Privacy First</h3>
                <p class="info-text">Your messages are reviewed by our team before being displayed publicly.</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">⚡</div>
              <div>
                <h3 class="info-title">Quick Response</h3>
                <p class="info-text">Our team reviews all entries regularly to ensure quality and authenticity.</p>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">💬</div>
              <div>
                <h3 class="info-title">Community Voice</h3>
                <p class="info-text">Join our growing community of satisfied customers sharing their stories.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showNotification } = useNotification()

const form = ref({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

async function submitEntry() {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await api.createGuestbookEntry({
      name: form.value.name,
      email: form.value.email,
      message: form.value.message,
    })

    successMessage.value = 'Thank you! Your message has been submitted successfully. It will be reviewed by our team.'
    form.value = { name: '', email: '', message: '' }

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    errorMessage.value = error.response?.data?.error || error.message || 'Failed to submit message. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

</script>

<style scoped>
/* Hero Section */
.guestbook-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section {
  position: relative;
  padding: 60px 20px 40px;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.icon-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.hero-icon {
  font-size: 64px;
  display: block;
  position: relative;
  z-index: 1;
  animation: float 3s ease-in-out infinite;
}

.hero-title {
  font-size: 72px;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.gradient-text {
  background: linear-gradient(to right, #ffd89b, #19547b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -100px;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: 20%;
  animation: float 7s ease-in-out infinite;
}

/* Main Content */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

/* Card Styles */
.form-card,
.info-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.form-card:hover,
.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 16px;
  color: #666;
}

/* Form Styles */
.guestbook-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
}

.label-icon {
  font-size: 18px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.character-count {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

/* Submit Button */
.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  font-size: 20px;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Alerts */
.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.alert-icon {
  font-size: 18px;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* Info Section */
.info-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%);
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.info-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(102, 126, 234, 0.3);
}

.info-icon {
  font-size: 32px;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0 0 6px 0;
}

.info-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.3;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
