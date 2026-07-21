<template>

  <div class="layoutbox-content" :class="{ disabled: !isROSConnected }">

    <div>
      <Camera />
    </div>

    <div v-for="sensor_type in getSensorTypes()" class="rounded background-tertiary p-3 mb-2" :key="`${sensor_type}`">
      <div class="h5">{{ $t('peripherals.' + peripherals[sensor_type].text) }}</div>
      <div class="row">

        <div class="col-4">
          <img class="center-div w-75" :src="getSensorImage(sensor_type)">
        </div>

        <div class="col-8">

          <div v-for="instance in getInstances(sensor_type)" class="rounded background-sensor p-2 text-white mb-2 d-flex"
            style="white-space: pre;" :key="`${sensor_type}-${instance}`">
            <span>{{ instance }}:</span>
            <span class="ms-auto">{{ sensors[sensor_type][instance] }}</span>
          </div>

        </div>
      </div>
    </div>



  </div>

</template>

<script>

import properties_ph from "../assets/json/properties_ph.json"
import { usePeripheralStore } from '~/stores/peripherals'
import { storeToRefs } from 'pinia'
import { watch, reactive } from 'vue'
import * as ROSLIB from 'roslib'

export default {
  name: 'sensors',

  data() {
    return {
      peripherals: properties_ph,
      sensors: reactive({}),
      topics: []
    }
  },

  computed: {
    isROSConnected() {
      return useConnectionStore().ros_status === 'connected'
    },

    isConnected() {
      return useConnectionStore().status === 'connected'
    }
  },

  methods: {
    getSensorTypes() {
      return Object.keys(this.sensors)
    },

    getInstances(sensor_type) {
      return Object.keys(this.sensors[sensor_type])
    },
    getSensorImage(type) {
      const images = import.meta.glob('../assets/images/*.jpg', { eager: true })
      const key = Object.keys(images).find(k => k.endsWith(type + ".jpg"))
      return key ? images[key].default : null
    },
    reloadPeripherals(newVal) {
      let ros = useRos()
      this.cameraKey++ // refresh the camera element

      this.topics.forEach(topic => topic.unsubscribe())
      this.topics = []

      this.sensors = {}

      for (const [sensor_type, peripheral] of Object.entries(newVal)) {
        if (sensor_type == "device" || properties_ph[sensor_type].rel_path.split("\\")[0] != "Sensors") { continue }

        for (const instance in peripheral) {
          this.sensors[sensor_type] ??= {};
          this.sensors[sensor_type][instance] = -1;

          let full_instance = instance
          if (sensor_type === "color") full_instance += "/hsl"
          if (sensor_type === "line") full_instance += "/analog"

          const topic = new ROSLIB.Topic({
            ros: ros,
            name: `/io/${sensor_type}/${full_instance}`,
            messageType: this.peripherals[sensor_type].message_type
          })

          this.topics.push(topic)

          topic.subscribe((message) => {
            let value = message[this.peripherals[sensor_type].message_value]
            if (value === null) value = "inf"
            let string = ""

            if (typeof value === "object") {
              string += "\n"
              for (const [k, v] of Object.entries(value)) {
                let val = v
                if (typeof v === "number" && !Number.isInteger(v)) val = v.toFixed(4)
                string += "\t" + k + ": " + val + "\n"
              }
            } else {
              if (typeof value === "number" && !Number.isInteger(value)) {
                if (sensor_type === "distance") {
                  string = value.toFixed(2)
                } else {
                  string = value.toFixed(4)
                }
              } else {
                string = value
              }
            }

            this.sensors[sensor_type][instance] = string
          })
        }
      }
    }
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
          return
        }
        this.reloadPeripherals(peripherals)
      },
      {
        immediate: true,
        deep: true
      }
    )

  },

  beforeUnmount() {
    this.topics.forEach(topic => topic.unsubscribe())
  }
}
</script>

<style scoped>
.disabled {
  pointer-events: none;
  opacity: 0.5;
  filter: grayscale(100%);
}
</style>