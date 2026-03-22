import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

export function useXTermBase(debug = false) {

  let resizeObserver: ResizeObserver
  const fitAddon = new FitAddon()
  const term = new Terminal()
  term.options.theme = { background: '#fefaf7', foreground: '#000000', cursor: '#000000' }
  term.loadAddon(fitAddon)

  function attachContainer(container) {
    term.open(container)
    fitAddon.fit()
    resizeObserver = new ResizeObserver(() => fitAddon.fit())
    resizeObserver.observe(container)
    return term
  }

  function toggleDebug() {
    //TODO: toggle the input option and visibility of the terminal
  }

  return {
    term,
    attachContainer,
    toggleDebug
  }
}
