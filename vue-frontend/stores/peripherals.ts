import { defineStore } from 'pinia'

export const usePeripheralStore = defineStore('peripherals', {
  state: () => ({
    peripherals: {},
    controls: {'left_motor' : '', 'right_motor': ''}
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

      try {
        const stored = localStorage.getItem('controls');
        if (!stored) return
        this.controls = JSON.parse(stored)
      } catch (e) {
        console.warn("Failed to parse peripherals from localStorage", e)
      }

    },

    setControl(left_motor, right_motor){
      this.controls['left_motor'] = left_motor
      this.controls['right_motor'] = right_motor
      localStorage.setItem('controls', JSON.stringify(this.controls))
    },

    async setPeripherals(value, showToast = true, onlyLocally = false) {

      const { addToast } = useToast()
      const { $i18n } = useNuxtApp()
      const connectionStore = useConnectionStore()

      this.peripherals = value
      localStorage.setItem('peripherals', JSON.stringify(this.peripherals))

      // and store to the robot
      if (connectionStore.status == "connected") {
        if (!onlyLocally) {
          const { uploadSettings } = useConnection()
          await uploadSettings(value)
          addToast($i18n.t('toast.saved_settings_success'), 'success', 'settings-status')
        }
      } else {
        if (showToast) {
          addToast($i18n.t('toast.saved_settings_locally'), 'info', 'settings-status')
        }
      }
    }
  }
})