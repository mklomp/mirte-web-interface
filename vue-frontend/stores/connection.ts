import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    transport: "",
    device: "",
    ip_address: "192.168.43.1"
  }),

  actions: {
    loadFromLocalStorage() {
      if (process.client) {
        let full_state = JSON.parse(localStorage.getItem('connection'))
        this.transport = full_state.transport || ""
        this.device = full_state.device || ""
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