import { useToast } from '~/composables/useToast'
import { useConnectionStore } from '../../stores/connection'

export class NetworkTransport {
  hostname: string = ''

  private listeners: Array<(data: string) => void> = []
  private disconnectHandler: (() => void) | null = null

  ros: ROSLIB.Ros = useRos()
  socket: WebSocket | null = null

  restartingRos = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  connect(autoconnect = false) {
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()

    const connectionStore = useConnectionStore()
    this.hostname = connectionStore.hostname

    // ROS connection
    // TODO: in order fot this to work, we need to empty /etc/nginx/nginx_logon.conf
    // otherwise yo will get an error. 
    this.ros.connect(`ws://${this.hostname}/ws/ros`)

    this.connectTerminal()

    this.ros.on('connection', () => {
      connectionStore.ros_status = "connected"
      if (this.restartingRos) {
        this.socket = new WebSocket(`ws://${this.hostname}/ws/shell`)
        addToast($i18n.t('toast.ros_restarted'), 'success', 'ros-restarting')
        this.restartingRos = false
      }

    })

    this.ros.on('error', (error) => {
      console.error('ROS error:', error)
    })

    this.ros.on('close', () => {
      this.socket?.close()
      connectionStore.ros_status = "disconnected"
      if (this.restartingRos) {
        this.tryReconnectRos()
        return
      }

      if (connectionStore.status === 'connected') {
        addToast($i18n.t('toast.ros_disconnected'), 'error', 'connection-lost')
        //this.disconnect()
      }
    })

    return this.socket
  }

  getTermSocket() {
    return this.socket
  }

  connectTerminal() {
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()
    // Shell connection
    this.socket = new WebSocket(`ws://${this.hostname}/ws/shell`)
    const connectionStore = useConnectionStore()

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
      if (connectionStore.status == "connected" && !this.restartRos) {
        addToast($i18n.t('toast.websocket_lost'), "error", "connection-lost")
      }
    }
  }

  restartRos() {
    const { addToast } = useToast()
    const { $i18n } = useNuxtApp()

    this.socket?.close() // closed socket will make sure that mirte_python_api node is stopped
    this.restartingRos = true

    addToast($i18n.t('toast.restarting_ros'), 'info', 'ros-restarting', -1)
  }


  private tryReconnectRos() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    this.reconnectTimer = setTimeout(() => {
      //console.log('Trying ROS reconnect...')

      try {
        this.ros.connect(`ws://${this.hostname}/ws/ros`)
      }
      catch (err) {
        //console.error(err)
        this.tryReconnectRos()
      }
    }, 2000)
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
