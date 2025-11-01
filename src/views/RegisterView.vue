<template>
  <AuthCard
    title="Register"
    subtitle="Create your Health Store account"
    width="600px"
    footer-text="Already have an account?"
    footer-link="/login"
    footer-link-text="Login here"
  >
    <RegisterForm />
  </AuthCard>
</template>

<script setup>
import AuthCard from '@/components/auth/AuthCard.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
</script>
