<template>
  
   <div class="row p-4 h-100">
    <div class="col-4 h-100 p-2 offset-2">
      <div class="row h-100">
       <div class="col-12 h-100" style="overflow: hidden;">
        <div class="layoutbox rounded h-100" style="overflow: hidden; display: flex; flex-flow: column;">
          <div class="text-white p-2 h3 layoutbox-title w-100 background-secondary">
            {{ $t('settings.wiring') }}
            <button @click="uploadYAML" type="button" class="btn btn-mirte float-right">
              <span v-if="!busy">{{ $t('settings.save') }}</span>
              <i v-else class="fa fa-spin fa-stroopwafel"></i>
            </button>
          </div>

          <div>
               Microcontroller: 

                <div class="float-right">
                  <select id='mcu-select' class="form-control" name='mcu' v-model="board">
                    <option v-for="(mc, name) of microcontrollers" v-bind:key="name" :value="name">{{mc.text}}</option>
                  </select>
                </div>

          </div>


         <div class="h-100" style="overflow-y: auto;">

            <!-- Using a custom table (instead of b-table), 
                 makes more sense in our data structure -->
            <table class="table table-striped">

              <thead>
                <tr>
                  <th>
                    <b-dropdown id="dropdown-1" :text="$t('settings.add')" class="">
                      <b-dropdown-item v-for="i in Object.keys(peripherals)" ref="i" @click="add_item(i)">
                        {{ $t('peripherals.' + peripherals[i].text) }}
                      </b-dropdown-item>
                    </b-dropdown>
                  </th>
                  <th>naam</th>
                  <th>pins</th>
                </tr>
              </thead>


              <tbody>
                <template v-for="(set_peripherals, type) in items">
                  <tr v-for="item in set_peripherals">

                    <td>
                      <button @click="delete_item(type, item.name)" type="button" class="btn float-left">
                        <span class="fa fa-trash"> </span>
                      </button>
                      {{ $t('peripherals.' + peripherals[type].text) }}
                    </td>

                    <td>
                      <b-form-input v-model="item.name" :placeholder="$t('settings.placeholder')"></b-form-input>
                    </td>

                    <td>
                      <b-form-select v-for="p in Object.keys(peripherals[type].pins)" v-model="item.pins[p]"
                               :options="getValidPinBinds(type, p)">
                        <template #first>
                          <b-form-select-option :value="null" disabled>{{ p }}</b-form-select-option>
                        </template>
                      </b-form-select>
                    </td>

                  </tr>
               </template>
             </tbody>

            </table>
         </div>

       </div>
      </div>
      </div>
    </div>




    <div class="col-4 h-100 p-2">
      <div class="row">
        
        <div class="col-12">

          <div class="row">
            <Network/>
          </div>
       </div>
     </div>
   </div>
</template>

<script>

import * as ROSLIB from 'roslib'
import ros from '../ws-connection/ROS-connection.js'
import YAML from 'js-yaml'
import properties_ph from "../assets/json/properties_ph.json"
import properties_mc from "../assets/json/properties_mc.json"
import Network from '@/components/Network.vue'
import Vue from 'vue'


export default {
  components: {
    Network
  },
  data: function () {
    return {
      peripherals: properties_ph,
      microcontrollers: properties_mc,
      type: 'breadboard',
      board: 'pico',
      items: {},
      busy: false,
      password: null
    }
  },
  methods: {
    getPeripherals(){
       return {...this.items.sensors, ...this.items.actuators};
    },
    // To add and delete items (delete_item() see below) from the peripheral configuration table
    add_item(type, name, pins) {
      var binds = {}
      if (pins){
         binds = pins;
      } else {
         binds = {...this.peripherals[type].pins}
         Object.keys(binds).forEach(function (key) {
           binds[key] = null
         })
      }
      Vue.set(this.items, type, {}); //eg. intensity
      Vue.set(this.items[type], name, {});  //eg. left
      Vue.set(this.items[type][name], "name", name);
      Vue.set(this.items[type][name], "pins", binds);
    },
    delete_item(type, name) {
      Vue.delete(this.items[type], name);
      if (Object.keys(this.items[type]).length === 0){
        Vue.delete(this.items, type);
      }
    },
    // Depending on selected microcontroller gives peripheral configuration table valid pin binds
    getValidPinBinds(type, pin) {
      let pinMap = Object.entries({...this.microcontrollers[this.board].pin_map})
      if (this.peripherals[type].pins[pin] === "analog") {
        pinMap = pinMap.filter(([_, value]) => value >= this.microcontrollers[this.board].analog_offset)
      }
      const options = []
      for (let p of pinMap) options.push({value: p[0], text: p[0]})
      return options
    },
    // Should be using generateYAML() as soon as we move to the plugin manager
    saveConfiguration(){
       this.busy = true;
       var restructured = {device: {}};
       restructured['device']['mirte'] = {type: this.type, board: this.board };

       for (let [name, item] of Object.entries(this.items)){
         console.log(item);
         if (name.slice(-5) == "motor"){
            let type = name.split("_")[0];
            restructured.motor = {};
            for (let [motor_name, motor] of Object.entries(item)){
              motor.type = type;
              restructured.motor[motor.name] = motor;
            }
         } else {
            restructured[name] = {}; // eg. color
            for (let [i_name, i] of Object.entries(item)){
              restructured[name][i.name] = i;
            }
         }
       }

       let ret = YAML.load(JSON.stringify(restructured));
       return ret;
    },
    // Constructs the YAML file to be used and uploaded to ROS as its params
    generateYAML() {
      const yaml = {
        name: 'Mirte',
        type: this.type,
        board: {
          board: this.board,
          max_pwm_value: this.microcontrollers[this.board].max_pwm_value,
          analog_offset: this.microcontrollers[this.board].analog_offset
        },
        peripherals: {}
      }
      for (const item of this.items) {
        yaml.peripherals[item.name] = {
          super_type: this.peripherals[item.type].rel_path.split("\\")[0],
          abstract_type: this.peripherals[item.type].rel_path.split("\\")[1],
          peripheral_type: item.type,
          pin_binds: {}
        }
        for (let key in this.peripherals[item.type].pins) {
          yaml["peripherals"][item.name].pin_binds[key] = item[key]
        }
      }
      // In memory of Henk. He shall always be in our memory. Persistent through and through, until the end.
      return YAML.load(JSON.stringify(yaml))
    },
    // Requests from the server to update the ROS params with the generated YAML file of the configured Peripherals
    uploadYAML() {
      let _this = this;
      if (confirm(this.$i18n.t('settings.save_confirm'))) {
        _this.busy = true
        var yaml = this.saveConfiguration();
        yaml = {"/**": {"ros__parameters": yaml }};

        fetch(`http://${location.hostname}/api/settings`, {
          method: 'POST',
          body: YAML.dump(yaml)
        })
            .then(res => res.text())
            .then(data => {
              console.log(data)
              this.busy = false
            })
      }
    },
    //Old out of scope server request functions
    uploadMCU() {
      if (confirm(this.$i18n.t('settings.upload_confirm'))) {
        this.busy = true
        var body = {};
        body["mcu"] = this.mcu;
        fetch(`http://${location.hostname}/api/upload_telemetrix`, {
           method: 'POST',
           body: JSON.stringify(body) 
        } )
            .then(res => res.text())
            .then(data => {
              console.log(data)
              this.busy = false

              if (data.toLowerCase().includes("download done")) {
                alert("Uploaden is succesvol afgerond")
              } else {
                alert("Er is een fout opgetreden:\n\n" + data)
              }

            })
      }
    },
    setPassword() {
      if (confirm('Weet je zeker dat je het wachtwoord wilt veranderen?')) {
        fetch(`http://${location.hostname}/api/passwd`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'CORS': 'Access-Control-Allow-Origin'
          },
          body: this.password + "\n",
        })
            .then(res => res.json())
            .then(data => {
              console.log(data)
            })
      }
    }
  },
  mounted() {
    // Create local (non-vuex-peristent, but reactive) version of the settings
    let settings = this.$store.getters.getPeripherals;
    let items = {...settings.sensors, ...settings.actuators};
    for (let [type_name, type] of Object.entries(items)){
      Vue.set(this.items, type_name, {}); //eg. intensity
      for (let [item_name, item] of Object.entries(type)){
        Vue.set(this.items[type_name], item_name, {});  //eg. left
        Vue.set(this.items[type_name][item_name], "name", item.name);
        Vue.set(this.items[type_name][item_name], "pins", {});
        for (let [pin_key, pin_value] of Object.entries(item.pins)){
          Vue.set(this.items[type_name][item_name].pins, pin_key, pin_value); //eg. echo
        }
      }
    }
  }  
}
</script>
