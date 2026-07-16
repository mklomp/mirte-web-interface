<template>
  <div class="layoutbox-content" style="height: 100% !important" :class="{ disabled: !isROSConnected() }">



    <div>
      <Xterm />
    </div>

    <div v-if="isSBC()" class="rounded background-tertiary p-3 mb-2" @contextmenu.prevent>
      <div class="h5">{{ $t("settings.drive") }}

        <button class="btn btn-sm btn-outline-dark float-end" @click="toggleJoystickMode()">
          <font-awesome-icon :icon="joystickMode ? 'fa-solid fa-sliders' : 'fa-solid fa-gamepad'" />
        </button>

      </div>

      <DriveJoystick v-if="joystickMode" />

      <div v-else v-for="instance in getControlMotors()" class="rounded background-actuator p-2 text-white mb-2">

        <div>
          {{ instance }}: {{ actuator_values["motor"][instance] }}
        </div>
        <div>
          <input class="form-range" id="motor-range" v-model="actuator_values['motor'][instance]"
            @change="sendData('motor', instance)" type="range" min="-100" max="100" @contextmenu.prevent></input>
        </div>


      </div>
    </div>


    <div v-if="isSBC()" v-for="actuator in getActuators()" class="rounded background-tertiary p-3 mb-2"
      @contextmenu.prevent>
      <div class="h5">{{ $t('peripherals.' + peripherals[actuator].text) }}</div>
      <div v-for="instance in getInstances(actuator)" class="rounded background-actuator p-2 text-white mb-2">
        <div v-if="actuator === 'servo'">
          <div>
            {{ instance }}: {{ actuator_values[actuator][instance] }}
          </div>
          <div>
            <input class="form-range" id="range-1" v-model="actuator_values[actuator][instance]"
              @change="sendData(actuator, instance)" type="range" min="0" max="180" @contextmenu.prevent></input>
          </div>
        </div>

        <div v-if="actuator === 'oled'">
          <div class="row">
            <div class="col-2">
              {{ instance }}
            </div>
            <!--
                         <div class="col-5">
                             <b-form-select v-model="actuator_values[actuator][instance].type" :options="oled_options"></b-form-select>
                         </div>
-->
            <div class="col-10">
              <input class="form-text" v-model="actuator_values[actuator][instance].text"
                @change="set_oled(actuator, instance)" placeholder=""></input>
            </div>
          </div>
        </div>

        <div v-if="actuator == 'motor'">
          <div>
            {{ instance }}: {{ actuator_values[actuator][instance] }}
          </div>
          <div>
            <input class="form-range" id="motor-range" v-model="actuator_values[actuator][instance]"
              @change="sendData(actuator, instance)" type="range" min="-100" max="100" @contextmenu.prevent></input>
          </div>
        </div>

      </div>
    </div>


  </div>

</template>


<script>
import * as ROSLIB from 'roslib'
import properties_ph from "../assets/json/properties_ph.json"


export default {
  name: 'actuators',
  components: {
    //  Xterm
  },
  methods: {
    getActuators() {
      if (this.getInstances('motor').length == 0) {
        let actuators = Object.keys(this.actuators);
        actuators = actuators.filter(item => item !== "motor");
        return actuators
      }
      return Object.keys(this.actuators);
    },

    toggleJoystickMode() {
      this.joystickMode = !this.joystickMode

      // Switched to joystick mode
      if (this.joystickMode) {
        this.getControlMotors().forEach(motor => {
          this.actuator_values.motor[motor] = 0
          this.sendData('motor', motor)
        })
      }
    },

    getControlMotors() {
      let motors = []
      if (Object.keys(this.actuators).length) {
        motors = Object.keys(this.actuators['motor']);
      }
      const peripheralStore = usePeripheralStore()
      const controlMotorNames = peripheralStore.controls

      const filteredMotors = motors.filter(motor =>
        Object.values(controlMotorNames).includes(motor)
      );
      return filteredMotors
    },
    getInstances(type) {
      if (type !== "motor") { return Object.keys(this.actuators[type]); }

      let motors = []
      if (Object.keys(this.actuators).length) {
        motors = Object.keys(this.actuators['motor']);
      }
      const peripheralStore = usePeripheralStore()
      const controlMotorNames = peripheralStore.controls

      const filteredMotors = motors.filter(motor =>
        !Object.values(controlMotorNames).includes(motor)
      );
      return filteredMotors
    },
    isSBC() {
      return useConnectionStore().device == "sbc"
    },
    isROSConnected() {
      return useConnectionStore().ros_status == "connected"
    },
    sendData(actuator, instance) {
      var request = {};
      request[this.peripherals[actuator].service_value] = parseInt(this.actuator_values[actuator][instance]);
      this.actuator_services[actuator][instance].callService(request, function (result) { });
    },
    set_oled(actuator, instance) {
      var request = { text: this.actuator_values[actuator][instance].text };
      this.actuator_services[actuator][instance].callService(request, function (result) { });
    },
    reloadActuator(peripherals) {

      for (const [actuator_type, peripheral] of Object.entries(peripherals)) {
        if (actuator_type == "device" || properties_ph[actuator_type].rel_path.split("\\")[0] != "Actuators") { continue }

        // Initialize objects directly
        this.actuators[actuator_type] = {}
        this.actuator_values[actuator_type] = {}
        this.actuator_services[actuator_type] = {}

        for (const instance in peripheral) {

          if (actuator_type === "oled") {
            this.actuator_values["oled"][instance] = { text: '' }
          } else {
            this.actuator_values[actuator_type][instance] = 0
          }

          this.actuators[actuator_type][instance] = {}
          this.actuator_services[actuator_type][instance] = {}

          let real_actuator_type = actuator_type.includes("motor") ? "motor" : actuator_type

          let ros = useRos()
          this.actuator_services[actuator_type][instance] = new ROSLIB.Service({
            ros: ros,
            name: `/io/${real_actuator_type}/${instance}/${this.peripherals[actuator_type].service_name}`,
            serviceType: this.peripherals[actuator_type].service_type
          })
        }
      }
    }
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
      joystickMode: ref(true),
      ros: {} // TODO: check if this is needed?
    }
  },
  mounted() {

    const peripheralStore = usePeripheralStore()
    const { peripherals: storePeripherals } = storeToRefs(peripheralStore)
    const connectionStore = useConnectionStore()
    const { status } = storeToRefs(connectionStore)

    // TODO: also watch eripheral chnages
    watch(
      status,
      (newVal) => {
        if (newVal != "connected") { return }
        this.reloadActuator(peripheralStore.peripherals)
      },
      { immediate: true }
    )

    watch(
      storePeripherals,
      (newVal) => {
        this.reloadActuator(newVal)
      },
      { immediate: true }
    )

  }

}
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.5;
  filter: grayscale(100%);
}
</style>