import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('connection', {
  state: () => ({
    transport: "",
    device: "",
    hostname: "",
    status: "disconnected",
    ros_status: "disconnected"
  }),

  actions: {
    async loadFromLocalStorage() {

      if (!process.client) return

      try {
        const stored = localStorage.getItem('connection');
        if (!stored) return

        const full_state = JSON.parse(stored)

        this.transport = full_state?.transport ?? this.transport
        this.device = full_state?.device ?? this.device
        this.status = full_state?.status ?? this.status

        // Reset status to disconnected if no previous connections were found
        // This happens when someone resets the known deviced while the status
        // was still connected
        if (this.device == "mcu") {
          const ports = await navigator.serial.getPorts()
          if (ports.length == 0) { this.setConnectionStatus("disconnected") }
        }

      } catch (e) {
        console.warn("Failed to parse connection from localStorage", e)
      }
    },
    setConnectionDevice(device) {
      this.device = device

      // update localstorage
      const connection = JSON.parse(localStorage.getItem('connection')) || {};
      connection.device = device
      localStorage.setItem('connection', JSON.stringify(connection))
    },
    setConnectionTransport(transport) {
      this.transport = transport

      // update localstorage
      const connection = JSON.parse(localStorage.getItem('connection')) || {};
      connection.transport = transport
      localStorage.setItem('connection', JSON.stringify(connection))
    },
    setConnectionHostname(hostname: string) {
      this.hostname = hostname

      // update localstorage
      const connection = JSON.parse(localStorage.getItem('connection')) || {};
      connection.hostname = hostname
      localStorage.setItem('connection', JSON.stringify(connection))
    },
    setConnectionStatus(status: string) {
      // update store
      this.status = status

      // update localstorage
      const connection = JSON.parse(localStorage.getItem('connection')) || {};
      connection.status = status
      localStorage.setItem('connection', JSON.stringify(connection))
    }
  }
})