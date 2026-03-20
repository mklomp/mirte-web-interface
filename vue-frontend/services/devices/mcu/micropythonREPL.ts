export class MicroPythonREPL {
  private buffer = ""
  private onDataCallback = null

  constructor(private transport) {}

  // --- MODE CONTROL ---

  async enterRawMode() {
    await this.transport.write("\x03") // Ctrl-C (stop)
    await this.transport.write("\x03") // extra safety
    await this.transport.write("\x01") // Ctrl-A (raw mode)
    await this.waitFor("raw REPL")
  }

  async exitRawMode() {
    await this.transport.write("\x02") // Ctrl-B
  }

  // --- CORE EXECUTION ---

  async exec(code: string): Promise<string> {
    this.buffer = ""

    await this.enterRawMode()

    await this.transport.write(code)
    await this.transport.write("\x04") // Ctrl-D → execute

    const output = await this.waitFor("\x04>") // end marker

    return this.cleanOutput(output)
  }

  // --- HELPERS ---

  waitFor(marker: string, timeout = 2000): Promise<string> {
    return new Promise((resolve, reject) => {
      const start = Date.now()

      const check = () => {
        if (this.buffer.includes(marker)) {
          resolve(this.buffer)
        } else if (Date.now() - start > timeout) {
          reject("Timeout waiting for: " + marker)
        } else {
          setTimeout(check, 10)
        }
      }

      check()
    })
  }

  cleanOutput(raw: string): string {
    // strip control chars, prompts etc.
    return raw
      .replace(/\x04/g, "")
      .replace(/>>>/g, "")
      .trim()
  }
}