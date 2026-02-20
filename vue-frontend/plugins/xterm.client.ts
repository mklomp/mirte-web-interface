import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { AttachAddon } from '@xterm/addon-attach'
import { FitAddon } from '@xterm/addon-fit'

export default defineNuxtPlugin(() => {
  // WebSocket URL
  //const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://'
  //const shell_socketUrl = `${protocol}${location.hostname}/ws/shell`
  const shell_socketUrl = `ws://192.168.0.16/ws/shell`
  const shellSocket = new WebSocket(shell_socketUrl)

  // Optional helper to attach Xterm
  function attachToTerminal(container) {
    const term = new Terminal()
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)

    term.open(container)
    fitAddon.fit()

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit()
    })

    resizeObserver.observe(container)

    const attachAddon = new AttachAddon(shellSocket)
    term.loadAddon(attachAddon)

    return term
  }

  return {
    provide: {
      shellSocket,     // just the raw WebSocket
      attachShell: attachToTerminal  // helper to attach to Xterm
    }
  }
})
