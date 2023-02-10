<template>
    <div class="h-100" >
        <div id="terminal" ref="terminal" class="xterm h-100"></div>
    </div>
</template>

<script>
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import shell_socket from '../ws-connection/xterm-connection.js'

import EventBus from '../event-bus';

export default {
    data: () => ({
        shell_socket: WebSocket,
        linenr_socket: WebSocket,
        term: Terminal,
    }),
    activated: function(){
        this.term.focus();
    },
    methods: {
        waitForSocketConnection(){
              // TODO: correctly close the connection
              const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
              const linetrace_socketUrl = `${protocol}${location.hostname}/ws/linetrace`;
              this.linenr_socket = new WebSocket(linetrace_socketUrl);

              this.linenr_socket.onerror = (event) => {
                  setTimeout(function () {
                    // console.log("waiting for connection");
                     this.waitForSocketConnection();
                  }.bind(this), 10);
              };

              this.linenr_socket.onopen = (event) => {
                  this.linenr_socket.send("c");
                  this.$store.dispatch('setExecution', 'running');
              };

              this.linenr_socket.onmessage = (event) => {
                if (event.data != 0) {
                  // Update only when in step/pause mode
                  if (this.$store.getters.getExecution == "paused") {
                     this.$store.dispatch('setLinenumber', event.data);
                  }
                } else {
                  this.$store.dispatch('setLinenumber', null);
                  this.$store.dispatch('setExecution', 'stopped');
                }
              };
        },
        playCode() {
            if (this.$store.getters.getExecution == "paused"){
               this.linenr_socket.send("c");
               this.$store.dispatch('setExecution', 'running');
            } else {
               // Not running, so upload code and start executing
               const pythonUrl = `http://${location.hostname}/api/python`;

               fetch(pythonUrl, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'text/plain',
                       'CORS': 'Access-Control-Allow-Origin'
                   },
                   body: this.$store.getters.getCode,
               }).then(res => {
                   this.waitForSocketConnection();
               }).catch(err => {
                   console.log("sending failed")
                   console.log(err)
               })
               }
        },
        stopCode() {
            this.linenr_socket.send("e");
            this.$store.dispatch('setLinenumber', null)
            this.$store.dispatch('setExecution', 'stopped');
        },
        pauseCode() {
            this.linenr_socket.send("b");
            this.$store.dispatch('setExecution', 'paused');
        },
        stepCode() {
            this.linenr_socket.send("s");
        },
        clearOutput() {
            // stop running program, clear terminal, remove step indicator
            this.linenr_socket.send("e");
            this.$store.dispatch('setExecution', 'stopped');
            this.shell_socket.send("clear\n");
            this.$store.dispatch('setLinenumber', null)
        },
        setTerminal(terminal){
           if (terminal){
              //this.term.setOption('theme', {});
              //this.shell_socket.send("stty echo && PS1='\\[\\e]0;\\u@\\h: \\w\\a\\]${debian_chroot:+($debian_chroot)}\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ ' && clear\n");
              this.term.setOption('disableStdin', false);
           } else {
              //this.term.setOption('theme', { background: '#e2e8e9', foreground: '#e2e8e9', cursor: '#e2e8e9' });
              //this.shell_socket.send("stty -echo && PS1='' && clear\n");
              //this.shell_socket.send("clear\n");
              this.term.setOption('disableStdin', false);
              this.term.setOption('theme', { background: '#e2e8e9', foreground: '#000000', cursor: '#e2e8e9' });
           }
        },
        toggleTerminal() {
            this.setTerminal(this.term.getOption('disableStdin'));
        },
        async connectCode(){
             if (this.connected){
                 this.serial_port.close();
                 console.log("disconnected");
             } else {
                 this.serial_port = await navigator.serial.requestPort();
                 await this.serial_port.open({ baudRate: 115200 });
                 this.writeLineToPort(this.serial_port, '\x03\x03')
                 this.upload_mirte_api();
                 console.log("connected");
                 await this.read_serial_data();
             }
             this.connected = !this.connected;
        },
        async read_serial_data(){
const textDecoder = new TextDecoderStream();
const readableStreamClosed = this.serial_port.readable.pipeTo(textDecoder.writable);
const reader = textDecoder.readable.getReader();

// Listen to data coming from the serial device.
let line = ""
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    // Allow the serial port to be closed later.
    reader.releaseLock();
    break;
  }

  let nextpart = line + value
  let splits = nextpart.split('\n')
  for (var i = 0; i < splits.length; i++){
     let curline = splits[i]
     if (i == splits.length -1){
       line = curline
     }
     
//     console.log(curline);
     if (curline.substring(0,3) != ">>>"){
        this.term.write(curline + "\n")
     }

  }


  //if (value.split('\n')[1]){
  //  console.log("----------")
  //  console.log(value.split('\n')[0]);
  //  console.log(value.split('\n')[1]);
  //}
  // value is a string.
  // console.log(value)
   //console.log(value.substring(0,3));
 //  if (value.substring(0,3) != ">>>"){
 //     this.term.write(value);
 //  }
}

        },
/*


        async read_serial_data(){
    let bytes = new Uint8Array(32);
    let readBytes = 0;
    let finished = false;

    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (value) {
          let chunk = value;

          if (readBytes === 0 && chunk[0] === SerialService.FAIL) {
            return bytes;
          }

          for (let i = 0; i < chunk.length; i++) {
            bytes[i] = chunk[i];
            readBytes++;

            if (readBytes >= numberOfBytes) {
              finished = true;
            }
          }
        }
        if (done || finished) {
          break;
        }
      }
    } catch (error) {
      console.error("Serial port reading error: " + error);
    }

    console.log(bytes);
    return bytes;



        },

        async read_serial_data(){
           const reader = this.serial_port.readable.getReader();
           // Listen to data coming from the serial device.
           while (true) {
              const { value, done } = await reader.read();
              if (done) {
                  // Allow the serial port to be closed later.
                  reader.releaseLock();
                  break;
              }
              // value is a Uint8Array.
              console.log(value);
           }
        },*/
        upload_mirte_api(){
             // Make dir
             this.writeLineToPort(this.serial_port, 'import os')
             this.writeLineToPort(this.serial_port, 'os.mkdir("mirte_robot")')

             // Make class
             this.putFile(this.serial_port, "/mirte_robot/__init__.py", "");

             // Upload Mirte API (TODO: do so in a beter way)
             let code = "from machine import Pin, ADC, PWM\nmirte = {}\n\nclass Robot():\n  def __init__(self):\n    i = 20\n\n  def setDigitalPinValue(self, pin, value):\n    Pin(int(pin), Pin.OUT).value(value)\n\n  def setAnalogPinValue(self, pin, value):\n    pwm = PWM(Pin(int(pin)))\n    pwm.freq(1000)\n    pwm.duty_u16(value)\n\n  def getDigitalPinValue(self, pin):\n    return Pin(int(pin), Pin.IN).value()\n\n  def getAnalogPinValue(self, pin):\n    return ADC(int(pin)).read_u16()\n\ndef createRobot():\n  global mirte\n  mirte = Robot()\n  return mirte"
             this.putFile(this.serial_port, "/mirte_robot/robot.py", code);

        },
        play(){
             // Uploade code
             const code = this.$store.getters.getCode;
             this.writeLineToPort(this.serial_port, '\x03\x03') // Send CTRL-C to kill running program (needed?)
             this.putFile(this.serial_port, "main.py", code); 

             // And run right away
             // TODO: in order to get step and pause wokring we need to execute it line by line
             // 1) by introcuding a linetrace? or 2) just doing it step by step here?
             this.writeLineToPort(this.serial_port, 'exec(open("main.py").read(),globals())')

             // TODO: nicely close, and catch disconnect events
        },
        stopCode(){
             this.writeLineToPort(this.serial_port, '\x03\x03') // Send CTRL-C to kill running program
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
          // console.log("[WRITE] " + line);
           writer.write(encoder.encode(line + '\r'));
           writer.releaseLock()
        },
    },
    mounted()  {
       // Open the websocket connection to the backend
        this.shell_socket = shell_socket;

        // The terminal
        this.term = new Terminal({theme: { background: '#e2e8e9', foreground: '#e2e8e9', cursor: '#e2e8e9' }});
        const fitAddon = new FitAddon();
        this.term.loadAddon(new AttachAddon(this.shell_socket));
        this.term.loadAddon(fitAddon);
        this.term.open(this.$refs.terminal);
        // fitAddodn.fit() gives error
        const dimensions = fitAddon.proposeDimensions();
        if (!isNaN(dimensions.cols) && !isNaN(dimensions.rows)){
           this.term.resize(dimensions.cols, dimensions.rows);
        }
        //this.term.setOption('disableStdin', true);
        
        // Load env variables
        this.shell_socket.onopen = (ev) => {
            this.shell_socket.send("stty -echo && PS1='' && clear\n");
            this.shell_socket.send("clear\n");
            this.shell_socket.send("cd /home/mirte/workdir/ && source /opt/ros/noetic/setup.bash && source /home/mirte/mirte_ws/devel/setup.bash && pkill -f mirte_robot.linetrace || /bin/true && python3 -m mirte_robot.linetrace & clear\n");
        };

        // Autoresize terminal on size change
        const observer = new ResizeObserver(entries => {
           //fitAddon.fit() gives error
           const dimensions = fitAddon.proposeDimensions();
           if (!isNaN(dimensions.cols) && !isNaN(dimensions.rows)){
              this.term.resize(dimensions.cols, dimensions.rows);
           }
        })
        observer.observe(this.$refs.terminal)

        // event bus for control functions
        EventBus.$on('control', (payload) => {

            switch(payload){
                case "connect":
                    this.connectCode()
                    break;
                case "play":
                    this.term.setOption('theme', { background: '#e2e8e9', foreground: '#000000', cursor: '#e2e8e9' });
                    //this.playCode()
                    this.play()
                    break;
                case "stop":
                    this.stopCode()
                    break;
                case "step":
                    this.stepCode()
                    break;
                case "pause":
                    this.pauseCode()
                    break;
                case "clear":
                    this.clearOutput()
                    break;
                case "terminal":
                    this.toggleTerminal()
                    break;
            }
        });
    }

}
</script>
