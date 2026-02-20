import { defineStore } from 'pinia'

export const useRosStore = defineStore('ros_params', {
  state: () => ({
    peripherals: {}
  }),

  actions: {
    setPeripherals(value) {
      this.peripherals = value
    }
  }
})