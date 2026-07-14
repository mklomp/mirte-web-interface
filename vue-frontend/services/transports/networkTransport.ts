import { useToast } from '~/composables/useToast'
import { useConnectionStore } from '../../stores/connection'

export class NetworkTransport {
  ip: string = '192.168.1.151'

  //socket: WebSocket | null = null

  private listeners: Array<(data: string) => void> = []
  private disconnectHandler: (() => void) | null = null

  ros: ROSLIB.Ros = useRos()
  socket: WebSocket | null = null

  restartingRos = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

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
      connectionStore.ros_status = "connected"
      if (this.restartingRos){
        addToast('ROS Restarted', 'success', 'ros-restarting')
        this.restartingRos = false  
      }
      
    })

    this.ros.on('error', (error) => {
       console.error('ROS error:', error)
    })

    this.ros.on('close', () => {
      connectionStore.ros_status = "disconnected"
      if (this.restartingRos) {
        this.tryReconnectRos()
        return
      }

      if (connectionStore.status === 'connected') {
        addToast('ROS disconnected.', 'error', 'connection-lost')
        this.disconnect()
      }
    })

    return this.socket
  }


  restartRos() {
    const { addToast } = useToast()

    this.restartingRos = true

    addToast('Restarting ROS...', 'info', 'ros-restarting', -1)
  }


  private tryReconnectRos() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    this.reconnectTimer = setTimeout(() => {
      //console.log('Trying ROS reconnect...')

      try {
        this.ros.connect(`ws://${this.ip}/ws/ros`)
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