import { SerialTransport } from "@/services/transports/serialTransport"
//import { USBTransport } from "./transports/usbTransport"

import { MCUDevice } from "./devices/mcu/mcuDevice"
//import { SBCDevice } from "./devices/sbc/sbcDevice"

export class ConnectionManager {

  transport: any = null
  device: any = null
  term: any = null

  async connect(type: "mcu" | "sbc", autoconnect = false) {

    this.disconnect()

    if (type == "mcu") {
      this.transport = new SerialTransport()
      await this.transport.connect(autoconnect)

      this.transport?.onData((data) => {
        if (!this.term) return
        this.term.write(data)
      })

      // make sure the terminal is in a determined state
      // by killing (possibly running) main. 
      // TODO: should we also stop raw-REPL (eg if you were conncted to thonny)
      await this.transport.write('\x03') // CTRL-C (kill main)
      if (this.term) { this.term.clear() }
      await new Promise(r => setTimeout(r, 200))
      await this.transport.write('\x04') // CTRL-D (soft reboot)
      await new Promise(r => setTimeout(r, 200))
      await this.transport.write('\x03') // CTRL-C (soft reoot started main again)
      
      this.device = new MCUDevice(this.transport)
      await this.device.initialize()

      useConnectionStore().setConnection("serial", type)
    }

    /*if (type === "sbc") {
      this.transport = new USBTransport()
      await this.transport.connect()

      this.device = new SBCDevice(this.transport)
    }*/

    // 

  }

  attachTerminal(term) {
    this.term = term

    // Send user input to transport
    this.term.onData(async (data) => {
      if (!this.transport) return
      await this.transport.write(data)
    })
  }

  async uploadFile(path, content) {
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