import { useToast } from '~/composables/useToast'
import { useConnectionStore } from '../../stores/connection'

export class NetworkTransport {
  ip: string = '192.168.0.24'

  //socket: WebSocket | null = null

  private listeners: Array<(data: string) => void> = []
  private disconnectHandler: (() => void) | null = null

  ros: ROSLIB.Ros = useRos()
  socket: WebSocket | null = null

  connect(autoconnect = false) {
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()

    // ROS connection
    // TODO: in order fot this to work, we need to empty /etc/nginx/nginx_logon.conf
    // otherwise yo will get an error. 
    this.ros.connect(`ws://${this.ip}/ws/ros`)

    // Shell connection
    this.socket = new WebSocket(`ws://${this.ip}/ws/shell`)
    const connectionStore = useConnectionStore()
    connectionStore.setConnectionIP(this.ip)

    /*
    this.socket.onopen = () => {
      //console.log('Shell connected')
    }*/

    this.socket.onmessage = (event) => {
      const data = event.data as string

      // Notify all subscribers
      this.listeners.forEach(listener => {
        try {
          listener(data)
        }
        catch (err) {
          console.error('Listener error:', err)
        }
      })
    }

    this.socket.onerror = (error) => {
      console.error('Shell error:', error)
    }

    this.socket.onclose = () => {
      //console.log('Shell disconnected')
      if (connectionStore.status == "connected") {
        addToast("WebSocket connection lost.", "error", "connection-lost")
      }
    }

    this.ros.on('connection', () => {
      //console.log('ROS connected')
    })

    this.ros.on('error', (error) => {
      console.error('ROS error:', error)
    })

    this.ros.on('close', () => {
      //console.log('ROS disconnected')
      if (connectionStore.status == "connected") {
        addToast("ROS disconnected.", "error", "connection-lost")
      }
    })
    return this.socket
  }

  async disconnect(connectionLost = false) {
    this.ros.close()
    this.ros.removeAllListeners()

    if (this.socket) {
      this.socket.close()
      this.socket = null
    }

    if (this.disconnectHandler) {
      this.disconnectHandler()
    }

    const connectionStore = useConnectionStore()
    connectionStore.setConnectionStatus('disconnected')
    this.listeners = []
  }

  async write(data: string) {
    if (
      this.socket &&
      this.socket.readyState === WebSocket.OPEN
    ) {
      this.socket.send(data)
    }
  }

  /**
   * Subscribe to shell output.
   * Returns an unsubscribe function.
   */
  onData(callback: (data: string) => void): () => void {
    this.listeners.push(callback)

    return () => {
      this.removeListener(callback)
    }
  }

  addListener(listener: (data: string) => void) {
    this.listeners.push(listener)
  }

  removeListener(listener: (data: string) => void) {
    this.listeners = this.listeners.filter(
      l => l !== listener
    )
  }
}