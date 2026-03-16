export function useXTermSerialConnection(term) {

  let port: SerialPort | null = null
  let writer: WritableStreamDefaultWriter<Uint8Array> | null = null
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

  const encoderStream = new TextEncoderStream()
  const decoderStream = new TextDecoderStream()

  let buffer = ""

  // resolver for waiting on >>> prompt
  let replResolver: (() => void) | null = null
  const programmingState = useState("programming-state");
  
  async function startReaderLoop() {

    try {
      while (true) {

        const { value, done } = await reader!.read()
        if (done) break

        if (value) {

          term.write(value)

          buffer += value

          while (buffer.includes("__STOP__")) {
            buffer = buffer.replace("__STOP__", "")
            programmingState.value = "idle"
          }

          if (buffer.includes(">>> ")) {
            buffer = ""

            if (replResolver) {
              replResolver()
              replResolver = null
            }
          }

        }
      }
    } catch (err) {
      console.log("serial closed")
    }

  }

  async function connect() {

    port = await navigator.serial.requestPort()
    await port.open({ baudRate: 115200 })

    port.addEventListener("disconnect", () => {
      console.log("disconnected")
    })

    writer = encoderStream.writable?.getWriter() ?? null
    encoderStream.readable.pipeTo(port.writable)

    term.onData(async (data) => {
      if (!writer) return
      await writer.write(data)
    })

    port.readable.pipeTo(decoderStream.writable)
    reader = decoderStream.readable?.getReader()

    // start background reader
    startReaderLoop()

    writer.write('\x04') // CTRL-D (soft reboot)
    await new Promise(resolve => setTimeout(resolve, 100))

    term.clear()

    writer.write('\x03') // CTRL-C (stop main)

    await waitForPrompt()

  }

  async function waitForPrompt() {

    return new Promise<void>((resolve) => {
      replResolver = resolve
    })

  }

  async function sendLine(line: string) {

    if (!writer) return

    await writer.write(line + "\r\n")

    await waitForPrompt()

  }

  function send(data: string) {
    writer?.write(data)
  }


  async function uploadFile(filename: string, pythonCode: string) {

    if (!writer) return

    const cleaned = pythonCode.replace(/\r/g, '')

    // open file
    await sendLine(`f = open("${filename}", "wb")`)

    for (const line of cleaned.split("\n")) {

      const escaped = line.replace(/"/g, '\\"')

      await sendLine(`f.write("${escaped}\\n")`)

    }

    // close file
    await sendLine("f.close()")

  }

  async function mkdir(name: string) {
    await sendLine(`import os`)
    await sendLine(`os.mkdir("${name}") if "${name}" not in os.listdir() else None`)

  }

  async function disconnect() {

    try {
      await reader?.cancel()
      reader?.releaseLock()
    } catch { }

    try {
      await writer?.close()
      writer?.releaseLock()
    } catch { }

    try { await port?.close() } catch { }

    port = null
    writer = null
    reader = null
  }

  return {
    connect,
    sendLine,
    send,
    disconnect,
    uploadFile,
    mkdir
  }
}