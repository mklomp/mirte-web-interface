<template>
   <div class="rounded background-tertiary h5 p-3 mb-2">
     {{ $t('actuators.output') }}
     <div v-show="isLoading" class="float-right">Loading...</div>
     <div>
        <div :style="{ visibility: isLoading ? 'hidden' : 'visible' }" id="terminal" ref="terminal" class="xterm"></div>
     </div>
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
        isLoading: true
    }),
    activated: function(){
        this.term.focus();
    },
    watch: {
      '$store.getters.getExecution': function (newValue, oldVal) {
          this.isLoading = (newValue == "disconnected" || newValue == "initializing");
        }
    },
    methods: {
        waitForSocketConnection(){
              // TODO: correctly close the connection
              const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
              const linetrace_socketUrl = `${protocol}${location.hostname}/ws/linetrace`;
              this.linenr_socket = new WebSocket(linetrace_socketUrl);

              this.linenr_socket.onerror = (event) => {
                  setTimeout(function () {
                     console.log("waiting for connection");
                     this.waitForSocketConnection();
                  }.bind(this), 10);
              };

              this.linenr_socket.onmessage = (event) => {
                if (event.data != 0) {
                  // Update only when in step/pause mode
                  if (event.data.substr(0, 4) == "pid:"){
                     let debugger_pid = String(event.data.substr(4));
                     let strace_cmd = 'strace -ff -e write=1,2 -s 1024 -p ' + debugger_pid + ' 2>&1 | grep "^ |" --line-buffered | stdbuf -oL cut -b11-60 | stdbuf -oL sed -e "s/ //g" | xxd -r -p';
                     this.shell_socket.send(strace_cmd + '\n');
                     this.$store.dispatch('setExecution', 'running');
                  }
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
            this.term.clear();
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
                   this.shell_socket.send('run()\n');
                   this.$store.dispatch('setExecution', 'running');
                   //this.linenr_socket.send("c");
               }).catch(err => {
                   console.log("sending failed")
                   console.log(err)
               })
               }
        },
        stopCode() {
            this.shell_socket.send("\x03");
            //this.linenr_socket.send("e");
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
              this.term.setOption('theme', {});
              this.shell_socket.send("stty echo && PS1='\\[\\e]0;\\u@\\h: \\w\\a\\]${debian_chroot:+($debian_chroot)}\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ ' && clear\n");
              this.term.setOption('disableStdin', false);
           } else {
              // TODO: use colors from scss
              this.term.setOption('theme', { background: '#fefaf7', foreground: '#fefaf7', cursor: '#fefaf7' });
              this.shell_socket.send("stty -echo && PS1='' && clear\n");
              this.shell_socket.send("clear\n");
              this.term.setOption('disableStdin', true);
              // TODO: use colors from scss
              this.term.setOption('theme', { background: '#fefaf7', foreground: '#000000', cursor: '#fefaf7' });
           }
        },
        toggleTerminal() {
            this.setTerminal(this.term.getOption('disableStdin'));
        },
    },
    mounted()  {
        // Open the websocket connection to the backend
        this.shell_socket = shell_socket;

        // Open the websocket connection to the debugger
        //this.waitForSocketConnection();

        // The terminal
        // TODO: use colors from scss
        this.term = new Terminal({theme: { background: '#fefaf7', foreground: '#fefaf7', cursor: '#fefaf7' }});
        const fitAddon = new FitAddon();
        this.term.loadAddon(new AttachAddon(this.shell_socket));
        this.term.loadAddon(fitAddon);
        this.term.open(this.$refs.terminal);
        // fitAddodn.fit() gives error
        const dimensions = fitAddon.proposeDimensions();
        if (!isNaN(dimensions.cols) && !isNaN(dimensions.rows)){
           this.term.resize(dimensions.cols, dimensions.rows);
        }
        this.term.setOption('disableStdin', true);

        // Load env variables
        this.shell_socket.onmessage = (ev) => {
           if (this.$store.getters.getExecution == "disconnected" && ev.data.slice(-2) == "$ ") {
              this.$store.dispatch('setExecution', 'initializing');
              this.shell_socket.send("unset HISTFILE\n");
              this.shell_socket.send("cd /home/mirte/workdir\n");
              this.shell_socket.send("ps aux | grep 'python3 -i -c' | awk '{print $2}' | xargs kill -9\n"); // TODO: this should be fixed in the backend
              this.shell_socket.send("history -c\n");
              this.shell_socket.send("python3 -i -c 'from mirte_robot import robot; mirte=robot.createRobot()'\n");
           }
           else if (this.$store.getters.getExecution == "initializing" && ev.data.slice(-4) == ">>> "){
              this.shell_socket.send('def run():\n');
              this.shell_socket.send('  try:\n');
              this.shell_socket.send('    print("\\033[38;2;0;0;0m", end="")\n');
              this.shell_socket.send('    exec(open("/home/mirte/workdir/mirte.py").read())\n');
              this.shell_socket.send('    print("\\033[38;2;254;250;247m", end="")\n');
              this.shell_socket.send('  except:\n');
              this.shell_socket.send('    print("\\r", end="")\n');
              this.shell_socket.send('    print("\\033[38;2;254;250;247m", end="")\n');
              this.shell_socket.send('  finally: mirte.stop()\n\n');
              this.shell_socket.send('print("\\033[38;2;254;250;247m", end="")\n');
              this.$store.dispatch('setExecution', 'initialized');
           }
           else if (this.$store.getters.getExecution == "initialized" && ev.data.slice(-4) == ">>> "){
              this.term.clear();
              this.$store.dispatch('setExecution', 'ready');
           }
           else if ((this.$store.getters.getExecution == "stopped" || this.$store.getters.getExecution == "running") && ev.data.slice(-4) == ">>> "){
              this.$store.dispatch('setExecution', 'ready');
           }
        }

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
                case "play":
                    // TODO: use colors from scss
                    this.term.setOption('theme', { background: '#fefaf7', foreground: '#000000', cursor: '#fefaf7' });
                    this.playCode()
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
