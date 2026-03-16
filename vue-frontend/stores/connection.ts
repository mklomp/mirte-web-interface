import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    compute_type: "",
    connection_type: "",
    ip_address: "192.168.43.1"
  }),

  actions: {
    loadFromLocalStorage() {
      if (process.client) {
        let full_state = JSON.parse(localStorage.getItem('connection'))
        this.compute_type = full_state.compute || ""
        this.connection_Type = full_state.connection || ""
      }
    },
    setConnection(compute, connection) {
      this.compute_type = compute
      this.connection_type = connection
      let full_state = { compute: this.compute_type, connection: this.connection_type }
      localStorage.setItem('connection', JSON.stringify(full_state))
    }
  }
})