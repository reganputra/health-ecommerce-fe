<template>
  <AuthCard
    title="Login"
    subtitle="Welcome back to Health Store"
    footer-text="Don't have an account?"
    footer-link="/register"
    footer-link-text="Register here"
  >
    <LoginForm />
  </AuthCard>
</template>

<script setup>
import AuthCard from '@/components/auth/AuthCard.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
</script>
