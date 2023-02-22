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
        reader: {},
        writer: {},
        readableStreamClosed: {},
        writableStreamClosed: {}
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
              //this.term.setOption('disableStdin', false);
           } else {
              //this.term.setOption('theme', { background: '#e2e8e9', foreground: '#e2e8e9', cursor: '#e2e8e9' });
              //this.shell_socket.send("stty -echo && PS1='' && clear\n");
              //this.shell_socket.send("clear\n");
              //this.term.setOption('disableStdin', false);
              //this.term.setOption('theme', { background: '#e2e8e9', foreground: '#000000', cursor: '#e2e8e9' });
           }
        },
        toggleTerminal() {
            //this.setTerminal(this.term.getOption('disableStdin'));
        },
        async connectCode(){
             if (this.$store.getters.getSerialStatus == "connected"){
                 this.reader.cancel();
                 await this.readableStreamClosed.catch(() => { /* Ignore the error */ });

                 this.writer.close();
                 await this.writableStreamClosed;

                 await this.serial_port.close();
                 this.$store.dispatch('setSerialStatus', 'disconnected');
             } else {
                 // TODO: try catch
                 this.serial_port = await navigator.serial.requestPort();
                 this.serial_port.addEventListener('disconnect', (event) => {
                     this.$store.dispatch('setSerialStatus', 'disconnected');
                 });
                 await this.serial_port.open({ baudRate: 115200 });

                 const textEncoder = new TextEncoderStream();
                 this.writer = textEncoder.writable.getWriter();
                 this.writableStreamClosed = textEncoder.readable.pipeTo(this.serial_port.writable);
 
                 this.writeLineToPort('\x03\x03');
                 this.upload_mirte_api();
                 this.writeLineToPort('exec(open("resetpins.py").read(),globals())')

                 this.$store.dispatch('setSerialStatus', 'connected');

                 const textDecoder = new TextDecoderStream();
                 this.readableStreamClosed = this.serial_port.readable.pipeTo(textDecoder.writable);
                 this.reader = textDecoder.readable.getReader();
                 await this.read_serial_data();
             }
        },
        async read_serial_data(){
          // Listen to data coming from the serial device.
          let line = ""
          while (true) {
            const { value, done } = await this.reader.read();
              if (done) {
                // Allow the serial port to be closed later.
                this.reader.releaseLock();
                break;
              }

            let nextpart = line + value
            let splits = nextpart.split('\n')
            for (var i = 0; i < splits.length; i++){
              let curline = splits[i]
              if (i == splits.length -1){
                line = curline;
              } else {
                // Do not show the python commands themselves
                if (curline.substring(0,3) != ">>>" && curline.substring(0,3) != "..." && curline.substring(0,19) != "MicroPython v1.19.1" && curline.substring(0,13) != 'Type "help()"'){
                   this.term.write(curline + "\n")
                }
              }
            }
          }
        },
        upload_mirte_api(){
             // Make dir
             this.writeLineToPort('import os')
             this.writeLineToPort('if "mirte_robot" not in os.listdir():')   //os.path. does not exist in micropython
             this.writeLineToPort('  os.mkdir("mirte_robot")')
             this.writeLineToPort('')

             // Make class
             this.putFile("/mirte_robot/__init__.py", "");

             // Upload Mirte API (TODO: do so in a beter way)
             let code = "from machine import Pin, ADC, PWM\nmirte = {}\n\nclass Robot():\n  def __init__(self):\n    i = 20\n\n  def setDigitalPinValue(self, pin, value):\n    Pin(int(pin), Pin.OUT).value(value)\n\n  def setAnalogPinValue(self, pin, value):\n    pwm = PWM(Pin(int(pin)))\n    pwm.freq(1000)\n    pwm.duty_u16(value)\n\n  def getDigitalPinValue(self, pin):\n    return Pin(int(pin), Pin.IN).value()\n\n  def getAnalogPinValue(self, pin):\n    return ADC(int(pin)).read_u16()\n\ndef createRobot():\n  global mirte\n  mirte = Robot()\n  return mirte"
             this.putFile("/mirte_robot/robot.py", code);

             // Upload Resetpins
             code = "from machine import Pin\nfor i in range(0,29):\n  Pin(i, Pin.OUT).off()";
             this.putFile("/resetpins.py", code);

             // Upload main.py
             code = "import sys\ntry:\n  exec(open('./mirte.py').read(),globals())\nexcept:\n  exec(open('./resetpins.py').read(),globals())\n  sys.exit(0)";
             this.putFile("/main.py", code);

        },
        play(){
             // Uploade code
             const code = this.$store.getters.getCode;
             this.writeLineToPort('\x03\x03') // Send CTRL-C to kill running program (needed?)
             this.putFile("mirte.py", code); 

             // And run right away
             // TODO: in order to get step and pause wokring we need to execute it line by line
             // 1) by introcuding a linetrace? or 2) just doing it step by step here?
             this.writeLineToPort('exec(open("main.py").read(),globals())')
        },
        stopCode(){
             this.writeLineToPort('\x03\x03') // Send CTRL-C to kill running program
             //this.writeLineToPort('import machine');
             //this.writeLineToPort('machine.soft_reset()');
        },
        putFile(filename, code){
          this.writeLineToPort("f = open('" + filename + "', 'wb')");

          var lines = code.split('\n');
          for(var i = 0;i < lines.length;i++){
              // do i need to escape anything?
              this.writeLineToPort('e = f.write("' + lines[i] + '\\n")');
          }

          this.writeLineToPort("f.close()");
        },
        writeLineToPort(line){
           //console.log("[WRITE] " + line);
           this.writer.write(line + '\r');
        },
    },
    mounted()  {
       // Open the websocket connection to the backend
        this.shell_socket = shell_socket;

        // The terminal
        this.term = new Terminal({theme: { background: '#e2e8e9', foreground: '#000000', cursor: '#e2e8e9' }});
        const fitAddon = new FitAddon();
        //this.term.loadAddon(new AttachAddon(this.shell_socket));
        this.term.loadAddon(fitAddon);
        this.term.open(this.$refs.terminal);
        fitAddon.fit();
        //const dimensions = fitAddon.proposeDimensions();
        //console.log(dimensions);
        //if (!isNaN(dimensions.cols) && !isNaN(dimensions.rows)){
        //   this.term.resize(dimensions.cols, dimensions.rows);
        //}
        //this.term.setOption('disableStdin', true);
        
        // Load env variables
        this.shell_socket.onopen = (ev) => {
            this.shell_socket.send("stty -echo && PS1='' && clear\n");
            this.shell_socket.send("clear\n");
            this.shell_socket.send("cd /home/mirte/workdir/ && source /opt/ros/noetic/setup.bash && source /home/mirte/mirte_ws/devel/setup.bash && pkill -f mirte_robot.linetrace || /bin/true && python3 -m mirte_robot.linetrace & clear\n");
        };

        // Autoresize terminal on size change
        const observer = new ResizeObserver(entries => {
           fitAddon.fit();
//           const dimensions = fitAddon.proposeDimensions();
//           console.log(dimensions);
//           if (!isNaN(dimensions.cols) && !isNaN(dimensions.rows)){
//              this.term.resize(dimensions.cols, dimensions.rows);
//           }
        })
        observer.observe(this.$refs.terminal)

        // event bus for control functions
        EventBus.$on('control', (payload) => {

            switch(payload){
                case "connect":
                    this.connectCode()
                    break;
                case "play":
                    //this.term.setOption('theme', { background: '#e2e8e9', foreground: '#000000', cursor: '#e2e8e9' });
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
