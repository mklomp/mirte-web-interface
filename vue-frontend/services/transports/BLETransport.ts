// Web Bluetooth transport using Nordic UART Service (NUS)

import { useToast } from '~/composables/useToast'

const BLE_NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
const BLE_NUS_RX_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
const BLE_NUS_TX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'

const MTU = 20

export class BLETransport {
  device: BluetoothDevice | null = null
  server: BluetoothRemoteGATTServer | null = null
  service: BluetoothRemoteGATTService | null = null

  rxCharacteristic: BluetoothRemoteGATTCharacteristic | null = null
  txCharacteristic: BluetoothRemoteGATTCharacteristic | null = null

  listeners: ((data: string) => void)[] = []

  private disconnectHandler: ((event: Event) => void) | null = null

  async connect(autoconnect = false) {
    const { addToast } = useToast()
    const connectionStore = useConnectionStore()


    if (!navigator.bluetooth) {
      addToast('Web Bluetooth is not supported in this browser.', 'error')
      return { connected: false }
    }

    try {
      this.device = await navigator.bluetooth.requestDevice({
        //acceptAllDevices: true,
        filters: [
          {
            namePrefix: 'MIRTE-'
          }
        ],
        optionalServices: [BLE_NUS_SERVICE_UUID]
      })

      if (!this.device.gatt) {
        addToast('Bluetooth GATT not available.', 'error')
        return { connected: false }
      }

      if (!this.device.gatt.connected) {
        addToast('Connecting to Bluetooth.....', 'info', 'connection-status')
      }
      this.server = await this.device.gatt.connect()

      this.service = await this.server.getPrimaryService(
        BLE_NUS_SERVICE_UUID
      )

      this.rxCharacteristic = await this.service.getCharacteristic(
        BLE_NUS_RX_UUID
      )

      this.txCharacteristic = await this.service.getCharacteristic(
        BLE_NUS_TX_UUID
      )

      // Notifications
      await this.txCharacteristic.startNotifications()

      this.txCharacteristic.addEventListener(
        'characteristicvaluechanged',
        this.handleNotifications
      )

      // Disconnect handling
      this.disconnectHandler = () => {
        this.runDisconnect()
        addToast('Disconnected.', 'info', 'connection-status')
      }

      this.device.addEventListener(
        'gattserverdisconnected',
        this.disconnectHandler
      )

      return { connected: true, autoConnected: false }
    } catch (error) {
      console.error(error)

      addToast(
        'Unable to connect to Bluetooth device.',
        'error'
      )

      this.runDisconnect()

      return { connected: false }
    }
  }

  async write(data: string) {
    if (!this.rxCharacteristic) {
      throw new Error('Not connected')
    }

    const encoder = new TextEncoder()
    const encoded = encoder.encode(data)

    await this.sendChunks(encoded)
  }

  private async sendChunks(data: Uint8Array) {
    if (!this.rxCharacteristic) return

    for (let i = 0; i < data.length; i += MTU) {
      const chunk = data.slice(i, i + MTU)

      await this.rxCharacteristic.writeValue(chunk)

      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }

  private handleNotifications = (
    event: Event
  ) => {
    const target =
      event.target as BluetoothRemoteGATTCharacteristic

    if (!target.value) return

    const decoder = new TextDecoder()

    const text = decoder.decode(target.value.buffer)

    for (const cb of this.listeners) {
      cb(text)
    }
  }

  onData(callback: (data: string) => void) {
    this.listeners.push(callback)
  }

  async disconnect(connectionLost = false) {
    const { addToast } = useToast()
    const connectionStore = useConnectionStore()

    if (connectionLost) {
      addToast('Bluetooth connection lost.', 'error', 'connection-status')
      connectionStore.setConnectionStatus('disconnected')
    }
    await this.runDisconnect()
    if (!connectionLost) {
      addToast('Successfully disconnected.', 'success', 'connection-status')
    }
  }

  async runDisconnect() {
    const connectionStore = useConnectionStore()

    try {
      // Stop notifications
      if (this.txCharacteristic) {
        this.txCharacteristic.removeEventListener(
          'characteristicvaluechanged',
          this.handleNotifications
        )

        try {
          await this.txCharacteristic.stopNotifications()
        } catch {
          // Ignore
        }
      }

      // Remove disconnect listener
      if (this.device && this.disconnectHandler) {
        this.device.removeEventListener(
          'gattserverdisconnected',
          this.disconnectHandler
        )
      }

      // Disconnect
      if (this.device?.gatt?.connected) {
        this.device.gatt.disconnect()
      }
    } catch (err) {
      console.warn('Disconnect error:', err)
    }

    // Cleanup
    this.device = null
    this.server = null
    this.service = null
    this.rxCharacteristic = null
    this.txCharacteristic = null
    this.listeners = []

    connectionStore.setConnectionStatus('disconnected')
  }
}