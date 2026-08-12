import { defineStore } from 'pinia'

export const usePeripheralStore = defineStore('peripherals', {
  state: () => ({
    peripherals: {},
    controls: { 'driveEnabled': '', motors: { 'left_motor': '', 'right_motor': '' } }
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

    setControl(left_motor, right_motor) {
      this.controls.motors['left_motor'] = left_motor
      this.controls.motors['right_motor'] = right_motor
      if (this.controls.driveEnabled === "") { this.controls.driveEnabled = true}
      localStorage.setItem('controls', JSON.stringify(this.controls))
    },

    setControlAll(left_motor, right_motor, driveEnabled) {
      this.controls.motors['left_motor'] = left_motor
      this.controls.motors['right_motor'] = right_motor
      this.controls['driveEnabled'] = driveEnabled
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