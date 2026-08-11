import { ref } from 'vue'

type ToastType = 'info' | 'success' | 'warning' | 'error'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
}

const toasts = ref<Toast[]>([])

const timers = new Map<string, ReturnType<typeof setTimeout>>()

export function useToast() {

  function addToast(
    message: string,
    type: ToastType = 'info',
    id?: string,
    duration = 5
  ) {
    if (message == "") { removeToast(id); return; }
    if (type == "error") { duration = -1 }
    const toastId = id ?? `${Date.now()}`

    const formattedMessage = message.replace(/\n/g, '<br>')

    const existingIndex = toasts.value.findIndex(t => t.id === toastId)

    if (existingIndex !== -1) {
      toasts.value[existingIndex] = {
        ...toasts.value[existingIndex],
        message: formattedMessage,
        type,
        id: toastId,
        duration,
      }
    } else {
      toasts.value.push({
        id: toastId,
        message: formattedMessage,
        type,
        duration,
      })
    }

    if (timers.has(toastId)) {
      clearTimeout(timers.get(toastId)!)
      timers.delete(toastId)
    }

    if (duration !== -1) {
      const timer = setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== toastId)
        timers.delete(toastId)
      }, duration * 1000)

      timers.set(toastId, timer)
    }
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)

    if (timers.has(id)) {
      clearTimeout(timers.get(id)!)
      timers.delete(id)
    }
  }

  return {
    toasts,
    addToast,
    removeToast
  }
}