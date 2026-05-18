import { SerialTransport } from "@/services/transports/serialTransport"
import { BLETransport } from "~/services/transports/BLETransport"
//import { USBTransport } from "./transports/usbTransport"

import { MCUDevice } from "./devices/mcu/mcuDevice"
//import { SBCDevice } from "./devices/sbc/sbcDevice"

export class ConnectionManager {

  transport: any = null
  device: any = null
  transporttype: string = ""
  term: any = null
  debug: boolean = false

  private buffer = ""
  private running = false
  private started_found = false
  private stopped_found = false
  private lastHeartbeat = Date.now()
  private heartbeatTimer = {}

  startHeartbeatMonitor() {
    const { addToast } = useToast()
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

  async connect(type: "mcu" | "sbc", transport: "serial" | "ble", autoconnect = false) {
    this.transporttype = transport
    const { addToast } = useToast()
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

        this.buffer += data

        // detecting heartbeat __HB__, and removing if found
        if (this.buffer.includes("__HB__\r\n")) {
          this.buffer = this.buffer.replaceAll("__HB__\r\n", "") // remove all heartbeats (except when in debug)
          this.lastHeartbeat = Date.now()
        }

        if (!this.term) return

        if (this.running) {

          // detecting __START__, only stripping the buffer
          if (this.buffer.includes("__START__\r\n")) {
            this.buffer = this.buffer.split("__START__\r\n")[1] // throw away everyting before __START__
            this.started_found = true
          }

          // detecting __STOP__, only stripping the buffer
          if (this.buffer.includes("__STOP__\r\n")) {
            this.stopped_found = true
            this.buffer = this.buffer.split("__STOP__\r\n")[0] // throw away everything after __STOP__
            useState("programming-state").value = "idle"
          }

          // write and remove all newlines in the buffer
          if (this.started_found) {
            let index
            while ((index = this.buffer.indexOf("\r\n")) !== -1) {
              const line = this.buffer.slice(0, index + 1)
              this.buffer = this.buffer.slice(index + 1)
              if (!this.debug) {
                this.term.write(line)
              }
            }
          }

          // clear the buffer after __STOP__
          if (this.stopped_found) {
            this.buffer = ""
            this.started_found = false
            this.stopped_found = false
          }
        }

        if (this.debug) {
          this.term.write(data)
        }

      })

      // make sure the terminal is in a determined state
      // by killing (possibly running) main. 
      // TODO: should we also stop raw-REPL (eg if you were conncted to thonny)
      // TODO: is this the right place to do this?
      await this.transport.write('\x03') // CTRL-C (kill main)
      await new Promise(r => setTimeout(r, 200))

      this.device = new MCUDevice(this.transport)
      if (transport == "serial") {
        // TODO: we should check if code is already there. If not then
        // upload, and do CTRL-D to make sure BLE is initialized
        // TODO: can we check if system had BLE, so we can only upload
        // the things we need?
        try {
          if (this.debug) {
            addToast('Uploading MIRTE scripts.', 'info', 'connection-status')
          }
          await this.device.initialize()
        } catch (error) {
          addToast('Failed to upload MIRTE scripts.', 'error', 'connection-status')
        }

        //await this.transport.write('\x04') // CTRL-D (soft reboot)
      }

      await this.transport.write('from main import run\r\n')
      await new Promise(r => setTimeout(r, 200))
      if (this.term) { this.term.clear() }

      if (connection.autoConnected) {
        addToast('Automatically connected to known robot.', 'success', 'connection-status')
      } else {
        addToast('Connected to robot.', 'success', 'connection-status')
      }

      connectionStore.setConnectionStatus("connected")
      useState("programming-state").value = "idle"
      useConnectionStore().setConnectionType(transport, type)

    }

    /*if (type === "sbc") {
      this.transport = new USBTransport()
      await this.transport.connect()
   
      this.device = new SBCDevice(this.transport)
    }*/

    // 

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
    this.running = false
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
}