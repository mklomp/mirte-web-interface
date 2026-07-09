import { ConnectionManager } from "@/services/connectionManager"

const manager = new ConnectionManager()

export function useConnection() {

  async function connect(type: "mcu" | "sbc", transport: "serial" | "ble", autoconnect = false) {
    return await manager.connect(type, transport, autoconnect)
  }

  async function disconnect() {
    await manager.disconnect()
  }

  function attachTerminal(term, debug) {
    manager.attachTerminal(term, debug)
  }

  async function uploadSettings(content) {
    await manager.uploadSettings(content)
  }

  async function uploadFile(path: string, content) {
    await manager.uploadFile(path, content)
  }

  async function runCommand(cmd: string) {
    await manager.runCommand?.(cmd)
  }

  async function startCode() {
    await manager.startCode()
  }

  async function stopCode() {
    await manager.stopCode()
  }

  async function reinstallMIRTE() {
    await manager.reinstallMIRTE()
  }

  return {
    connect,
    disconnect,
    attachTerminal,
    uploadFile,
    runCommand,
    startCode,
    stopCode,
    reinstallMIRTE,
    uploadSettings
  }
}