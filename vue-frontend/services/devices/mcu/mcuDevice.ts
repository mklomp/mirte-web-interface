import { MicroPythonFS } from "./micropythonFS"
import { MicroPythonREPL } from "./micropythonREPL"

import pythonMainCode from '@/assets/python/main.py?raw'
import pythonRobotCode from '@/assets/python/robot.py?raw'

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

  async uploadMIRTEapi(){
    // adding main.py, and mirte_robot files
    await this.uploadFile("/main.py", pythonMainCode)
    await this.fs.mkdir("mirte_robot")
    await this.uploadFile("/mirte_robot/robot.py", pythonRobotCode)
    await this.uploadFile("/mirte_robot/__main__.py", "")
    useState("programming-state").value = "idle"
  }

}