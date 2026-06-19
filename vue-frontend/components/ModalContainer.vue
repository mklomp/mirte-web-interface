<template>
  <div v-if="modals.length" class="modal-overlay">
    <div
      v-for="modal in modals"
      :key="modal.id"
      class="modal-wrapper"
    >
      <div class="modal-content">
        <button class="modal-close" @click="closeModal(modal.id)">×</button>

        <component
          :is="modal.component"
          v-bind="modal.props"
          @close="closeModal(modal.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModal } from '~/composables/useModal'

const { modals, closeModal } = useModal()
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.5); /* opaque background */
  z-index: 100; /* below navbar */

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  display: flex;
}

.modal-content {
  position: relative;

  width: 60vw;
  max-width: 900px;

  background: white;
  border-radius: 12px;
  padding: 24px;

  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.modal-close {
  position: absolute;
  top: 8px;
  right: 8px;

  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
}
</style>