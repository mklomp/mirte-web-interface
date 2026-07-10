<template>
  <div v-if="modals.length" class="modal-overlay">
    <div v-for="modal in modals" :key="modal.id" class="modal-wrapper">



      <div class="modal-content">
        <div class="modal-body">
          <component :is="modal.component" v-bind="modal.props" @close="closeModal(modal.id)" />
        </div>
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

  background: rgba(0, 0, 0, 0.5);
  /* opaque background */
  z-index: 100;
  /* below navbar */

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  display: flex;
}

.modal-content {
  width: 60vw;
  max-width: 900px;
  height: 80vh;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  background: white;
  border-radius: 12px;
}

.modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
}

</style>