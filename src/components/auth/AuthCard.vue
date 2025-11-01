<template>
  <div class="auth-container">
    <div class="auth-card" :style="{ maxWidth: width }">
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>

      <slot></slot>

      <div v-if="footerText" class="footer-text">
        {{ footerText }}
        <router-link :to="footerLink">{{ footerLinkText }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '400px',
  },
  footerText: {
    type: String,
    default: '',
  },
  footerLink: {
    type: String,
    default: '',
  },
  footerLinkText: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
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
</style>
