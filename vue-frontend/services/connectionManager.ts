import { SerialTransport } from "@/services/transports/serialTransport"
//import { USBTransport } from "./transports/usbTransport"

import { MCUDevice } from "./devices/mcu/mcuDevice"
//import { SBCDevice } from "./devices/sbc/sbcDevice"

export class ConnectionManager {

  transport: any = null
  device: any = null
  term: any = null

  privat
  private buffer = ""
  private running = false
  private started_found = false

  async connect(type: "mcu" | "sbc", autoconnect = false) {

    this.disconnect()

    if (type == "mcu") {
      this.transport = new SerialTransport()
      await this.transport.connect(autoconnect)

      console.log("hieeerr...")

      // We get the REPL data, which should be parsed on:
      //
      // "__START__": detecting when execution started (see main.py)
      // "__STOP__": detecting when execution stopped (see main.py)
      this.transport?.onData((data) => {
        if (!this.term || !this.running) return

        this.buffer += data

        if (this.started_found) {
          this.term.write(data)
        }
        if (this.buffer.includes("__START__\r\n")){
          const stripped_data = this.buffer.split("__START__\r\n")[1]
          this.term.write(stripped_data)
          this.buffer = ""
          this.started_found = true
        }
        // TODO: I should alos detect the case that __START__ and __STOP__ are in the same buffer (eg, no/minimal ouput)

        // Also detect if the program itself gave a stopped
        if (this.buffer.includes("__STOP__\r\n")){
          const stripped_data = this.buffer.split("__STOP__\r\n")[0]
          this.term.write(stripped_data)
          this.buffer = ""
          useState("programming-state").value = "idle"
        }
        
      })

      // make sure the terminal is in a determined state
      // by killing (possibly running) main. 
      // TODO: should we also stop raw-REPL (eg if you were conncted to thonny)
      // TODO: is this the right place to do this?
      await this.transport.write('\x03') // CTRL-C (kill main)
      if (this.term) { this.term.clear() }
      await new Promise(r => setTimeout(r, 200))
      await this.transport.write('\x04') // CTRL-D (soft reboot)
      await new Promise(r => setTimeout(r, 200))
      await this.transport.write('\x03') // CTRL-C (soft reoot started main again)

      console.log("en hierrr....")

      this.device = new MCUDevice(this.transport)
      await this.device.initialize()


      console.log("en initialized....")
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