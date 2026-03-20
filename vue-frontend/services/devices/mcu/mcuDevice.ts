import { MicroPythonFS } from "./micropythonFS"
import { MicroPythonREPL } from "./micropythonREPL"

import pythonMainCode from '@/assets/python/main.py?raw'
import pythonRobotCode from '@/assets/python/robot.py?raw'

export class MCUDevice {
  fs
  repl

  constructor(private transport) {
    this.fs = new MicroPythonFS(transport)
    //this.repl = new MicroPythonREPL(transport)
  }

  async initialize() {
    //await this.repl.enterRawMode()
    await this.uploadMIRTEapi()
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