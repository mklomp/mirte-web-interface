import { ref, shallowRef, markRaw } from 'vue'

interface Modal {
  component: any
  props?: Record<string, any>
}

const modals = ref<Modal[]>([])

export function useModal() {
  function openModal(component: any, props = {}) {

    modals.value = [{
      component: markRaw(component), // prevent reactivity issues
      props
     }]
  }

  function closeModal() {
    modals.value = []
  }

  function isOpen(){
    return modals.value.length > 0
  }

  return {
    modals,
    openModal,
    closeModal,
    isOpen
  }
}