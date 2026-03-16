import { AttachAddon } from '@xterm/addon-attach'

export function useXTermUSBConnection(term) {

  function connect2() {
    let attach_req = false;
    const socketUrl = `ws://192.168.43.1/ws/shell`
    const socket = new WebSocket(socketUrl)

    socket.addEventListener('open', () => {
      console.log("websocket connected to terminal")
      if (attach_req) {
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

      attach() {
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


  function connect() {

  }

  function disconnect() {

  }

  return {
    connect,
    disconnect
  }
}
