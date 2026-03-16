import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    compute_type: "",
    connection_type: "",
    ip_address: "192.168.43.1",
    usb_port: ""
  }),

  actions: {
    loadFromLocalStorage() {
      if (process.client) {
        let connection = localStorage.getItem('connection')
        this.compute_type = connection.compute || ""
        this.connection = connection.connection || ""
      }
    },
    setConnection(compute, connection) {
      this.compute_type = compute
      this.connection_type = connection
      let state = { compute: compute, conection: connection }
      localStorage.setItem('connection', JSON.stringify(state))
    }
  }
})