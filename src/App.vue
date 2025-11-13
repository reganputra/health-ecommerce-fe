<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import NotificationToast from './components/common/NotificationToast.vue'
import ConfirmModal from './components/common/ConfirmModal.vue'
import { useConfirm } from './composables'

const confirmState = useConfirm()
</script>

<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <NotificationToast />
    <ConfirmModal
      v-model:isOpen="confirmState.isOpen.value"
      :title="confirmState.title.value"
      :message="confirmState.message.value"
      :confirmText="confirmState.confirmText.value"
      :cancelText="confirmState.cancelText.value"
      :variant="confirmState.variant.value"
      :loading="confirmState.loading.value"
      @confirm="confirmState.handleConfirm"
      @cancel="confirmState.handleCancel"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f7fa;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
