<template>
  <div class="rounded background-tertiary p-3 mb-2" :key="cameraKey">
    <div class="h5">Camera</div>
    <img ref="camera" :src="`${cameraSrc}`" style="width: 100%; height: auto;" />
  </div>
</template>


<script>

import * as ROSLIB from 'roslib'

export default {
  name: 'camera',

  data() {
    return {
      cameraAvailable: false,
      cameraKey: 0,
      cameraSrc: null
    }
  },
  methods: {
    checkCameraAvailability() {
      const ros = useRos()

      ros.getTopics(
        (result) => {
          this.cameraAvailable = result.topics.includes(
            "/video1/image_raw/compressed"
          )
        },
        (error) => {
          console.error("Failed to get ROS topics:", error)
          this.cameraAvailable = false
        }
      )
    },
  },

  mounted() {
    const peripheralsStore = usePeripheralStore()
    const { peripherals: storePeripherals } = storeToRefs(peripheralsStore)

    const connectionStore = useConnectionStore()
    const { connection: storeConnection } = storeToRefs(connectionStore)

    watch(
      () => ({
        status: connectionStore.status,
        rosStatus: connectionStore.ros_status,
        peripherals: peripheralsStore.peripherals
      }),
      ({ status, rosStatus, peripherals }) => {
        if (status != "connected") {

          // For some reasone we need to set both this.cameraScr, and
          // via the ref. Otherwise the connection will stay and the 
          // streams keeps connected (with cpu usage on the robot)
          const img = this.$refs.camera
          if (img) { img.src = ""; }
          this.cameraSrc = ""
          return
        }
        const ip = connectionStore.ip_address
        this.cameraSrc = `http://${ip}/ros-video/stream?topic=/video1/image_raw&type=mjpeg`
        this.checkCameraAvailability()
      },
      {
        immediate: true,
        deep: true
      }
    )

  }
}
</script>