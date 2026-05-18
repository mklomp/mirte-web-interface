export class MicroPythonFS {
  replResolver: (() => void) | null = null
  private buffer = ""

  private captureResolver: ((data: string) => void) | null = null
  private captureBuffer = ""
  private capturing = false

  constructor(private transport) {
    transport.onData((data: string) => this.parseData(data))
  }

  // We get the REPL data, which should be parsed on:
  //
  // ">>> ": detecting whether a new command can be sent
  // "__BEGIN__": detecting when file-data is being sent
  // "__END__": detecting when file-data ended
  parseData(data: string) {
    this.buffer += data

    if (this.buffer.includes("__BEGIN__\r\n")) {
      this.capturing = true
      this.captureBuffer = ""
      this.captureBuffer = this.buffer.split("__BEGIN__\r\n")[1]
    }

    // TODO: gaat dit goed? hij heeft hem hier net op true gezet
    if (this.capturing) {
      this.captureBuffer += data
    }

    if (this.captureBuffer.includes("__END__\r\n")) {
      const result = this.captureBuffer.split("__END__\r\n")[0]

      this.capturing = false

      if (this.captureResolver) {
        this.captureResolver(result)
        this.captureResolver = null
      }

      this.captureBuffer = ""
    }

    if (this.buffer.includes(">>> ")) {
      if (this.replResolver) {
        this.replResolver()
        this.replResolver = null
      }
      this.buffer = ""
    }
  }

  async waitForPrompt() {
    return new Promise<void>((resolve) => {
      this.replResolver = resolve
    })
  }

  async readFile(path: string): Promise<string> {
    return new Promise(async (resolve) => {
      this.captureResolver = resolve
      this.capturing = false

      // Needs to be one line, in order to correctly capture the __BEGIN__ (TODO: is this true?)
      await this.writeLine(`import sys; f = open('${path}'); print('__BEGIN__'); _ = sys.stdout.write(f.read()); print('__END__'); f.close()`)
    })
  }
  
  async writeFile(path: string, content: string) {
    const cleaned = content.replace(/\r/g, '')

    await this.writeLine(`f = open('${path}', 'w')`)
    for (const line of cleaned.split("\n")) {
      const escaped = line.replace(/"/g, '\\"')
      await this.writeLine(`f.write("${escaped}\\n")`)
    }
    await this.writeLine(`f.close()`)
  }

  async mkdir(path: string) {
    await this.writeLine(`import os`)
    await this.writeLine(`os.mkdir("${path}") if "${path}" not in os.listdir() else None`)
  }

  async writeLine(line: string) {
    const promptPromise = this.waitForPrompt()
    await this.transport.write(line + "\r\n")
    await promptPromise
  }
}