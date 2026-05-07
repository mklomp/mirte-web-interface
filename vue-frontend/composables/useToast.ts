import { ref } from 'vue'

type ToastType = 'info' | 'success' | 'warning' | 'error'

interface Toast {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])

export function useToast() {
  function addToast(message: string, type: ToastType = 'info', duration = 10) {
    const id = Date.now()
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration * 1000)
  }

  return {
    toasts,
    addToast
  }
}