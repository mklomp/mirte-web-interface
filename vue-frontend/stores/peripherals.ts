import { defineStore } from 'pinia'

export const usePeripheralStore = defineStore('peripherals', {
  state: () => ({
    peripherals: {}
  }),

  actions: {
    async loadFromLocalStorage() {
      if (!process.client) return

      try {
        const stored = localStorage.getItem('peripherals');
        if (!stored) return
        this.peripherals = JSON.parse(stored)
      } catch (e) {
        console.warn("Failed to parse peripherals from localStorage", e)
      }
    },

    async setPeripherals(value, showToast = true) {
      const { addToast } = useToast()
      const { $i18n } = useNuxtApp()
      const connectionStore = useConnectionStore()

      this.peripherals = value
      localStorage.setItem('peripherals', JSON.stringify(this.peripherals))

      // and store to the robot
      if (connectionStore.status == "connected") {
        const { uploadSettings } = useConnection()
        await uploadSettings(value)
        addToast($i18n.t('toast.saved_settings_success'), 'success', 'settings-status')
      } else {
        if (showToast) {
          addToast($i18n.t('toast.saved_settings_locally'), 'info', 'settings-status')
        }
      }
    }
  }
})