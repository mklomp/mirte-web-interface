import * as ROSLIB from 'roslib'
import properties_ph from "../assets/json/properties_ph.json"
import { useRosStore } from '~/stores/ros_params'

export default defineNuxtPlugin(() => {

  //const ros_protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
  //const ros_socketUrl = `${ros_protocol}${location.hostname}/ws/ros`;


  let connected = false
  const ros = new ROSLIB.Ros({})

  const programmingState = useState('programming-state')
  const ROSState = useState('ros-state')
  const termState = useState('term-state')


  function connect() {
    ROSState.value = "connecting"
    if (connected) return
    connected = true
    ros.connect('ws://192.168.43.1/ws/ros')
  }
  

  ros.on('connection', () => {
    console.log('Connected to ROS2')
    getPeripherals();
    ROSState.value = "connected"
    if (termState.value == "python-active"){
      programmingState.value = "ready"
    }
  })

  ros.on('error', (error) => {
    console.error('ROS error:', error)
    ROSState.value = "disconnected"
  })

  ros.on('close', () => {
    console.log('ROS connection closed')
    ROSState.value = "disconnected"
  })

  
  function mergeDeep(target, source) {
        for (const key in source) {
          if (source[key] instanceof Object && key in target) {
            // Recursively merge if both properties are objects
            target[key] = mergeDeep(target[key], source[key]);
          } else {
            // Otherwise, directly assign
            target[key] = source[key];
          }
        }
      return target;
  }


  function getPeripherals(){
    // TODO: or should we just get the YAML right away through http?

        var listParametersService = new ROSLIB.Service({
          ros : ros,
          name : '/io/telemetrix/list_parameters',
          serviceType : 'rcl_interfaces/srv/ListParameters'
        });

        var getParameterService = new ROSLIB.Service({
          ros : ros,
          name : '/io/telemetrix/get_parameters',
          serviceType : 'rcl_interfaces/srv/GetParameters'
        });

        let peripheral_list = Object.keys(properties_ph);
        let hardware_list = peripheral_list.filter(item => !item.includes("motor"));
        hardware_list.push("motor");
        hardware_list.push("device");
        let peripherals = {'sensors': {}, 'actuators': {}, 'devices': {} };
        let params = {};
 
        var request = {
          prefixes: hardware_list,
          depth: 0
        };

        // Get all the parameters
        listParametersService.callService(request, function(result) {

          let param_names = result.result.names;
          var req = {
            names: param_names
          };

          // Get the values of all the parameters
          getParameterService.callService(req, function(res){

            let values = res.values;
            for (let param_id in values){

              let value = 0;
              if (values[param_id].type == 2){
                value = values[param_id].integer_value;
              } else if (values[param_id].type == 3){
                value = values[param_id].double_value;
              } else if (values[param_id].type == 4){
                value = values[param_id].string_value;
              }

              let item = param_names[param_id].split(".").reduceRight((acc, key) => ({ [key]: acc }), value);
              params = mergeDeep(params, item);
            }
        
            // Fix motor issues (TODO: we need to redesign the motor setup
            let new_params = {}
            for (let type in params){
              if (type == "motor"){
                for (let instance in params[type]){
                  new_params[params[type][instance].type + "_motor"] = new_params[params[type][instance].type + "_motor"] || {};
                  new_params[params[type][instance].type + "_motor"][instance] = params[type][instance];
                }
              } else {
                new_params[type] = params[type];
              }
            }
            params = new_params;

            // Save everything in sensors/actuators
            for (let type in params){
              if (type == "device"){
                peripherals['devices'] = params[type];
              } else if (properties_ph[type].rel_path.split("\\")[0] == "Sensors"){
                peripherals['sensors'][type] = params[type];
              } else {
                peripherals['actuators'][type] = params[type];
              }
            }
            
            const rosStore = useRosStore()
            rosStore.setPeripherals(peripherals)
          });
        }); 
      }


  return {
    provide: {
      ros,
      connectRos: connect
    }
  }
})