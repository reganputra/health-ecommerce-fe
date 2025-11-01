<template>
  <div v-if="message" class="alert-message" :class="`alert-${type}`">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value),
  },
})
</script>

<style scoped>
.alert-message {
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

.alert-error {
  background: #fee;
  color: #c33;
}

.alert-success {
  background: #efe;
  color: #363;
}

.alert-warning {
  background: #ffeaa7;
  color: #856404;
}

.alert-info {
  background: #d1ecf1;
  color: #0c5460;
}
</style>
