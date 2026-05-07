<template>
  <div class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="toast.type"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'
const { toasts } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999999;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  display: inline-block;
  width: fit-content;
  padding: 10px 16px;
  border-radius: 8px;
  color: white;
}

.toast.info { background: #333; }
.toast.success { background: #2e7d32; }
.toast.warning { background: #ed6c02; }
.toast.error { background: #c62828; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>