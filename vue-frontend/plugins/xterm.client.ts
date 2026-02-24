import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { AttachAddon } from '@xterm/addon-attach'
import { FitAddon } from '@xterm/addon-fit'

export default defineNuxtPlugin(() => {



  function attachContainer(container) {
    
    let attach_req = false;
    const term = new Terminal()



    term.options.theme = { background: '#fefaf7', foreground: '#000000', cursor: '#000000'}
    const fitAddon = new FitAddon()

    term.loadAddon(fitAddon)
    term.open(container)
    fitAddon.fit()

    const resizeObserver = new ResizeObserver(() => fitAddon.fit())
    resizeObserver.observe(container)

    const socketUrl = `ws://192.168.43.1/ws/shell`
    const socket = new WebSocket(socketUrl)

    socket.addEventListener('open', () => {
      if (attach_req){
        const attachAddon = new AttachAddon(socket)
        term.loadAddon(attachAddon)
        term.focus()
      }
    })


    // Controller object for this shell
    const controller = {
      term,
      socket,
      resizeObserver,

      attach(){
        if (socket.readyState === WebSocket.OPEN) {
          const attachAddon = new AttachAddon(socket)
          term.loadAddon(attachAddon)
        } else {
          attach_req = true;
        }
      },

      isOpen() {
        return socket.readyState === WebSocket.OPEN
      },

send(data) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(data)
    }
  },

sendLine(command) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(command + '\n')
    } 
  },


      toggle() {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close()
        } else {
          // simple reconnect, could also create a new WebSocket
          console.warn('Socket is closed — reload or reconnect manually')
        }
      },

      destroy() {
        socket.close()
        term.dispose()
        resizeObserver.disconnect()
      }
    }

    return controller
  }

  return {
    provide: {
      attachContainer
    }
  }
})
