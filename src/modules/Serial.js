/**
 * Web Serial API interface for device communication
 * Manages serial port connections, data transmission, and reception
 */
import { DEFAULT_SETTINGS } from '../constants.js'

export default class Serial {
  // Callback hooks for connection lifecycle and data events
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

    this.baudRate = DEFAULT_SETTINGS.baudRate

    // Buffer for accumulating data chunks before calling onReceive
    this.receiveBuffer = ''
    this.receiveTimeout = null

    // Serialize outbound writes to avoid writer lock errors and device overruns
    this._writeChain = Promise.resolve()
  }

  _sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  _enqueueWrite (fn) {
    this._writeChain = this._writeChain
      .then(fn)
      .catch((error) => {
        console.error('[SERIAL] Write failed:', error)
      })
    return this._writeChain
  }

  async _writeBytes (bytes, { chunkSize, chunkDelayMs } = {}) {
    const safeChunkSize = Number.isFinite(chunkSize) && chunkSize > 0 ? chunkSize : 64
    const safeChunkDelayMs = Number.isFinite(chunkDelayMs) && chunkDelayMs >= 0 ? chunkDelayMs : 2

    const writer = this.outputStream.getWriter()
    try {
      for (let offset = 0; offset < bytes.length; offset += safeChunkSize) {
        const chunk = bytes.subarray(offset, Math.min(offset + safeChunkSize, bytes.length))
        await writer.write(chunk)
        if (safeChunkDelayMs > 0 && offset + safeChunkSize < bytes.length) {
          await this._sleep(safeChunkDelayMs)
        }
      }
    } finally {
      writer.releaseLock()
    }
  }

  /**
   * Check if browser supports Web Serial API
   * @returns {boolean} True if Web Serial API is supported
   */
  supported () {
    return ('serial' in navigator)
  }

  /**
   * Request user to select a serial port
   * @returns {Promise<string>} Empty string on success, error message on failure
   */
  async requestPort () {
    await this.close()

    const filters = [
      // No filters applied - user can select any available port
    ]

    try {
      this.port = await navigator.serial.requestPort({ filters })
    } catch (e) {
      console.error('[SERIAL] Port selection failed:', e)
      return `Port selection failed: ${e.message || e}`
    }

    return this.openPort()
  }

  /**
   * Open the selected serial port with configured baud rate
   * @returns {Promise<string>} Empty string on success, error message on failure
   */
  async openPort () {
    if (!this.port) {
      const error = 'No port selected'
      console.error('[SERIAL]', error)
      return error
    }

    try {
      await this.port.open({ baudRate: this.baudRate })
    } catch (e) {
      console.error('[SERIAL] Failed to open port:', e)
      this.onFail()
      return `Failed to open port: ${e.message || e}`
    }

    console.log('[SERIAL] Connected at', this.baudRate, 'baud')

    this.port.addEventListener('disconnect', () => {
      console.warn('[SERIAL] Device disconnected')
      this.onFail()
    })

    this.outputStream = this.port.writable
    this.inputStream = this.port.readable

    this.onSuccess()
    this.open = true

    this.read()

    return ''
  }

  /**
   * Add data to receive buffer and schedule delivery
   * @param {string} data - Data to buffer
   * @private
   */
  _bufferReceive (data) {
    this.receiveBuffer += data

    // Clear existing timeout
    if (this.receiveTimeout) {
      clearTimeout(this.receiveTimeout)
    }

    // Schedule delivery after a delay to batch chunks
    // Use a longer timeout to allow more data to accumulate
    this.receiveTimeout = setTimeout(() => {
      if (this.receiveBuffer.length > 0) {
        this.onReceive(this.receiveBuffer)
        this.receiveBuffer = ''
      }
      this.receiveTimeout = null
    }, 50)
  }

  /**
   * Continuously read data from the serial port
   * Automatically handles reconnection and cleanup
   */
  async read () {
    this.textDecoder = new window.TextDecoderStream()
    this.readableStreamClosed = this.port.readable.pipeTo(this.textDecoder.writable)
    this.reader = this.textDecoder.readable.getReader()

    try {
      while (this.open) {
        const { value, done } = await this.reader.read()
        if (done) {
          console.log('[SERIAL] Read stream completed')
          break
        }
        // Buffer the data instead of calling onReceive directly
        if (value && value.length > 0) {
          this._bufferReceive(value)
        }
      }
    } catch (error) {
      console.error('[SERIAL] Read error:', error)
      this.onFail()
    } finally {
      // Flush any remaining buffered data
      if (this.receiveBuffer.length > 0) {
        this.onReceive(this.receiveBuffer)
        this.receiveBuffer = ''
      }
      if (this.receiveTimeout) {
        clearTimeout(this.receiveTimeout)
        this.receiveTimeout = null
      }

      try {
        await this.reader.cancel()
      } catch (error) {
        console.warn('[SERIAL] Reader cancel error (ignored):', error)
      }
      try {
        await this.readableStreamClosed
      } catch (error) {
        console.warn('[SERIAL] Stream close error (ignored):', error)
      }
      this.open = false
    }
  }

  /**
   * Send a text string to the serial port
   * @param {string} value - Text to send
   */
  async send (value) {
    if (!this.open || !this.outputStream) {
      console.error('[SERIAL] Cannot send: port not open')
      return
    }

    const preview = typeof value === 'string' && value.length > 200 ? `${value.slice(0, 200)}…` : value
    console.log(`[SERIAL] Send (${value?.length ?? 0} chars): ${preview}`)

    const encoder = new TextEncoder()
    const bytes = encoder.encode(value)

    // Pace large payloads to avoid overflowing small device RX buffers.
    // Small payloads still go through the same path (single chunk).
    let chunkSize = bytes.length
    let chunkDelayMs = 0

    if (bytes.length > 256) {
      chunkSize = 64
      chunkDelayMs = 2
    }
    if (bytes.length > 1024) {
      chunkSize = 32
      chunkDelayMs = 5
    }
    if (bytes.length > 2048) {
      chunkSize = 16
      chunkDelayMs = 8
    }

    await this._enqueueWrite(() => this._writeBytes(bytes, { chunkSize, chunkDelayMs }))
  }

  /**
   * Send a single byte to the serial port
   * @param {number} value - Byte value (0-255) to send
   */
  async sendByte (value) {
    if (!this.open || !this.outputStream) {
      console.error('[SERIAL] Cannot send byte: port not open')
      return
    }

    const data = new Uint8Array([value])
    await this._enqueueWrite(async () => {
      await this._writeBytes(data, { chunkSize: 1, chunkDelayMs: 0 })
      console.log(`[SERIAL] Sent byte: 0x${value.toString(16).padStart(2, '0')}`)
    })
  }

  /**
   * Close the serial port and clean up resources
   */
  async close () {
    if (this.open) {
      this.open = false

      try {
        if (this.reader) {
          await this.reader.cancel()
        }
      } catch (error) {
        console.warn('[SERIAL] Reader cancel error (ignored):', error)
      }

      try {
        if (this.readableStreamClosed) {
          await this.readableStreamClosed
        }
      } catch (error) {
        console.warn('[SERIAL] Stream close error (ignored):', error)
      }

      try {
        if (this.port) {
          await this.port.close()
        }
      } catch (error) {
        console.error('[SERIAL] Port close error:', error)
      }

      console.log('[SERIAL] Connection closed')
    }
  }

  /**
   * Set the baud rate for future connections
   * Note: Requires reconnection to take effect
   * @param {number} newBaudRate - New baud rate value
   */
  setBaudRate (newBaudRate) {
    this.baudRate = newBaudRate
    console.log('[SERIAL] Baud rate set to', newBaudRate, '(requires reconnect)')
  }
}
