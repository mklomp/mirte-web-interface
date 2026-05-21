//https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API
//https://developer.chrome.com/docs/capabilities/serial

import { useToast } from '~/composables/useToast'

export class SerialTransport {
  port: SerialPort | null = null
  reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  writer: WritableStreamDefaultWriter<Uint8Array> | null = null

  private encoder = new TextEncoder()

  listeners: ((data: string) => void)[] = []

  private disconnectHandler: (() => void) | null = null

  async connect(autoconnect = false) {
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()
    
    const filters = [
      { usbVendorId: 0x2E8A, usbProductId: 0x0005 }  // Raspberry Pi Pico 2040
    ];

    const ports = await navigator.serial.getPorts()
    let ableToAutoConnect = false

    if (ports.length > 0) {
      this.port = ports[0]
      await this.port.open({ baudRate: 115200 })
      ableToAutoConnect = Object.keys(this.port.getInfo()).length != 0

      if (autoconnect && !ableToAutoConnect) {
        addToast($i18n.t('toast.usb_unable_connect_known_connection'), 'info')
        this.runDisconnect()
        return {connected: false}
      }
    }

    if (!ableToAutoConnect) {
      try {
        this.port = await navigator.serial.requestPort({ filters })
      } catch (error) {
        addToast($i18n.t('toast.usb_no_device_selected'), 'error')
        this.runDisconnect()
        return {connected: false}
      }

      try {
        await this.port.open({ baudRate: 115200 })
      } catch (error) {
        addToast($i18n.t('toast.usb_unable_to_open_device'), 'error')
        this.runDisconnect()
        return {connected: false}
      }
    }
    addToast($i18n.t('toast.usb_connecting'), 'info', 'connection-status')

    // Nicely disconnect when a USB cable was unplugged
    this.disconnectHandler = () => {
      this.runDisconnect()
      addToast($i18n.t('toast.usb_disconnected'), 'info', 'connection-status')
    }

    this.port.addEventListener("disconnect", this.disconnectHandler)

    this.reader = this.port.readable.getReader()
    this.writer = this.port.writable.getWriter()

    let autoConnected = (ableToAutoConnect && !autoconnect)
    this.startReaderLoop()
    return {connected: true, autoConnected: autoConnected}
  }

  async write(data: string) {
    if (!this.writer) throw new Error("Not connected")
    await this.writer.write(this.encoder.encode(data))
  }

  async startReaderLoop() {
    if (!this.reader) return

    const decoder = new TextDecoder()

    try {
      while (true) {
        const { value, done } = await this.reader.read()
        if (done) break

        if (value) {
          const text = decoder.decode(value)
          for (const cb of this.listeners) {
            cb(text)
          }
        }
      }
    } catch (err) {
      console.log("Reader stopped")
    }
  }

  onData(callback: (data: string) => void) {
    this.listeners.push(callback)
  }

  async disconnect(connectionLost = false) {
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()
    this.runDisconnect()
    addToast($i18n.t('toast.usb_disconnected_success'), 'success', 'connection-status')
  }

  async runDisconnect() {
    const connectionStore = useConnectionStore()

    if (this.port && this.disconnectHandler) {
      this.port.removeEventListener("disconnect", this.disconnectHandler)
    }

    try {
      // Cancel reader
      if (this.reader) {
        await this.reader.cancel()
        this.reader.releaseLock()
      }

      // Close writer
      if (this.writer) {
        await this.writer.close()
        this.writer.releaseLock()
      }

      // Close port
      if (this.port) {
        await this.port.close()
      }

    } catch (err) {
      console.warn("Disconnect error:", err)
    }

    // Cleanup state
    this.port = null
    this.reader = null
    this.writer = null
    this.listeners = []

    useState("peripheral-settings").value = {}
    connectionStore.setConnectionStatus("disconnected")
  }
}