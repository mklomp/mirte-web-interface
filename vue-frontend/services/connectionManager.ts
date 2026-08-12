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
  private print_buffer = ""
  private exception_buffer = ""
  private running = false
  private buffer_status = "filter" // "filter, print, exception"

  private start_tag = "__START__\r\n"
  private stop_tag = "__STOP__\r\n"
  private start_exception_tag = "__START_EXCEPTION__\r\n"
  private stop_exception_tag = "__STOP_EXCEPTION__\r\n"
  private heartbeat_tag = "__HB__\r\n"

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


  parseException(exception_text: string) {
    const { $i18n } = useNuxtApp()
    const match = exception_text.match(/File "<string>", line (\d+), in .*?\r?\n([\s\S]*)/);

    if (match) {
      const line = Number(match[1]);
      const error = match[2].trim();

      const message = $i18n.t('toast.error_in_line') + ": " + line + "\r\n\r\n" + error;
      return message
    }

    return exception_text
  }

  parseData(data) {

    const { addToast } = useToast()
    this.buffer += data

    // detecting heartbeat __HB__, and removing if found
    if (this.transporttype == "ble" && this.buffer.includes(this.heartbeat_tag)) {
      this.buffer = this.buffer.replaceAll(this.heartbeat_tag, "") // remove all heartbeats
      this.lastHeartbeat = Date.now()
    }

    // make sure not to print the output of the main.py
    // code which was started on boot of the MCU
    if (this.running) {

      // detecting __START__
      if (this.buffer.includes(this.start_tag)) {
        const idx = this.buffer.indexOf(this.start_tag)
        this.buffer = this.buffer.slice(idx + this.start_tag.length) // throw away everyting before __START__
        this.buffer_status = "print"
        // Note that we cannot fill the print_buffer since there might be other tags in the buffer
      }

      // detecting __START_EXCEPTION__
      if (this.buffer.includes(this.start_exception_tag)) {
        const idx = this.buffer.indexOf(this.start_exception_tag)

        this.print_buffer += this.buffer.slice(0, idx) // everything before this tag can be printed
        this.buffer = this.buffer.slice(idx + this.start_exception_tag.length) // and throw away everyting before __START_EXCEPTION__
        this.buffer_status = "exception"
        // Note that we cannot fill the exception_buffer since there might be other tags in the buffer
      }

      // detecting __STOP_EXCEPTION__
      if (this.buffer.includes(this.stop_exception_tag)) {
        const idx = this.buffer.indexOf(this.stop_exception_tag)

        this.exception_buffer += this.buffer.slice(0, idx) // everything before this tag is part of the exception
        this.buffer = this.buffer.slice(idx + this.stop_exception_tag.length) // throw away everyting before __STOP_EXCEPTION__
        this.buffer_status = "print"

        // the exception can be shown
        let parsed_exception = this.parseException(this.exception_buffer)
        addToast(parsed_exception, 'error', 'code-error')
        this.exception_buffer = ""
      }

      // detecting __STOP__
      if (this.buffer.includes(this.stop_tag)) {
        const idx = this.buffer.indexOf(this.stop_tag)

        this.print_buffer = this.buffer.slice(0, idx) // everything before this tag is part of the print
        this.buffer = this.buffer.slice(idx + this.stop_tag.length) // throw away everyting before __STOP__
        this.buffer_status = "filter"

        // we can stop the code
        useState("programming-state").value = "idle"
        this.running = false
      }

      // Now that we parsed all tags (or none were found)
      // we can add the (remaining) buffer to the right print/expection buffer
      // but only if we know that the end is not posiibly part of 
      // a new tag

      // if no _ found in the last part of the buffer
      if (!this.buffer.includes("_")) {
        if (this.buffer_status == "exception") {
          this.exception_buffer += this.buffer
        }

        if (this.buffer_status == "print") {
          this.print_buffer += this.buffer
        }
        this.buffer = ""
      }

      // now we can safely print and clear the print_buffer
      if (!this.debug) {
        this.term.write(this.print_buffer)
        this.print_buffer = ""
      }
    } else {
      this.buffer = ""
    }

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
        this.parseData(data)
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
      return true
    }

    // TODO: these should be no difference between sbc and mcu. Just different transport and devices.
    if (type === "sbc") {
      this.transport = new NetworkTransport()
      let socket = this.transport.connect()
      addToast($i18n.t('toast.connected_and_initializing'), 'info', 'connection-status', 0)

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
      await this.device.waitForPrompt()
      useState("programming-state").value = "idle"
      addToast($i18n.t('toast.connected'), 'success', 'connection-status')
      return true
      //}
    }

    // 
    return false
  }

  attachTerminal(term) {
    this.term = term
    this.debug = useState("debug").value

    // Send user input to transport
    this.term.onData(async (data) => {
      if (!this.transport) return
      await this.transport.write(data)
    })
  }

  startCode() {
    const { addToast } = useToast()
    if (!this.debug) { this.term.write('\x1bc'); } // full terminal reset
    addToast('', 'error', 'code-error') // clear the exception toast
    this.running = true
    this.device.startCode(this.transporttype == "ble")
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
    // remove all code toasts
    const { addToast } = useToast()
    addToast('', 'error', 'code-error') // clear the exception toast

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