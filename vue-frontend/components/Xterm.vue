<template>
  <div class="rounded background-tertiary h5 p-3 mb-2">
    {{ $t("actuators.output") }}
    <div v-show="isLoading" class="float-end">Loading...</div>
    <div>
      <div id="terminal" ref="terminal" class="xterm2"></div>
    </div>
  </div>
</template>

<script setup>
const terminal = ref(null);
const programmingState = useState("programming-state");
const ROSState = useState("ros-state");
const termState = useState("term-state");
let isLoading = ref(true);

const { $attachContainer } = useNuxtApp();
let shell = null;

onMounted(() => {
  if (terminal.value) {
    shell = $attachContainer(terminal.value);
  }

  // TODO: edbug version not yet working.....
  let debug = false; // TODO: make user setting
  if (debug) {
    shell.attach();
    shell.term.options.theme = {
      background: "#fefaf7",
      foreground: "#000000",
      cursor: "#000000",
    };
    shell.term.options.disableStdin = false;
  } else {
    shell.term.options.theme = {
      background: "#fefaf7",
      foreground: "#000000",
      cursor: "#fefaf7",
    };
    shell.term.options.disableStdin = true;
  }

  // NOTE: this is async processing of the state of the terminal. Messages from the websocket
  // will be received, but might be just a few characters. A buffer is used to determine whether
  // we just received the first command promps ($), or have finished the initialization
  // (__PYTHON_INITIALIZED__). The termState is used to make sure that the commands are ran
  // only once.
  let buffer = "";
  shell.socket.onmessage = (event) => {
    buffer += event.data;

    //console.log(JSON.stringify(buffer))
    if (termState.value == "disconnected" && buffer.slice(-2) == "$ ") {
      buffer = "";
      // Initilize the shell
      shell.sendLine("PS1='$ '"); // Use minimalistic bash
      shell.sendLine("stty echo"); // Make sure that not all commands are shown in the terminal
      shell.sendLine("unset HISTFILE"); // Do not add these commands to the histfile
      shell.sendLine("cd /home/mirte/workdir");
      shell.sendLine("ps aux | grep 'python3 -i -c' | awk '{print $2}' | xargs kill -9"); // TODO: this should be fixed in the backend
      shell.sendLine("history -c && clear");
      shell.sendLine(
        "python3 -i -c 'from mirte_robot import robot; import importlib.util; mirte=robot.createRobot();'"
      );
      termState.value = "terminal_initialized";

      // Initialize run() function to be able to execute mirte.py and only see print() and errors.
      shell.sendLine("def run():");
      shell.sendLine('  print("\\033[1A\\033[2K\\r", end="")'); // remove the previous line in terminal (i.e run())
      shell.sendLine('  print("\\033[38;2;0;0;0m", end="")'); // show the print statements and errors
      shell.sendLine(
        '  spec = importlib.util.spec_from_file_location("mirte", "/home/mirte/workdir/mirte.py")'
      );
      shell.sendLine("  mod = importlib.util.module_from_spec(spec)");
      shell.sendLine("  try:");
      shell.sendLine("    spec.loader.exec_module(mod)");
      shell.sendLine('    print("\\033[38;2;254;250;247m", end="")'); // stop showing text
      shell.sendLine("  except SystemExit:");
      shell.sendLine("    pass"); // do not print SystemExit
      shell.sendLine('    print("\\r", end="")');
      shell.sendLine('    print("\\033[38;2;254;250;247m", end="")'); // stop showing text
      shell.sendLine("  except Exception as e:");
      shell.sendLine("    print(e)"); // print exception
      shell.sendLine('    print("\\r", end="")');
      shell.sendLine('    print("\\033[38;2;254;250;247m", end="")'); // stop showing text
      shell.sendLine("  finally:");
      shell.sendLine("    mirte.stop()");
      shell.sendLine('    print("__STOP__")');
      shell.sendLine(""); // including final newline of function (TOOD: needed?)
      //shell.sendLine('print("\\033[38;2;254;250;247m", end="")');     // stop showing text (TODO: prbably not needed?)
      shell.sendLine('print("__PYTHON_INITIALIZED__")');
      //shell.sendLine('print("\\033[2J\\033[3J\\033[H", end="")');     // (TODO: prbably not needed?) clear the screen (better than term.clear() since term might still be receiving these commands)
      termState.value = "python_initialized";
    } else if (
      termState.value == "python_initialized" &&
      buffer.includes("\r\n__PYTHON_INITIALIZED__\r\n>>> ")
    ) {
      termState.value = "python-active";
      buffer = "";
      shell.attach(); // now that everything is done, attach it so it can be visualized

      isLoading.value = false; // TODO: should be connected to termState
      if (ROSState.value == "connected") {
        // TODO: should be done somehere else with wathinng ROSState and termState
        programmingState.value = "idle";
      }
    } else if (buffer.includes("__STOP__\r\n>>> ")) {
      buffer = "";
      programmingState.value = "idle";
    }
  };
});

function playCode() {
  shell.term.clear();
  const codeStore = useCodeStore();

  if (programmingState.value == "paused") {
    this.linenr_socket.send("c");
    programmingState.value = "running";
  } else {
    // Not running, so upload code and start executing
    const pythonUrl = `http://192.168.43.1/api/python`;

    fetch(pythonUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        CORS: "Access-Control-Allow-Origin",
      },
      body: codeStore.python,
    })
      .then((res) => {
        shell.sendLine("run()");
        programmingState.value = "running";
        //this.linenr_socket.send("c");
      })
      .catch((err) => {
        console.log("sending failed");
        console.log(err);
      });
  }
}

function stopCode() {
  shell.send("\x03"); // CTRL-C
}

watch(programmingState, (newVal) => {
  isLoading = newVal === "disconnected" || newVal === "initializing";

  switch (newVal) {
    case "start_initiated":
      playCode();
      break;
    case "stop_initiated":
      stopCode();
      break;
  }
});

</script>