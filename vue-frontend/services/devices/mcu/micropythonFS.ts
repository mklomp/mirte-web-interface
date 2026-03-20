export class MicroPythonFS {
  replResolver: (() => void) | null = null
  private buffer = ""

  constructor(private transport) {
    transport.onData((data: string) => this.parseData(data))
  }

  parseData(data: string) {

    this.buffer += data

    if (this.buffer.includes("__STOP__")) {
      this.buffer = this.buffer.replace("__STOP__", "")
      useState("programming-state").value = "idle"
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

  // TODO: could use the raw REPL?
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

  async writeLine(line: string){
    await this.transport.write(line + "\r\n")
    await this.waitForPrompt()
  }


 /* async readFile(path: string): Promise<string> {
    await this.enterRawREPL()

    await this.transport.write(`
with open('${path}') as f:
    print(f.read())
`)
    // You’ll need to capture output from transport
  }

  async deleteFile(path: string) {
    await this.enterRawREPL()

    await this.transport.write(`
import os
os.remove('${path}')
`)
  }

  async listFiles(): Promise<string[]> {
    await this.enterRawREPL()

    await this.transport.write(`
import os
print(os.listdir())
`)
  }
*/
}