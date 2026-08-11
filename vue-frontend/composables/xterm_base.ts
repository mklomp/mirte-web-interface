export function useXTermBase() {
  let term: any = null
  let fitAddon: any = null
  let resizeObserver: ResizeObserver | null = null

  async function init() {
    // 🔹 dynamic import (client only)
    const { Terminal } = await import('@xterm/xterm')
    const { FitAddon } = await import('@xterm/addon-fit')
    await import('@xterm/xterm/css/xterm.css')

    fitAddon = new FitAddon()
    term = new Terminal()

    term.options.theme = {
      background: '#fefaf7',
      foreground: '#000000',
      //cursor: '#000000',
    }

    term.loadAddon(fitAddon)

    return term
  }

  function attachContainer(container: HTMLElement) {
    if (!term) return

    term.open(container)
    fitAddon.fit()

    resizeObserver = new ResizeObserver(() => fitAddon.fit())
    resizeObserver.observe(container)
  }

  function dispose() {
    resizeObserver?.disconnect()
    term?.dispose()
    term = null
  }

  return {
    init,
    attachContainer,
    dispose,
    get term() {
      return term
    },
  }
}