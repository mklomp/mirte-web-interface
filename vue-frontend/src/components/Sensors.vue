<template>
  
     <div class="layoutbox-content">
        <div v-for="sensor_type in getSensorTypes()"  class="rounded background-tertiary p-3 mb-2">
              <h5>{{ $t('peripherals.' + peripherals[sensor_type].text) }}</h5>
              <div class="row">
 
                <div class="col-4">
                  <img class="center-div w-75" :src="getSensorImage(sensor_type)">
                </div>

                <div class="col-8">

                  <div v-for="instance in getInstances(sensor_type)" class="rounded background-sensor p-2 text-white mb-2" style="white-space: pre;">
                         {{instance}}: {{ sensors[sensor_type][instance] }}
                  </div>

                </div>
              </div>
        </div>
    </div>

</template>

<script>
import properties_ph from "../assets/json/properties_ph.json"
import ros from '../ws-connection/ROS-connection.js'
import Vue from 'vue'

export default {
  name: 'sensors',
  data() {
    return {
      peripherals: properties_ph,
      sensors: {}
    }
  },
  methods: {
    getSensorTypes() {
      return Object.keys(this.sensors);
    },
    getInstances(sensor_type){
      return Object.keys(this.sensors[sensor_type]);
    },
    getSensorImage(type){
      var images = require.context('../assets/images/', false, /\.jpg$/)
      return images('./' + type + ".jpg")
    }
  },
  watch: {
    '$store.getters.getPeripherals':
        function (newVal, oldVal) {
          // NOTE: this one should only be called once after
          // the app is loaded and the ROS paramters have 
          // been set.

          let _this = this;
          let sensors = newVal.sensors;

          for (let sensor_type in sensors){
            Vue.set(_this.sensors, sensor_type, {});
            for (let instance in sensors[sensor_type]){
              Vue.set(_this.sensors[sensor_type], instance, -1);

              let topic = new ROSLIB.Topic({
                ros : ros,
                name : '/io/' + sensor_type + '/' + instance,
                messageType : _this.peripherals[sensor_type].message_type
              });

              topic.subscribe((message) => {
                let value = message[_this.peripherals[sensor_type].message_value];
                if (!value){ value = "inf" }
                let string = ""
                      
                if (typeof value === "object"){
                  // Parse it
                  string += "\n";
                  for (const [k, v] of Object.entries(value)){
                    let val = v;
                    if (typeof v === "number" && !Number.isInteger(v)){
                      val = v.toFixed(4);
                    }
                    string += "\t" + k + ": " + val + "\n";
                  }
                } else {
                  // If raw value, cap if float
                  if (typeof value === "number" && !Number.isInteger(value)){
                    string = value.toFixed(4);
                  } else {
                    string = value;
                  }
                }

                _this.sensors[sensor_type][instance] = string;
              });
            }
          }
        },
  },
}
</script>
