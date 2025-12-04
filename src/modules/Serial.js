export default class Serial {
  onSuccess = () => { }
  onFail = () => { }
  onReceive = () => { }

  constructor () {
    this.open = false

    this.textDecoder = undefined
    this.readableStreamClosed = undefined
    this.reader = undefined

    this.port = undefined

    this.outputStream = undefined
    this.inputStream = undefined

    this.baudRate = 115200
  }

  supported () {
    return ('serial' in navigator)
  }

  async requestPort () {
    await this.close()

    const filters = [
      // No filters applied
    ]

    try {
      this.port = await navigator.serial.requestPort({ filters })
    } catch (e) {
      console.error(e)
      return `${e}`
    }

    return this.openPort()
  }

  async openPort () {
    try {
      await this.port.open({ baudRate: this.baudRate })
    } catch (e) {
      console.error(e)
      this.onFail()
      return `${e}`
    }

    console.log('[SERIAL] Connected')

    this.port.addEventListener('disconnect', () => {
      console.warn('[SERIAL] Disconnected!')
      this.onFail()
    })

    this.outputStream = this.port.writable
    this.inputStream = this.port.readable

    this.onSuccess()
    this.open = true

    this.read()

    return ''
  }

  async read () {
    while (this.port.readable && this.open) {
      this.textDecoder = new window.TextDecoderStream()
      this.readableStreamClosed = this.port.readable.pipeTo(this.textDecoder.writable)
      this.reader = this.textDecoder.readable.getReader()

      try {
        while (true && this.open) {
          const { value, done } = await this.reader.read()
          if (done) {
            break
          }
          if (value) this.onReceive(value)
        }
      } catch (error) {
        this.onFail()
      } finally {
        await this.close()
      }
    }
  }

  async send (value) {
    console.log(`Send: ${value}`)

    const encoder = new TextEncoder()
    const writer = this.outputStream.getWriter()

    writer.write(encoder.encode(value))
    writer.releaseLock()
  }

  async sendByte (value) {
    const writer = this.outputStream.getWriter()

    const data = new Uint8Array([value])
    await writer.write(data)

    writer.releaseLock()
  }

  async close () {
    if (this.open) {
      this.open = false

      await this.reader.cancel().catch(() => { /* Ignore the error */ })
      await this.readableStreamClosed.catch(() => { /* Ignore the error */ })

      await this.port.close()

      console.log('[SERIAL] Closed')
    }
  }

  setBaudRate (newBaudRate) {
    this.baudRate = newBaudRate
  }
}
