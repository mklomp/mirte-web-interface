import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    transport: "",
    device: "",
    ip_address: "192.168.43.1"
  }),

  actions: {
    loadFromLocalStorage() {
      if (!process.client) return

      try {
        const stored = localStorage.getItem('connection')
        if (!stored) return

        const full_state = JSON.parse(stored)

        this.transport = full_state?.transport ?? ""
        this.device = full_state?.device ?? ""
      } catch (e) {
        console.warn("Failed to parse connection from localStorage", e)
      }
    },
    setConnection(transport, device) {
      this.transport = transport
      this.device = device
      let full_state = { transport: this.transport, device: this.device }
      localStorage.setItem('connection', JSON.stringify(full_state))
    }
  }
})