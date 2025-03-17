<template>
  <div id="app" v-hotkey="keymap" class=" " style=" display: flex; flex-flow: column; height: 100vh;" >

     <div class="m-2" >
       <Navbar/>
     </div>

    <div class="bg-white flex-grow-1" style="overflow: hidden;">
         <keep-alive>
           <router-view />
         </keep-alive>
     </div> 


 
      <b-modal v-model="loginModalShow" no-close-on-esc no-close-on-backdrop hide-header-close centered title="Login" :body-text-variant="textVariant" :header-text-variant="textVariant">
      <div class="mt-3">
         <form @submit.prevent="handleSubmit">
            <div class="form-group">
               <b-form-select v-on:change="getSelectedItem"
                  v-model="username"
                  :options="online">
               </b-form-select>
            </div>
            <div class="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" v-model="password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !password }"/>
                <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
            </div>
            <div v-if="error" class="alert alert-danger">{{error}}</div>
        </form>
      </div>
      <template v-slot:modal-footer>
         <div class="w-100">
            <b-button
               variant="primary"
               class="float-right"
               @click="checkLogin">
               Login
            </b-button>
         </div>
      </template>
   </b-modal>
   </div>
</template>

<script>

// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import axios from "axios" 
import VueHotkey from "v-hotkey";
import Vue from 'vue'
import html2canvas from 'html2canvas';
import canvasToImage from 'canvas-to-image'
import * as ROSLIB from 'roslib'
import ros from './ws-connection/ROS-connection.js'
import properties_ph from "./assets/json/properties_ph.json"


Vue.use(VueHotkey);

export default {
   data () {
      return {
         username: '',
         password: '',
         submitted: false,
         error: '',
         online: [],
         textVariant: 'dark',
         peripherals: properties_ph,
      }
   },
   components: {
      Navbar
   },
   methods: {
      captureBlockly(){
         var blocklyElement = document.getElementById("blocklyDiv");
         html2canvas(blocklyElement).then(function(canvas) {
            canvasToImage(canvas, {
               name: 'Blockly',
               type: 'png',
               quality: 1
            });
         }); 
      },
      capturePython(){
         var blocklyElement = document.getElementsByClassName("CodeMirror-code");
         html2canvas(blocklyElement[0]).then(function(canvas) {
            canvasToImage(canvas, {
               name: 'Python',
               type: 'png',
               quality: 1
            });
         }); 
      },
      captureScreen(){
         html2canvas(document.body).then(function(canvas) {
            canvasToImage(canvas, {
               name: 'Screen',
               type: 'png',
               quality: 1
            });
         }); 
      },
      getSelectedItem(item){
         //if (window.location.href.indexOf(item.toLowerCase()) === -1){
         //   window.location = "http://"  + item.toLowerCase() + ".local";
         //}
      },
      getPeripherals(){

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

        let _this = this;
        let result_counter = 0;
        let hardware_list = ['intensity', 'distance', 'oled', 'motor']; // TODO: can I get this from this.peripherals?
        let peripherals = {'sensors': {}, 'actuators': {}};

        for (const hardware of hardware_list){
          var request = {
            prefixes: [hardware],
            depth: 3
          };

          listParametersService.callService(request, function(result) {
            for (const item of result.result.prefixes){
              var nameSplit = item.split(".");
              let type = nameSplit[0];
              let name = nameSplit[1];

              if (hardware == "motor"){
                // we need to get the type first
                let type_name = item + ".type";
                var r = { names: [type_name] };
                getParameterService.callService(r, function(res){
                  type = res.values[0].string_value + "_motor";
                  peripherals['actuators'][type] = peripherals['actuators'][type] || [];
                  peripherals['actuators'][type].push(name);
                  result_counter++;
                  if (result_counter == hardware_list.length){
                    _this.$store.dispatch('setPeripherals', peripherals);
                  }
                });
              } else {
                // all others can be added right away
                if (_this.peripherals[type].rel_path.split("\\")[0] == "Sensors"){
                  peripherals['sensors'][type] = peripherals['sensors'][type] || {};
                  peripherals['sensors'][type][name] = 'no data';
                } else {
                  peripherals['actuators'][type] = peripherals['actuators'][type] || [];
                  peripherals['actuators'][type].push(name);
                }
                result_counter++;
                if (result_counter == hardware_list.length){
                  _this.$store.dispatch('setPeripherals', peripherals);
                }
              }


            }
          });
        }

      },
      checkLogin() {
         this.submitted = true;
         const { username, password } = this;
         // stop here if form is invalid
         if (!(username && password)) {
               return;
         }
         

         var url = "" 
         if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(window.location.hostname)){
            url = "http://" + this.online.find(o => o.value === username)["ip"] + "/api/login"
         } else {
            url = "http://" + username + ".local/api/login"
         }
         axios.post(url, {username: username, password: password}, {crossDomain: true, withCredentials: true})    
         .then((response) => {  
	         if (response.data.message){
	            this.error = response.data.message;  
            } else {
                  this.$store.dispatch('setUser', response.data)
            }
         })
      },
   },
   async mounted() {   //TODO: could this be beforeMount?

      console.log("Retrieving ROS parameters");
      this.getPeripherals();

      axios.get("/api/self")
      .then((response) => {
		   this.$store.dispatch('setUser', response.data)
      })

      var vue_this = this // TODO: can we do this in another way?
 
      let websocket = new WebSocket('ws://' + window.location.hostname + '/ws/clients');
      websocket.onmessage = function(event){
         var data = JSON.parse(event.data);
         var names = []
         if (data.length > 1){
            names.push({ value: null, text: 'Please select your Mirte' });
         }
         var selected = null
         for (var i in data){
            var hostname = data[i].name;
            names.push({ value: hostname, text: hostname + ' (' + data[i].referer.address + ')', ip: data[i].referer.address });

            if (window.location.href.indexOf(hostname.toLowerCase()) !== -1){
               selected = hostname;
            }            
         }
         vue_this.username = selected
         vue_this.online = names
      }
   },
   computed: {
      loginModalShow: function(){
         return false; // for now disable this. it has not extra functionality ye
         return this.$store.getters.getUser == "";
      },
      keymap() {
        return {
          "ctrl+alt+b": this.captureBlockly,
          "ctrl+alt+p": this.capturePython,
          "ctrl+alt+s": this.captureScreen,
        };
      }
   }
}
</script>

<style lang="scss">
$fa-font-path: "../node_modules/@fortawesome/fontawesome-free";

@import './assets/scss/main.scss';
@import '../node_modules/bootstrap/scss/bootstrap';
@import '../node_modules/bootstrap-vue/src/index.scss';
@import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
</style>
