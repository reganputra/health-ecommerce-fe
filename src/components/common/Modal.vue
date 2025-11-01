<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal" @click.self="handleClose">
      <div class="modal-content" :style="{ maxWidth: width }">
        <h3 v-if="title">{{ title }}</h3>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '600px',
  },
})

const emit = defineEmits(['update:modelValue'])

function handleClose() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #333;
}
</style>
