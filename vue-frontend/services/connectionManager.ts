import { SerialTransport } from "@/services/transports/serialTransport"
import { BLETransport } from "~/services/transports/BLETransport"
//import { USBTransport } from "./transports/usbTransport"

import { MCUDevice } from "./devices/mcu/mcuDevice"
//import { SBCDevice } from "./devices/sbc/sbcDevice"

export class ConnectionManager {

  transport: any = null
  device: any = null
  term: any = null
  debug: boolean = false

  private buffer = ""
  private running = false
  private started_found = false
  private stopped_found = false

  async connect(type: "mcu" | "sbc", transport: "serial" | "ble", autoconnect = false) {

    if (transport == "serial") {
      this.transport = new SerialTransport()
    } else if (transport == "ble") {
      this.transport = new BLETransport()
    }

    console.log(this.transport)
    if (type == "mcu") {

      let connection = await this.transport.connect(autoconnect)

      if (!connection) { return false }

      // We get the REPL data, which should be parsed on:
      //
      // "__START__": detecting when execution started (see main.py)
      // "__STOP__": detecting when execution stopped (see main.py)
      this.transport?.onData((data) => {

        if (!this.term) return
        console.log("newdata:")
        console.log(data)

        if (!this.debug && this.running) {
          this.buffer += data

          // detecting __START__, only stripping the buffer
          if (this.buffer.includes("__START__\r\n")) {
            this.buffer = this.buffer.split("__START__\r\n")[1] // throw away everyting before __START__
            this.started_found = true
          }

          // detecting __START__, only stripping the buffer
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
              this.term.write(line)
            }
          }

          // clear the buffer after __STOP__
          if (this.stopped_found) {
            this.buffer = ""
            this.started_found = false
            this.stopped_found = false
          }
        } else {
          this.term.write(data)
        }

      })

      // make sure the terminal is in a determined state
      // by killing (possibly running) main. 
      // TODO: should we also stop raw-REPL (eg if you were conncted to thonny)
      // TODO: is this the right place to do this?
      await this.transport.write('\x03') // CTRL-C (kill main)
      if (this.term) { this.term.clear() }
      await new Promise(r => setTimeout(r, 200))
      // TODO: instead of CTRL-D, we should do something else?
      await this.transport.write('\x02') // CTRL-B (make sure to be in interactive mode)
      //await new Promise(r => setTimeout(r, 200))
      //await this.transport.write('\x03') // CTRL-C (soft reoot started main again)

      this.device = new MCUDevice(this.transport)
      //await this.device.initialize()

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
      console.log(data)
      if (!this.transport) return
      await this.transport.write(data)
    })
  }

  startCode() {
    this.term.clear()
    this.device.startCode()
    this.running = true
    this.started_found = false
  }

  stopCode() {
    this.device.stopCode()
    this.running = false
  }


  async uploadFile(path, content) {
    console.log(path)
    console.log(content)
    await this.device.uploadFile(path, content)
  }

  async runCommand(cmd) {
    await this.device.runCommand?.(cmd)
  }

  disconnect() {
    this.transport?.disconnect?.()
    this.transport = null
    this.device = null
    if (this.term) { this.term.clear() }
  }
}