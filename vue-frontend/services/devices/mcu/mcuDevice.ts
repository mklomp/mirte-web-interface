import { MicroPythonFS } from "./micropythonFS"
import { MicroPythonREPL } from "./micropythonREPL"

import pythonMainCode from '@/assets/python/main.py?raw'
import pythonRobotCode from '@/assets/python/robot.py?raw'
import pythonNumbersCode from '@/assets/python/numbers.py?raw'
import bleAdvertisingCode from '@/assets/python/ble/ble_advertising.py?raw'
import blePeripheralCode from '@/assets/python/ble/ble_uart_peripheral.py?raw'
import bleREPLCode from '@/assets/python/ble/ble_uart_repl.py?raw'
import bootCode from '@/assets/python/boot.py?raw'

import * as YAML from 'js-yaml'

// The states of the MCU can be:
// - newly installed MicroPython (no MIRTE api)
// - uploaded MIRTE API (no mirte.py)
// - finished mirte.py (no while loop)
// - runnning mirte.py (while loop)
// - raw REPL (only theoretically, since we do not set it)


export class MCUDevice {
  fs
  repl

  constructor(private transport) {
    this.fs = new MicroPythonFS(transport)
    //this.repl = new MicroPythonREPL(transport)
  }

  async initialize() {
    await this.uploadMIRTEapi()

    // read settings from MCU
    const file = await this.fs.readFile("settings.yaml")
    const settings = YAML.load(file)
    useState("peripheral-settings").value = settings
  }

  async uploadFile(path, content) {
    await this.fs.writeFile(path, content)
  }

  async runCommand(cmd) {
    await this.fs.writeLine(cmd)
  }

  async startCode(toast = false) {
    const { addToast, removeToast } = useToast()
    useState("programming-state").value = "running";
    if (toast) { addToast('Sending code to robot....', 'info', 'uploading-user-code') }  
    await this.uploadFile('/mirte.py', useCodeStore().python)
    if (toast) { removeToast('uploading-user-code') } 
    await this.runCommand('run()\n') // imported from main.py
  }

  async stopCode() {
    await this.runCommand("\x03"); // CTRL-C
    useState("programming-state").value = "idle";
  }

  async uploadMIRTEapi() {
    // adding main.py, and mirte_robot files
    await this.uploadFile("/main.py", pythonMainCode)

    // numbers.py this is needed for generated blockly varibale change by block
    await this.uploadFile("/numbers.py", pythonNumbersCode) 
    await this.uploadFile("/settings.yaml", "")
    await this.uploadFile("/mirte.py", "")

    // MIRTE python api
    await this.fs.mkdir("mirte_robot")
    await this.uploadFile("/mirte_robot/robot.py", pythonRobotCode)
    await this.uploadFile("/mirte_robot/__main__.py", "")

    // BLE api
    await this.fs.mkdir("ble")
    await this.uploadFile("/ble/ble_advertising.py", bleAdvertisingCode)
    await this.uploadFile("/ble/ble_uart_peripheral.py", blePeripheralCode)
    await this.uploadFile("/ble/ble_uart_repl.py", bleREPLCode)
    await this.uploadFile("/ble/__main__.py", "")
    await this.uploadFile("/boot.py", bootCode)

  }

}