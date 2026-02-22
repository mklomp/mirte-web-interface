<template>
   <div class="rounded background-tertiary h5 p-3 mb-2">
     {{ $t('actuators.output') }}
     <div v-show="isLoading" class="float-right">Loading...</div>
     <div>
        <div :style="{ visibility: isLoading ? 'hidden' : 'visible' }" id="terminal" ref="terminal" class="xterm2"></div>
     </div>
   </div>
</template>

<script>

import { ref, onMounted } from 'vue'
const termContainer = ref(null)

// Get from plugin
const { $attachShell } = useNuxtApp()
const { $shellSocket } = useNuxtApp()

const programmingState = useState('programming-state')

export default {
    data: () => ({
        shell_socket: WebSocket,
        linenr_socket: WebSocket,
        //term: Terminal,
        isLoading: false
    }),
    activated: function(){
       // this.term.focus();
    },
 /*   watch: {
      programmingState: function (newValue, oldVal) {
            console.log(newValue)
          //this.isLoading = (newValue == "disconnected" || newValue == "initializing");
        }
    },*/
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
            const codeStore = useCodeStore();

            if (programmingState.value == "paused"){
               this.linenr_socket.send("c");
               programmingState.value = "running"
            } else {
               // Not running, so upload code and start executing
               const pythonUrl = `http://192.168.0.16/api/python`;

               fetch(pythonUrl, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'text/plain',
                       'CORS': 'Access-Control-Allow-Origin'
                   },
                   body: codeStore.python,
               }).then(res => {
                   this.shell_socket.send('run()\n');
                   programmingState.value = "running"
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
              this.term.options.theme = { background: '#fefaf7', foreground: '#000000', cursor: '#fefaf7'}
              this.shell_socket.send("stty echo && PS1='\\[\\e]0;\\u@\\h: \\w\\a\\]${debian_chroot:+($debian_chroot)}\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ ' && clear\n");
              this.term.options.disableStdin = false
           } else {
              // TODO: use colors from scss
              this.term.options.theme = { background: '#fefaf7', foreground: '#fefaf7', cursor: '#fefaf7'}
              this.shell_socket.send("stty -echo && PS1='' && clear\n");
              this.shell_socket.send("clear\n");
              this.term.options.disableStdin = true
              // TODO: use colors from scss
              this.term.options.theme = { background: '#fefaf7', foreground: '#000000', cursor: '#fefaf7'}
           }
        },
        toggleTerminal() {
            this.setTerminal(this.term.getOption('disableStdin'));
        },
    },
    mounted()  {
        this.term = $attachShell(this.$refs.terminal)
        this.shell_socket = $shellSocket;
        this.setTerminal(true);

        const programmingState = useState('programming-state')
        const ROSState = useState('ros-state')
        const termState = useState('term-state')

        // Load env variables
        this.shell_socket.onmessage = (ev) => {
           if (termState.value == "disconnected" && ev.data.slice(-2) == "$ ") {
              termState.value = "initializing";
              this.shell_socket.send("unset HISTFILE\n");
              this.shell_socket.send("cd /home/mirte/workdir\n");
              this.shell_socket.send("ps aux | grep 'python3 -i -c' | awk '{print $2}' | xargs kill -9\n"); // TODO: this should be fixed in the backend
              this.shell_socket.send("history -c\n");
              this.shell_socket.send("python3 -i -c 'from mirte_robot import robot; import importlib.util; mirte=robot.createRobot()'\n");
              console.log("initializeing");
           }
           else if (termState.value == "initializing" && ev.data.slice(-4) == ">>> "){
              this.shell_socket.send('def run():\n');
              this.shell_socket.send('  print("\\033[38;2;0;0;0m", end="")\n');
              this.shell_socket.send('  spec = importlib.util.spec_from_file_location("mirte", "/home/mirte/workdir/mirte.py")\n');
              this.shell_socket.send('  mod = importlib.util.module_from_spec(spec)\n');
              this.shell_socket.send('  try:\n');
              this.shell_socket.send('    spec.loader.exec_module(mod)\n');
              this.shell_socket.send('    print("\\033[38;2;254;250;247m", end="")\n');
              this.shell_socket.send('  except SystemExit:\n');
              this.shell_socket.send('    pass\n');
              this.shell_socket.send('    print("\\r", end="")\n');
              this.shell_socket.send('    print("\\033[38;2;254;250;247m", end="")\n');
              this.shell_socket.send('  except Exception as e:\n');
              this.shell_socket.send('    print(e)\n');
              this.shell_socket.send('    print("\\r", end="")\n');
              this.shell_socket.send('    print("\\033[38;2;254;250;247m", end="")\n');
              this.shell_socket.send('  finally: mirte.stop()\n\n');
              this.shell_socket.send('print("\\033[38;2;254;250;247m", end="")\n');
              console.log("initialized11")
              termState.value = 'initialized';
           }
           else if (termState.value == "initialized" && ev.data.slice(-4) == ">>> "){
              // If python console is started and active
              console.log("initialized")
              this.term.clear();
              termState.value = "python-active";
              console.log(ROSState.value)
              if (ROSState.value == "connected"){
                programmingState.value = "ready";
              }
           }
           else if ((programmingState.value == "stopped" || programmingState.value == "running") && ev.data.slice(-4) == ">>> "){
              programmingState.value = "ready";
           }
        }

   

        watch(programmingState, (newVal, oldVal) => {
          console.log('Programming state changed:', newVal)
          this.isLoading = (newVal === "disconnected" || newVal === "initializing")
          switch(newVal){

            case "running":
                this.term.options.theme = { background: '#fefaf7', foreground: '#000000', cursor: '#fefaf7'}
                this.playCode()
                break;
          }
        })

        /*
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
        */
    }

}
</script>
