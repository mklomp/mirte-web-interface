import { MicroPythonFS } from "./micropythonFS"

import pythonMainCode from '@/assets/python/main.py?raw'
import pythonRobotCode from '@/assets/python/robot.py?raw'
import pythonNumbersCode from '@/assets/python/numbers.py?raw'
import bleAdvertisingCode from '@/assets/python/ble/ble_advertising.py?raw'
import blePeripheralCode from '@/assets/python/ble/ble_uart_peripheral.py?raw'
import bleREPLCode from '@/assets/python/ble/ble_uart_repl.py?raw'
import bootCode from '@/assets/python/boot.py?raw'

// hardware peripherals
import pythonDistanceCode from '@/assets/python/hcsr04.py?raw'

import * as YAML from 'js-yaml'

// The states of the MCU can be:
// - newly installed MicroPython (no MIRTE api)
// - uploaded MIRTE API (no mirte.py)
// - finished mirte.py (no while loop)
// - runnning mirte.py (while loop)
// - raw REPL (only theoretically, since we do not set it)

import { usePeripheralStore } from '@/stores/peripherals'

export class MCUDevice {
  transport
  fs
  peripheralStore

  constructor(private transport) {
    this.fs = new MicroPythonFS(transport)
    this.peripheralStore = usePeripheralStore()
    this.transport = transport
  }

  async initialize() {
    // Check if one of the (empty) MIRTE files are there
    // We should actually only do this in USB mode, but 
    // if it was able to connect to BLE the code should
    // have been uploaded anyway.
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()
    const mirte_check_file = await this.fs.readFile("/mirte_robot/__main__.py")
    if (mirte_check_file == "__READ_ERROR__\r\n") {
      addToast($i18n.t('toast.uploading_mirte_scripts'), 'info', 'connection-status')
      try {
        await this.uploadMIRTEapi()
        //await this.transport.write('\x04') // CTRL-D (soft reboot)
      } catch (error) {
        addToast($i18n.t('toast.uploading_mirte_scripts_error'), 'error', 'connection-status')
      }
    }
    await this.loadSettings()
  }

  async loadSettings() {
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()

    // read settings from MCU and local
    const file = await this.downloadFile(".settings.json")
    let robotSettings = {}
    if (file.trim() !== "") {
      try {
        robotSettings = JSON.parse(file)
      } catch {
        addToast($i18n.t('toast.downloading_mirte_config_error'), 'error')
      }
    }

    const localsettings = this.peripheralStore.peripherals

    if (Object.keys(robotSettings).length < 2) { // robot settings are empty or just "device"
      if (Object.keys(localsettings).length < 2) { // local setting is empty or just "device"
        // NOP
      } else {
        // upload localSettings to robotSettings
        this.uploadFile(".settings.json", JSON.stringify(localsettings))
      }
    } else {
      if (Object.keys(localsettings).length < 2) { // local setting is empty or just "device"
        // save the robot settings to local settings
        this.peripheralStore.setPeripherals(robotSettings)
        addToast($i18n.t('toast.downloading_mirte_config'), 'info')
      } else { // localsettings is not empty
        if (JSON.stringify(localsettings) !== JSON.stringify(robotSettings)) { // local and robot setting are not the same
          // save the robot settings to local settings
          addToast($i18n.t('toast.downloading_mirte_config_compare_error'), 'error')
          this.peripheralStore.setPeripherals(robotSettings)
        }
      }
    }


  }

  async downloadFile(file) {
    const data = await this.fs.readFile(file)
    return data
  }

  async uploadFile(path, content) {
    await this.fs.writeFile(path, content)
  }

  async runCommand(cmd) {
    await this.fs.writeLine(cmd)
  }

  async reinstallMIRTE() {
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()
    addToast($i18n.t('toast.uploading_mirte_scripts'), 'info', 'connection-status')
    try {
      await this.clearFiles()
      await this.uploadMIRTEapi()
    } catch {
      addToast($i18n.t('toast.uploading_mirte_scripts_error'), 'error', 'connection-status')
    }
  }

  async clearFiles() {
    await this.fs.removeFile("mirte.py")
    await this.fs.removeFile("settings.yaml")
    await this.fs.removeFile("mirte_robot/__main__.py")
    await this.fs.removeFile("mirte_robot/robot.py")
    await this.fs.removeFolder("mirte_robot")
    await this.fs.removeFile(".settings.json")
    await this.fs.removeFile("boot.py")
    await this.fs.removeFile("hcsr04.py")
    await this.fs.removeFile("main.py")
    await this.fs.removeFile("numbers.py")
    await this.fs.removeFile("ble/__main__.py")
    await this.fs.removeFile("ble/ble_advertising.py")
    await this.fs.removeFile("ble/ble_uart_repl.py")
    await this.fs.removeFile("ble/ble_uart_peripheral.py")
    await this.fs.removeFolder("ble")
  }

  async startCode(toast = false) {
    const { addToast, removeToast } = useToast()
    const { $i18n } = useNuxtApp()
    useState("programming-state").value = "running";
    if (toast) { addToast($i18n.t('toast.uploading_code'), 'info', 'uploading-user-code') }
    await this.uploadFile('/mirte.py', useCodeStore().python)
    if (toast) { removeToast('uploading-user-code') }
    await this.runCommand('run()\n') // imported from main.py
  }

  async stopCode() {
    await this.runCommand("\x03"); // CTRL-C
  }

  async uploadMIRTEapi() {
    // adding main.py, and mirte_robot files
    await this.uploadFile("/main.py", pythonMainCode)

    // numbers.py this is needed for generated blockly varibale change by block
    await this.uploadFile("/numbers.py", pythonNumbersCode)
    await this.uploadFile("/.settings.json", "")
    await this.uploadFile("/mirte.py", "")

    // MIRTE python api
    await this.fs.mkdir("mirte_robot")
    await this.uploadFile("/mirte_robot/robot.py", pythonRobotCode)
    await this.uploadFile("/mirte_robot/__main__.py", "")
    // add peripherals (TODO: only when in code)
    await this.uploadFile("/hcsr04.py", pythonDistanceCode)

    useState("programming-state").value = "idle"

    // BLE api
    await this.fs.mkdir("ble")
    await this.uploadFile("/ble/ble_advertising.py", bleAdvertisingCode)
    await this.uploadFile("/ble/ble_uart_peripheral.py", blePeripheralCode)
    await this.uploadFile("/ble/ble_uart_repl.py", bleREPLCode)
    await this.uploadFile("/ble/__main__.py", "")
    //await this.uploadFile("/boot.py", bootCode)

  }

}