<template>
      <div class="layoutbox-content" style="height: 100% !important">



      <div v-if="programming">
        <Xterm/>
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
                  <div v-for="instance in getInstances(actuator)" class="rounded background-actuator p-2 text-white mb-2">
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
  watch: {
    '$store.getters.getPeripherals':
        function (newVal, oldVal) {
          // NOTE: this one should only be called once after
          // the app is loaded and the ROS paramters have
          // been set.

          let _this = this;
          let actuators = newVal.actuators;

          for (let actuator_type in actuators){

            Vue.set(_this.actuators, actuator_type, {});
            Vue.set(_this.actuator_values, actuator_type, {});
            Vue.set(_this.actuator_services, actuator_type, {});
            for (let instance in actuators[actuator_type]){

              if (actuator_type == "oled"){
                Vue.set(_this.actuator_values["oled"], instance, {});
                Vue.set(_this.actuator_values["oled"][instance], 'type', '');
                Vue.set(_this.actuator_values["oled"][instance], 'value', '');
              } else {
                Vue.set(_this.actuator_values[actuator_type], instance, 0);
              }

              Vue.set(_this.actuators[actuator_type], instance, {});
              Vue.set(_this.actuator_services[actuator_type], instance, {});

              let real_actuator_type = actuator_type.includes("motor") ? "motor" : actuator_type;
          
              _this.actuator_services[actuator_type][instance] = new ROSLIB.Service({
                 ros : this.ros,
                 name : '/io/' + real_actuator_type + '/' + instance + '/' + _this.peripherals[actuator_type].service_name,
                 serviceType : _this.peripherals[actuator_type].service_type
              });
            }
          }
        }
  },
  methods: {
        getActuators() {
          return Object.keys(this.actuators);
        },
        getInstances(type){
          return Object.keys(this.actuators[type]);
        },
        sendData(actuator, instance){
           var request = {};
           request[this.peripherals[actuator].service_value] = parseInt(this.actuator_values[actuator][instance]);
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

            var twist = {
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
            };

            this.cmd_vel.publish(twist);

        },
  },
  data() {
    return {
      programming: true,
      peripherals: properties_ph,
      actuators: {},
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
       name : '/diff_drive_controller/cmd_vel_unstamped',
       messageType : 'geometry_msgs/Twist'
    });

  }

}
</script>
