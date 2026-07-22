import { SerialTransport } from "@/services/transports/serialTransport"
import { BLETransport } from "@/services/transports/BLETransport"
import { NetworkTransport } from "@/services/transports/networkTransport"

import { MCUDevice } from "./devices/mcu/mcuDevice"
import { SBCDevice } from "./devices/sbc/sbcDevice"
import { useXtermConnection } from "~/composables/useRos"

export class ConnectionManager {

  transport: any = null
  device: any = null
  transporttype: string = ""
  term: any = null
  debug: boolean = false

  private buffer = ""
  private exception_buffer = ""
  private running = false
  private buffer_status = "filter" // "filter, print, exception"
  private next_status = "filter"
  private stopped_found = false
  private lastHeartbeat = Date.now()
  private heartbeatTimer = {}

  startHeartbeatMonitor() {
    this.lastHeartbeat = Date.now()

    this.heartbeatTimer = window.setInterval(() => {
      const now = Date.now()

      // 1.5 second timeout
      if (now - this.lastHeartbeat > 1100) {
        this.stopHeartbeatMonitor()
        this.disconnect(true)
      }
    }, 1100)
  }

  stopHeartbeatMonitor() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = {}
    }
  }


  parseData(data) {

    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()

    this.buffer += data

    // detecting heartbeat __HB__, and removing if found
    if (this.transporttype == "ble" && this.buffer.includes("__HB__\r\n")) {
      this.buffer = this.buffer.replaceAll("__HB__\r\n", "") // remove all heartbeats (except when in debug)
      this.lastHeartbeat = Date.now()
    }

    // make sure not to print the output of the main.py
    // code which was started on boot of the MCU
    if (this.running) {

      // detecting __START__, only stripping the buffer
      if (this.buffer.includes("__START__\r\n")) {
        const marker = "__START__\r\n"
        const idx = this.buffer.indexOf(marker)
        this.buffer = this.buffer.slice(idx + marker.length) // throw away everyting before __START__
        this.next_status = "print"
        // Just start printing, as long as it does not seem to be the start of an exception
        if (this.buffer.length > 0 && this.buffer[0] != "_") {
          this.buffer_status = "print"
        }
      }


      // detecting __START_EXCEPTION__, strip from buffer but keep exception
      else if (this.buffer.includes("__START_EXCEPTION__\r\n")) {
        const marker = "__START_EXCEPTION__\r\n"
        const idx = this.buffer.indexOf(marker)

        this.exception_buffer = this.exception_buffer + this.buffer.slice(idx + marker.length)
        this.buffer = this.buffer.slice(0, idx) // keep everything before
        this.next_status = "exception"
      }

      // detecting __STOP_EXCEPTION__, only stripping the buffer
      else if (this.buffer.includes("__STOP_EXCEPTION__\r\n")) {
        const marker = "__STOP_EXCEPTION__\r\n"
        const idx = this.buffer.indexOf(marker)

        this.exception_buffer = this.exception_buffer + this.buffer.slice(0, idx)
        this.buffer = this.buffer.slice(idx + marker.length)
        this.next_status = "print"

        addToast(this.exception_buffer, 'error', 'code-error')
        this.exception_buffer = ""
      }

      // detecting __STOP__, only stripping the buffer
      else if (this.buffer.includes("__STOP__\r\n")) {
        const marker = "__STOP__\r\n"
        const idx = this.buffer.indexOf(marker)


        this.next_status = "filter"
        this.stopped_found = true
        this.buffer = this.buffer.slice(0, idx) // throw away everything after __STOP__

        useState("programming-state").value = "idle"
      }

      // write and remove all newlines in the buffer
      if (this.buffer_status == "print") {
        let index
        while ((index = this.buffer.indexOf("\r\n")) !== -1) {
          const line = this.buffer.slice(0, index + 2)
          this.buffer = this.buffer.slice(index + 2)
          if (!this.debug) {
            this.term.write(line)
          }
        }
      }
    }

    // clear the buffer after __STOP__ or when not running
    if (this.stopped_found || !this.running) {
      const marker = "__HB__\r\n"
      const idx = this.buffer.indexOf(marker)
      if (this.transporttype == "ble" && idx > 0) {
        this.buffer = this.buffer.slice(idx + marker.length)
      } else {
        this.buffer = ""
      }

      this.stopped_found = false
      this.running = false
    }

    this.buffer_status = this.next_status

    if (this.debug) {
      this.term.write(data)
    }

  }



  async connect(type: "mcu" | "sbc", transport: "serial" | "ble" | "network", autoconnect = false) {
    this.transporttype = transport
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()
    const connectionStore = useConnectionStore()

    if (transport == "serial") {
      this.transport = new SerialTransport()
    } else if (transport == "ble") {
      this.transport = new BLETransport()
    }

    if (type == "mcu") {

      let connection = await this.transport.connect(autoconnect)

      if (!connection.connected) { return false }

      if (transport == "ble") { this.startHeartbeatMonitor() }

      // We get the REPL data, which should be parsed on:
      //
      // "__START__": detecting when execution started (see main.py)
      // "__STOP__": detecting when execution stopped (see main.py)
      this.transport?.onData((data) => {
        this.term.write(data)
        //this.parseData(data)
      })

      // make sure the terminal is in a determined state
      // by killing (possibly running) main. 
      // TODO: should we also stop raw-REPL (eg if you were conncted to thonny)
      // TODO: is this the right place to do this?
      await this.transport.write('\x03') // CTRL-C (kill main)
      await new Promise(r => setTimeout(r, 200))

      this.device = new MCUDevice(this.transport)
      await this.device.initialize()

      await this.transport.write('from main import run\r\n')
      await new Promise(r => setTimeout(r, 200))
      if (this.term && !this.debug) { this.term.write('\x1bc'); } // full terminal reset

      if (connection.autoConnected) {
        addToast($i18n.t('toast.automatically_connected'), 'success', 'connection-status')
      } else {
        addToast($i18n.t('toast.connected'), 'success', 'connection-status')
      }
      connectionStore.setConnectionStatus("connected")
      useState("programming-state").value = "idle"
      useConnectionStore().setConnectionType(type, transport)
      return true
    }

    // TODO: these should be no difference between sbc and mcu. Just different transport and devices.
    if (type === "sbc") {
      this.transport = new NetworkTransport()
      let socket = this.transport.connect()
      addToast($i18n.t('toast.connected_and_initializing'), 'info', 'connection-status', -1)

      this.transport?.onData((data) => {
        this.parseData(data)
      })

      // we need to reinitialize the terminal as soon as ROS is connected
      let ros = useRos()
      ros.on('connection', () => {
        let socket = this.transport.connect()
        this.device.initializeTerm(socket)
      })

      this.device = new SBCDevice(this.transport)
      //this.device.initializeTerm(socket)
      this.device.initializeROS()
      connectionStore.setConnectionStatus("connected")
      useConnectionStore().setConnectionType(type, transport)
      await this.device.waitForPrompt()
      useState("programming-state").value = "idle"
      addToast($i18n.t('toast.connected'), 'success', 'connection-status')
      return true
      //}
    }

    // 
    return false
  }

  attachTerminal(term, debug) {
    this.term = term
    this.debug = debug

    // Send user input to transport
    this.term.onData(async (data) => {
      if (!this.transport) return
      await this.transport.write(data)
    })
  }

  startCode() {
    if (!this.debug) { this.term.write('\x1bc'); } // full terminal reset
    this.device.startCode(this.transporttype == "ble")
    this.running = true
    this.started_found = false
  }

  stopCode() {
    this.device.stopCode()
  }

  async reinstallMIRTE() {
    await this.device.reinstallMIRTE()
  }

  async uploadSettings(content) {
    await this.device.uploadSettings(content)
  }

  async uploadFile(path, content) {
    await this.device.uploadFile(path, content)
  }

  async runCommand(cmd) {
    await this.device.runCommand?.(cmd)
  }

  disconnect(connectionLost = false) {
    this.transport?.disconnect?.(connectionLost)
    this.transport = null
    this.device = null
    this.hbInterval = {}
    if (this.term) { this.term.write('\x1bc'); } // full terminal reset
  }

  getTransport() {
    return this.transport
  }
}