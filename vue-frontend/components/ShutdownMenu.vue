<script setup>
const visible = defineModel('visible')

import { useI18n } from 'vue-i18n'
import { computed } from "vue"
const { addToast } = useToast()
const { $i18n } = useNuxtApp()

const connectionStore = useConnectionStore()
const { connect, disconnect } = useConnection()

const isConnected = computed(() => connectionStore.status == "connected")
const deviceType = computed(() => connectionStore.device)

const { t } = useI18n()

const mounted = ref(false)
const connectedText = computed(() =>
  isConnected.value && (deviceType.value == "mcu" || useState("programming-state").value == "idle")
    ? "connected"
    : "disconnected"
);
let socket = null

watch(
  connectionStore,
  (val) => {
    if (val.status == "connected" && val.device == "sbc" && val.hostname != "") {
      socket = new WebSocket(`ws://${val.hostname}/ws/shell`)
    }
  }
)

onMounted(() => {
  mounted.value = true
})

function shutdown() {
  if (confirm(t('main.shutdown_confirm'))) {
    socket.send("sudo shutdown now\n")
    addToast($i18n.t('toast.shutting_down'), "success")
    connectionStore.setConnectionStatus("disconnected")
  }
}

function reboot() {
  if (confirm(t('main.reboot_confirm'))) {
    socket.send("sudo reboot now\n")
    addToast($i18n.t('toast.rebooting_robot'), "success")
    connectionStore.setConnectionStatus("disconnected")
  }
}

</script>

<template> 
  <a class="nav-link dropdown-toggle" href="#" id="localeDropdown" role="button" data-bs-toggle="dropdown"
    aria-expanded="false">
    <ClientOnly>
      {{ $t("main.connection." + connectedText) }}
    </ClientOnly>
  </a>

  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="localeDropdown">
    <li v-if="deviceType == 'mcu'">
      <button class="dropdown-item" @click="connect('mcu', 'serial'); visible = false;" :disabled="mounted && isConnected">
        USB <ClientOnly>
          <FontAwesomeIcon v-if="isConnected && deviceType == 'mcu'" icon="check" />
        </ClientOnly>
      </button>

    </li>
    <!--  <li>
      <button class="dropdown-item" @click="connect('mcu', 'ble')" :disabled="mounted && isConnected">
        Bluetooth <ClientOnly>
          <FontAwesomeIcon v-if="isConnected && connectionTransport == 'ble'" icon="check" />
        </ClientOnly>
      </button>
    </li> -->


    <li v-if="deviceType == 'sbc'">
      <button class="dropdown-item" @click="connect('sbc', 'network'); visible = false;" :disabled="mounted && isConnected">
        WiFi/ {{ $t("main.connection.network") }}<ClientOnly>
          <FontAwesomeIcon v-if="isConnected && deviceType == 'sbc'" icon="check" />
        </ClientOnly>
      </button>
    </li>

    <ClientOnly>
      <li v-if="deviceType == 'sbc'">
        <hr class="dropdown-divider">
      </li>

      <li v-if="deviceType == 'sbc'">
        <button class="dropdown-item" @click="shutdown(); visible = false;"  :disabled="mounted && !isConnected">
          {{ $t("main.connection.shutdown") }}
        </button>
      </li>

      <li v-if="deviceType == 'sbc'">
        <button class="dropdown-item" @click="reboot(); visible = false;" :disabled="mounted && !isConnected">
          {{ $t("main.connection.reboot") }}
        </button>
      </li>
    </ClientOnly>
    
    <li v-if="deviceType == 'mcu'">
      <hr class="dropdown-divider">
    </li>

    <li v-if="deviceType == 'mcu'">
      <button class="dropdown-item" @click="disconnect(); visible = false;" :disabled="mounted && !isConnected">
        {{ $t("main.connection.disconnect") }}
      </button>
    </li>



  </ul>
</template>