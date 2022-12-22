<template>
    <div>
        <button :disabled="isUndoDisabled" class="btn btn-outline-light mr-2"
            v-b-tooltip.hover
            :title="$t('programming.undo')"
            @click="control('undo')"
        >
            <i class="fas fa-undo"></i>
        </button>

        

        <button :disabled="isRedoDisabled" class="btn btn-outline-light mr-2"
            v-b-tooltip.hover 
            :title="$t('programming.redo')"
            @click="control('redo')"
        >
            <i class="fa fa-redo"></i>
        </button>

        <span class="nav-spacer"></span>

        <span v-b-tooltip :title="connect" style="display: inline-block;">
        <button class="btn btn-outline-light mx-2"
            @click="connect_serial">
            <i class="fas fa-plug"></i>
        </button>
        </span>

        <span v-b-tooltip :title="$t('programming.start')" style="display: inline-block;">
        <button :disabled="isPlayDisabled" class="btn btn-outline-light mx-2" 
            @click="play">
            <i class="fas fa-play"></i>
        </button>
        </span>

        <span v-b-tooltip :title="$t('programming.pause')" style="display: inline-block;">
        <button :disabled="isPauseDisabled" 
            @click="control('pause')" class="btn btn-outline-light mr-2">
            <i class="fa fa-pause"></i>
        </button>
        </span>

        <span v-b-tooltip :title="$t('programming.step')" style="display: inline-block;">
        <button :disabled="isStepDisabled" class="btn btn-outline-light mr-2" 
            @click="control('step')">
            <i class="fa fa-step-forward"></i>
        </button>
        </span>

        <span v-b-tooltip :title="$t('programming.stop')" style="display: inline-block;">
	<button :disabled="isStopDisabled" class="btn btn-outline-light mr-2" 
            @click="control('stop')">
            <i class="fa fa-stop"></i>
        </button>
        </span>

        <span class="nav-spacer"></span>

        <button href="#" class="btn btn-outline-light mx-2" 
            v-b-tooltip.hover 
            :title="$t('programming.download')" 
            @click="download"
        >
            <i class="fa fa-download"></i>
        </button>

        <button class="btn btn-outline-light mr-2" 
            v-b-tooltip.hover 
            :title="$t('programming.upload')" 
            @click="openFileWindow"
        >
            <i class="fa fa-upload"></i>
            <input ref="file_input" @change="upload" type="file" name="name" style="display: none;" />
        </button>

    </div>
</template>

<script>
import EventBus from '../event-bus';

export default {
    data: () => ({
        serial_port: {},
        connected: false
    }),
    methods: {
        control(command) {
            EventBus.$emit('control', command);
        },

        openFileWindow(){
            this.$refs.file_input.click()
        },

        upload(){
            var fr=new FileReader(); 

            fr.onload = () => { 
                console.log(fr.result)
                this.$store.dispatch('setBlockly', fr.result)
            } 

            if(this.$refs.file_input.files.length > 0){
                fr.readAsText(this.$refs.file_input.files[0]); 
            }
            
        },
        async connect_serial(){
             if (this.connected){
                 this.serial_port.close();
                 console.log("disconnected");
             } else {
                 this.serial_port = await navigator.serial.requestPort();
                 await this.serial_port.open({ baudRate: 115200 });
                 this.upload_mirte_api();
                 console.log("connected");
             }
             this.connected = !this.connected;
        },
        upload_mirte_api(){
             // Make dir
             this.writeLineToPort(this.serial_port, 'import os')
             this.writeLineToPort(this.serial_port, 'os.mkdir("mirte_robot")')

             // Make class
             this.putFile(this.serial_port, "/mirte_robot/__init__.py", "");

             // Upload Mirte API (TODO: do so in a beter way)
             let code = "from machine import Pin\nmirte = {}\n\nclass Robot():\n  def __init__(self):\n    i = 20\n\n  def setDigitalPinValue(self, pin, value):\n    Pin(int(pin), Pin.OUT).value(value)\n\ndef createRobot():\n  global mirte\n  mirte = Robot()\n  return mirte"
             this.putFile(this.serial_port, "/mirte_robot/robot.py", code);

        },
        play(){
             // Uploade code
             const code = this.$store.getters.getCode;
             this.putFile(this.serial_port, "main.py", code); 

             // And run right away
             this.writeLineToPort(this.serial_port, 'exec(open("main.py").read(),globals())')

             // TODO: nicely close, and catch disconnect events
        },
        putFile(port, filename, code){
          this.writeLineToPort(port, "f = open('" + filename + "', 'wb')");

          var lines = code.split('\n');
          for(var i = 0;i < lines.length;i++){
              // do i need to escape anything?
              this.writeLineToPort(port, 'f.write("' + lines[i] + '\\n")');
          }

          this.writeLineToPort(port, "f.close()");
        },
        writeLineToPort(port, line){
           let writer = port.writable.getWriter();
           let encoder = new TextEncoder();
           console.log("[WRITE] " + line);
           writer.write(encoder.encode(line + '\r'));
           writer.releaseLock()
        },
        download(){
            var text = localStorage.getItem("blockly");
            var filename = "mirte.xml";
            
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        },


    },
    computed: {
       isUndoDisabled: function(){
           return false; // TODO: determine strategy 
       },
       isRedoDisabled: function(){
           return false; // TODO: determine strategy
       },
     	 isPlayDisabled: function(){
          return this.$store.getters.getExecution == "running";
       },
     	 isPauseDisabled: function(){
          return this.$store.getters.getExecution != "running";
       },
     	 isStepDisabled: function(){
          return this.$store.getters.getExecution == "stopped";
       },
     	 isStopDisabled: function(){
          return this.$store.getters.getExecution == "stopped";
       }
    }

}
</script>
