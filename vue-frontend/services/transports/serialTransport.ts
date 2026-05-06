//https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API
//https://developer.chrome.com/docs/capabilities/serial

export class SerialTransport {
  port: SerialPort | null = null
  reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  writer: WritableStreamDefaultWriter<Uint8Array> | null = null

  private encoder = new TextEncoder()
  
  listeners: ((data: string) => void)[] = []

  async connect(autoconnect = false) {
    const connectionStore = useConnectionStore()

    const filters = [
      { usbVendorId: 0x2E8A, usbProductId: 0x0005 }  // Raspberry Pi Pico 2040
    ];

    if (autoconnect) {
      const ports = await navigator.serial.getPorts()
      if (ports.length > 0) {
        this.port = ports[0]
      }
    } else {
      this.port = await navigator.serial.requestPort({ filters })
    }
    connectionStore.setConnectionStatus("connecting")
    await this.port.open({ baudRate: 115200 })

    this.port.addEventListener("disconnect", () => {
      this.disconnect()
    })

    this.reader = this.port.readable.getReader()
    this.writer = this.port.writable.getWriter()

    connectionStore.setConnectionStatus("connected")
    this.startReaderLoop()
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

  async disconnect() {
    const connectionStore = useConnectionStore()
    console.log("disconnecting")

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

    connectionStore.setConnectionStatus("disconnected")
  }
}