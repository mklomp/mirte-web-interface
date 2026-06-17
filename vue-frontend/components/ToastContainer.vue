<template>
  <div class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="toast.type"
    >
      <button
        v-if="toast.duration === -1"
        class="toast-close"
        @click="removeToast(toast.id)"
      >
        ×
      </button>

      <div v-html="toast.message" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()
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
  position: relative;
  display: inline-block;
  width: fit-content;
  padding: 10px 16px;
  padding-right: 40px;
  border-radius: 8px;
  color: white;
}

.toast-close {
  position: absolute;
  top: 6px;
  right: 6px;

  width: 22px;
  height: 22px;

  border: none;
  border-radius: 50%;

  cursor: pointer;

  background: rgba(255, 255, 255, 0.2);
  color: white;

  font-size: 14px;
  line-height: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>