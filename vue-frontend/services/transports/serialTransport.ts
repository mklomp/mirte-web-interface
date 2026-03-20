//https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API
//https://developer.chrome.com/docs/capabilities/serial

export class SerialTransport {
  port: SerialPort | null = null
  reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  writer: WritableStreamDefaultWriter<Uint8Array> | null = null

  readableStreamClosed: null
  writableStreamClosed: null

  listeners: ((data: string) => void)[] = []

  async connect(autoconnect = false) {

    const connectionState = useState("connection-state")
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
    connectionState.value = "connecting"
    await this.port.open({ baudRate: 115200 })

    this.port.addEventListener("disconnect", () => {
      this.disconnect()
    })

    const encoderStream = new TextEncoderStream()
    const decoderStream = new TextDecoderStream()

    this.writableStreamClosed = encoderStream.readable.pipeTo(this.port.writable)
    this.writer = encoderStream.writable?.getWriter() ?? null

    this.readableStreamClosed = this.port.readable.pipeTo(decoderStream.writable)
    this.reader = decoderStream.readable.getReader()

    console.log('connected')
    connectionState.value = "connected"
    this.startReaderLoop()
  }

  async write(data) {
    if (!this.writer) throw new Error("Not connected")
    await this.writer.write(data)
  }

  async startReaderLoop() {
    if (!this.reader) return

    try {
      while (true) {
        const { value, done } = await this.reader.read()
        if (done) break

        if (value) {
          for (const cb of this.listeners) {
            cb(value)
          }
        }
      }
    } catch (err) {
      // disconnect is already catched in event listener
    }
  }

  onData(callback: (data: string) => void) {
    this.listeners.push(callback)
  }

  async disconnect() {
    try {
      this.reader?.cancel()
      await this.readableStreamClosed
      this.writer?.close()
      await this.writableStreamClosed
      await this.port?.close()
    } catch (err) {
      // nop
    }


    this.port = null
    this.reader = null
    this.writer = null
    this.listeners = []
    useState("connection-state").value = "disconnected"
  }
}