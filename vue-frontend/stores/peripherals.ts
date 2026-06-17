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

    setPeripherals(value) {
      this.peripherals = value
      localStorage.setItem('peripherals', JSON.stringify(this.peripherals))
    }
  }
})