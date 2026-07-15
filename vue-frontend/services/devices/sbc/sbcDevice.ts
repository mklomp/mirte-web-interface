import properties_ph from "../assets/json/properties_ph.json"
import { usePeripheralStore } from '@/stores/peripherals'

import * as ROSLIB from 'roslib'
import YAML from 'js-yaml'

export class SBCDevice {
  pythonResolver: (() => void) | null = null
  transport
  peripheralStore
  buffer = ""
  ros: ROSLIB.Ros = useRos()
  socket: WebSocket | null = null

  constructor(private transport) {
    this.peripheralStore = usePeripheralStore()
    this.transport = transport
    transport.onData((data: string) => this.parseData(data))
  }

  parseData(data: string) {
    this.buffer += data

    if (this.buffer.includes(">>> ")) {
      if (this.pythonResolver) {
        this.pythonResolver()
        this.pythonResolver = null
      }
      this.buffer = ""
    }
  }

  async waitForPrompt() {
    return new Promise<void>((resolve) => {
      this.pythonResolver = resolve
    })
  }

  initializeTerm(socket) {
    // Check if one of the (empty) MIRTE files are there
    // We should actually only do this in USB mode, but 
    // if it was able to connect to BLE the code should
    // have been uploaded anyway.
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()

    this.socket = socket
    socket.onopen = () => {
      this.prepareTerminal()
    }


  }

  initializeROS(){
    this.ros.on('connection', () => {
      this.loadSettings();
    })
  }

  

  mergeDeep(target, source) {
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        // Recursively merge if both properties are objects
        target[key] = this.mergeDeep(target[key], source[key]);
      } else {
        // Otherwise, directly assign
        target[key] = source[key];
      }
    }
    return target;
  }


  loadControlSettings() {
    // TODO: or should we just get the YAML right away through http?
    var listParametersService = new ROSLIB.Service({
      ros: this.ros,
      name: '/io/telemetrix/list_parameters',
      serviceType: 'rcl_interfaces/srv/ListParameters'
    });

    var getParameterService = new ROSLIB.Service({
      ros: this.ros,
      name: '/io/telemetrix/get_parameters',
      serviceType: 'rcl_interfaces/srv/GetParameters'
    });

    let peripheral_list = Object.keys(properties_ph);
    let hardware_list = peripheral_list.filter(item => !item.includes("motor"));
    hardware_list.push("motor");
    hardware_list.push("device");
    let peripherals = { 'sensors': {}, 'actuators': {}, 'devices': {} };
    let params = {};

    var request = {
      prefixes: hardware_list,
      depth: 0
    };

    // Get all the parameters
    listParametersService.callService(request, (result) => {

      let param_names = result.result.names.filter(name => {
        return (
          name.endsWith('.name') ||
          name.endsWith('.device') ||
          name.endsWith('.board') ||
          (name.startsWith('device.') && name.endsWith('.type')) ||
          name.includes('.pins.')
        );
      });

      var req = {
        names: param_names
      };

      // Get the values of all the parameters
      getParameterService.callService(req, (res) => {

        let values = res.values;
        for (let param_id in values) {

          let value = 0;
          if (values[param_id].type == 1) {
            value = values[param_id].boolean_value;
          } else if (values[param_id].type == 2) {
            value = values[param_id].integer_value;
          } else if (values[param_id].type == 3) {
            value = values[param_id].double_value;
          } else if (values[param_id].type == 4) {
            value = values[param_id].string_value;
          }

          let item = param_names[param_id].split(".").reduceRight((acc, key) => ({ [key]: acc }), value);
          params = this.mergeDeep(params, item);
        }

        this.checkSettings(params)
      });
    });
  }


  loadSettings() {
    // TODO: or should we just get the YAML right away through http?
    var listParametersService = new ROSLIB.Service({
      ros: this.ros,
      name: '/io/telemetrix/list_parameters',
      serviceType: 'rcl_interfaces/srv/ListParameters'
    });

    var getParameterService = new ROSLIB.Service({
      ros: this.ros,
      name: '/io/telemetrix/get_parameters',
      serviceType: 'rcl_interfaces/srv/GetParameters'
    });

    let peripheral_list = Object.keys(properties_ph);
    let hardware_list = peripheral_list.filter(item => !item.includes("motor"));
    hardware_list.push("motor");
    hardware_list.push("device");
    let peripherals = { 'sensors': {}, 'actuators': {}, 'devices': {} };
    let params = {};

    var request = {
      prefixes: hardware_list,
      depth: 0
    };

    // Get all the parameters
    listParametersService.callService(request, (result) => {

      let param_names = result.result.names.filter(name => {
        return (
          name.endsWith('.name') ||
          name.endsWith('.device') ||
          name.endsWith('.board') ||
          (name.startsWith('device.') && name.endsWith('.type')) ||
          name.includes('.pins.')
        );
      });

      var req = {
        names: param_names
      };

      // Get the values of all the parameters
      getParameterService.callService(req, (res) => {

        let values = res.values;
        for (let param_id in values) {

          let value = 0;
          if (values[param_id].type == 1) {
            value = values[param_id].boolean_value;
          } else if (values[param_id].type == 2) {
            value = values[param_id].integer_value;
          } else if (values[param_id].type == 3) {
            value = values[param_id].double_value;
          } else if (values[param_id].type == 4) {
            value = values[param_id].string_value;
          }

          let item = param_names[param_id].split(".").reduceRight((acc, key) => ({ [key]: acc }), value);
          params = this.mergeDeep(params, item);
        }

        this.checkSettings(params)
      });
    });
  }

  checkSettings(robotSettings) {
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()
    const localsettings = this.peripheralStore.peripherals

    if (Object.keys(robotSettings).length < 2) { // robot settings are empty or just "device"
      if (Object.keys(localsettings).length < 2) { // local setting is empty or just "device"
        // NOP
      } else {
        // upload localSettings to robotSettings
        this.uploadSettings(localsettings)
      }
    } else {
      if (Object.keys(localsettings).length < 2) { // local setting is empty or just "device"
        // save the robot settings to local settings
        this.peripheralStore.setPeripherals(robotSettings, true, true)
        addToast($i18n.t('toast.downloading_mirte_config'), 'info')
      } else { // localsettings is not empty
        if (!this.deepEqual(localsettings, robotSettings)) { // local and robot setting are not the same
          // save the robot settings to local settings
          addToast($i18n.t('toast.downloading_mirte_config_compare_error'), 'error')
          this.peripheralStore.setPeripherals(robotSettings, false, true)
        }
      }
    }
  }

  deepEqual(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }

    if (
      a === null ||
      b === null ||
      typeof a !== "object" ||
      typeof b !== "object"
    ) {
      return false;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    for (const key of keysA) {
      if (!keysB.includes(key)) {
        return false;
      }

      if (!this.deepEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  async uploadSettings(content) {

    let yaml = YAML.load(JSON.stringify(content));
    yaml = { "/**": { "ros__parameters": yaml } };

    let ip = useConnectionStore().ip_address
    fetch(`http://${ip}/api/settings`, {
      method: 'POST',
      body: YAML.dump(yaml)
    })
      .then(res => res.text())
      .then(data => {
        // It takes about 5 seconds for telemetrix to reload
        // TODO: check this, rather than 10 secs
        //setTimeout(() => window.location.href = window.location.origin, 10000);
      })
  }

  // TODO: use this function rather than the code in startCode()?
  async uploadFile(path, content) {
    console.log(content)
  }

  async runCommand(cmd) {
    this.transport.write(cmd)
  }

  prepareTerminal() {
    this.runCommand("unset HISTFILE\n");
    this.runCommand("cd /home/mirte/workdir\n");
    this.runCommand("ps aux | grep 'python3 -i -c' | awk '{print $2}' | xargs kill -9\n"); // TODO: this should be fixed in the backend
    this.runCommand("history -c\n");
    this.runCommand("python3 -i -c 'from mirte_robot import robot; import importlib.util; import traceback; mirte=robot.createRobot()'\n");

    // TODO: can this be the same as micropython version?
    this.runCommand('mirte.stop()\n');
    this.runCommand('def run():\n');
    this.runCommand('  spec = importlib.util.spec_from_file_location("mirte", "/home/mirte/workdir/mirte.py")\n');
    this.runCommand('  mod = importlib.util.module_from_spec(spec)\n');
    this.runCommand('  try:\n');
    this.runCommand('    print("__START__")\n');
    this.runCommand('    print("---STARTED---")\n');
    this.runCommand('    spec.loader.exec_module(mod)\n');
    this.runCommand('  except SystemExit:\n');
    this.runCommand('    pass\n');
    this.runCommand('    print("\\r", end="")\n');
    this.runCommand('  except Exception as e:\n');
    this.runCommand('    print("__START_EXCEPTION__")\n');
    this.runCommand('    print(traceback.print_exception(e))\n');
    this.runCommand('    print("__STOP_EXCEPTION__")\n');
    this.runCommand('  finally:\n');
    this.runCommand('    mirte.stop()\n');
    this.runCommand('    print("---STOPPED---")\n');
    this.runCommand('    print("__STOP__")\n\n');
  }


  async startCode(toast = false) {
    const { addToast, removeToast } = useToast()
    const { $i18n } = useNuxtApp()

    if (toast) { addToast($i18n.t('toast.uploading_code'), 'info', 'uploading-user-code') }
    let ip = useConnectionStore().ip_address
    const pythonUrl = `http://${ip}/api/python`;
    const pythonCode = useCodeStore().python

    fetch(pythonUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'CORS': 'Access-Control-Allow-Origin'
      },
      body: pythonCode,
    }).then(res => {
      this.runCommand('run()\n') // imported from main.py
      useState("programming-state").value = "running";
      if (toast) { removeToast('uploading-user-code') }
    }).catch(err => {
      console.log("sending failed")
      console.log(err)
    })
  }

  async stopCode() {
    await this.runCommand("\x03"); // CTRL-C
  }
}