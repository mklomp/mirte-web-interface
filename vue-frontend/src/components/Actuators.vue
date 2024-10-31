<template>
      <div class="layoutbox-content" style="height: 100% !important">



      <div v-if="programming">

            <div class="rounded background-tertiary h5 p-3 mb-2">
              {{ $t('actuators.output') }}              
                <div class="float-right">

<!--

        <button class="btn-sm btn-outline-dark mx-2" 
            v-b-tooltip.hover 
            title="clear output" 
            @click="control('clear')"
        >
            <i class="fas fa-sync"></i>
        </button>

        <button class="btn btn-outline-dark mr-2" 
            v-b-tooltip.hover 
            title="toggle output/terminal" 
            @click="control('terminal')"
        >
            <i class="fa fa-terminal"></i>
        </button>

-->

                </div>
              

              <Xterm/>
           </div>    
      </div>


           <div class="rounded background-tertiary p-3 mb-2"  @contextmenu.prevent >
              <h5>{{ $t('actuators.control') }}</h5> 

               <div class="row mb-4">

                <div class="col-1 offset-6">
                <button class="btn btn-mirte-control mr-2 background-actuator"
                   v-b-tooltip.hover
                   :title="$t('actuators.move_forward')"
                   @mousedown="control('forward_down')"
                   @mouseup="control('forward_up')"
                   @contextmenu.prevent="control('forward_down')"
                 >
                 <i class="fa fa-arrow-up"></i>
                 </button>
                 </div>
               </div>

               <div class="row mb-4">
                <div class="col-1 offset-4">
                <button class="btn btn-mirte-control mr-2 background-actuator"
                   v-b-tooltip.hover
                   :title="$t('actuators.move_left')"
                   @mousedown="control('left_down')"
                   @mouseup="control('left_up')"
                   @contextmenu.prevent="control('left_down')"
                 >
                 <i class="fa fa-arrow-left"></i>
                </button>
                </div>

                <div class="col-2 offset-1">
                <button class="btn btn-mirte-control mr-2 background-actuator"
                   v-b-tooltip.hover
                   :title="$t('actuators.move_stop')"
                   @click="control('stop')"
                   @contextmenu.prevent="control('stop')"
                 >
                 <i class="fa fa-times-circle"></i>
                </button>
                </div>

                <div class="col-1 mb-2">
                <button class="btn btn-mirte-control mr-2 background-actuator"
                   v-b-tooltip.hover
                   :title="$t('actuators.move_right')"
                   @mousedown="control('right_down')"
                   @mouseup="control('right_up')"
                   @contextmenu.prevent="control('right_down')"
                 >
                 <i class="fa fa-arrow-right"></i>
                </button>
                </div>


               </div>


               <div class="row mb-4">

                <div class="col-1 offset-6">
                <button class="btn btn-mirte-control mr-2 background-actuator"
                   v-b-tooltip.hover
                   :title="$t('actuators.move_backward')"
                   @mousedown="control('backward_down')"
                   @mouseup="control('backward_up')"
                   @contextmenu.prevent="control('backward_down')"
                 >
                 <i class="fa fa-arrow-down"></i>
                 </button>
                 </div>
               </div>

  
              <div class="rounded background-actuator p-2 text-white mb-2">
                  <div class="row">
                     <div class="col-4">
                       {{ $t('actuators.speed') }}: {{ linear_speed }}
                     </div>
                     <div class="col-8">
                         <b-form-input id="range-1" v-model="linear_speed" type="range" min="0" max=".1" step="0.01" @contextmenu.prevent ></b-form-input>
                     </div>
                  </div>
               </div>

               <div class="rounded background-actuator p-2 text-white mb-2">
                  <div class="row">
                     <div class="col-4">
                       {{ $t('actuators.angular_speed') }}: {{ angular_speed }}
                     </div>
                     <div class="col-8">
                         <b-form-input id="range-1" v-model="angular_speed" type="range" min="0" max="1" step="0.01" @contextmenu.prevent ></b-form-input>
                     </div>
                  </div>

              </div>  

           </div>



      <div v-for="actuator in getActuators()"  class="rounded background-tertiary p-3 mb-2" @contextmenu.prevent >
              <h5>{{ $t('peripherals.' + peripherals[actuator].text) }}</h5> 
                  <div v-for="instance in getInstancesOfActuator(actuator)" class="rounded background-actuator p-2 text-white mb-2">
                     <div v-if="actuator === 'servo'">
                          <div>
                            {{instance}}: {{ actuator_values[actuator][instance] }}
                          </div>
                          <div>
                              <b-form-input id="range-1" v-model="actuator_values[actuator][instance]" @update="sendData(actuator, instance)" type="range" min="0" max="180" @contextmenu.prevent ></b-form-input>
                          </div>
                     </div>

                     <div v-if="actuator === 'oled'">
                       <div class="row">
                         <div class="col-2">
                           {{instance}}
                         </div>
                         <div class="col-5">
                             <b-form-select v-model="actuator_values[actuator][instance].type" :options="oled_options"></b-form-select>
                         </div>
                         <div class="col-5">
                             <b-form-input v-model="actuator_values[actuator][instance].value" @change="set_oled(actuator, instance)" placeholder=""></b-form-input>
                         </div>
                       </div>
                     </div>

                     <div v-if="actuator === 'pp_motor' || actuator === 'dp_motor' || actuator === 'ddp_motor'">
                          <div>
                            {{instance}}: {{ actuator_values[actuator][instance] }}
                          </div>
                          <div>
                              <b-form-input id="range-1" v-model="actuator_values[actuator][instance]" @update="sendData(actuator, instance)" type="range" min="-100" max="100" @contextmenu.prevent ></b-form-input>
                          </div>
                     </div>

                  </div>
           </div>


      </div>

</template>

<script>
import * as ROSLIB from 'roslib'
import ros from '../ws-connection/ROS-connection.js'
import Xterm from '@/components/Xterm.vue'
import properties_ph from "../assets/json/properties_ph.json"
import Vue from 'vue'


export default {
  name: 'actuators',
  components: {
    Xterm
  },
  methods: {
        getActuators() {
         let types = [];
         for (let type in this.param_actuators){
             if(type == "motor"){
                types.push(this.param_actuators["motor"][Object.keys(this.param_actuators["motor"])[0]].type + "_motor");
             } else {
                types.push(type); 
             }
         }
         return types;
        },
        loadConfiguration(rosparams){
          let actuators_copy = Object.assign({}, rosparams);
          for (let type in rosparams){
            for (let instance in rosparams[type]){
              let type_tmp = (type == "motor") ? rosparams["motor"][instance].type + "_motor" : type;
              if (!this.peripherals.hasOwnProperty(type_tmp) || this.peripherals[type_tmp].rel_path.split("\\")[0] !== "Actuators" ){
                 delete actuators_copy[type];
              }
            }   
          }
          this.param_actuators = actuators_copy;
        },
        getInstancesOfActuator(type){
          type = (type.slice(-6) == "_motor") ? "motor" : type;
          let ret = [];
          for (let actuator_instance in this.param_actuators[type]){
            ret.push(actuator_instance);
          }
          return ret;
        },
        sendData(actuator, instance){
           var data = {};
           data[this.peripherals[actuator].service_value] = parseInt(this.actuator_values[actuator][instance]);
           var request = new ROSLIB.ServiceRequest(data);
           this.actuator_services[actuator][instance].callService(request, function(result) {});
        },
        set_oled(actuator, instance){
           var request = new ROSLIB.ServiceRequest({
              type: this.actuator_values[actuator][instance].type,
              value: this.actuator_values[actuator][instance].value
           });
           this.actuator_services[actuator][instance].callService(request, function(result) {});
        },
        control(command) {
          switch(command) {
              case "forward_down":
                this.current_linear_speed = this.linear_speed;
                break;
              case "backward_down":
                this.current_linear_speed = -this.linear_speed;
                break;
              case "left_down":
                this.current_angular_speed = this.angular_speed;
                break;
              case "right_down":
                this.current_angular_speed = -this.angular_speed;
                break;
              case "stop":
                this.current_linear_speed = 0.0;
                this.current_angular_speed = 0.0;
                break;
              case "left_up":
              case "right_up":
                this.current_angular_speed = 0.0;
                break;
              case "forward_up":
              case "backward_up":
                this.current_linear_speed = 0.0;
                break;
              default:
                break;
          }

            var twist = new ROSLIB.Message({
              linear : {
                x : parseFloat(this.current_linear_speed),
                y : 0.0,
                z : 0.0
              },
              angular : {
                x : 0.0,
                y : 0.0,
                z : parseFloat(this.current_angular_speed)
              }
            });

            this.cmd_vel.publish(twist);

        },
  },
  data() {
    return {
      programming: true,
      peripherals: properties_ph,
      actuator_values: {},
      actuator_services: {},
      oled_options: ["text", "image", "animation"],
      cmd_vel: {},
      linear_speed: 0.5,
      angular_speed: 0.5,
      current_linear_speed: 0.0,
      current_angular_speed: 0.0,
      param_actuators: {},
      ros: {} // TODO: check if this is needed?
    }
  },
  mounted(){
    let self = this;

    window.addEventListener('keydown', function(ev) {
      // Rather than wasd or ijkl, we use the
      // same keys as the teleopkey node
      let nodeName = ev.target.nodeName;
      if (nodeName != "TEXTAREA" && nodeName != "INPUT"){
        switch (ev.keyCode){
          case 73: //i
            self.control('forward_down');
            break;
          case 74: //j
            self.control('left_down');
            break;
          case 76: //l
            self.control('right_down');
            break;
          case 188: //,
            self.control('backward_down');
            break;
        }
      }
    });

    window.addEventListener('keyup', function(ev) {
        // Rather than wasd or ijkl, we use the
        // same keys as the teleopkey node
        switch (ev.keyCode){
          case 73: //i
            self.control('forward_up');
            break;
          case 74: //j
            self.control('left_up');
            break;
          case 76: //l
            self.control('right_up');
            break;
          case 188: //,
            self.control('backward_up');
            break;
        }
    });


    this.ros = ros;

    this.cmd_vel = new ROSLIB.Topic({
       ros : this.ros,
       name : '/mobile_base_controller/cmd_vel',
       messageType : 'geometry_msgs/Twist'
    });

    // TODO: loading paramaters twice. This should not be needed
    let params = new ROSLIB.Param({
       ros: ros,
       name: '/mirte_telemetrix_cpp:mirte'
    })
    
    params.get((res) => {

       this.loadConfiguration(res);
       var actuators = this.getActuators();
       for (let actuator in actuators){
          Vue.set(this.actuator_values, actuators[actuator], {});
          Vue.set(this.actuator_services, actuators[actuator], {});
          var instances = this.getInstancesOfActuator(actuators[actuator]);
          for (let instance in instances){
             let actuator_renamed = actuators[actuator];
             if(actuators[actuator] == "motor"){
                actuator_renamed = this.param_actuators[actuators[actuator]][instances[instance]].type + "_motor";
             }

             if (actuator_renamed == "oled"){
                Vue.set(this.actuator_values[actuators[actuator]], instances[instance], {});
                Vue.set(this.actuator_values[actuators[actuator]][instances[instance]], 'type', '');
                Vue.set(this.actuator_values[actuators[actuator]][instances[instance]], 'value', '');
             } else {
                Vue.set(this.actuator_values[actuators[actuator]], instances[instance], 0);
             }
             Vue.set(this.actuator_services[actuators[actuator]], instances[instance], {});

             this.actuator_services[actuators[actuator]][instances[instance]] = new ROSLIB.Service({
                 ros : this.ros,
                 name : '/mirte/set_' + instances[instance] + '_' + this.peripherals[actuator_renamed].service_name,
                 serviceType : this.peripherals[actuator_renamed].service_type
             });
          }
       }
     });
  }


}
</script>
