<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from "vue"
const { addToast } = useToast()
const { $i18n } = useNuxtApp()

const connectionStore = useConnectionStore()
const { connect, disconnect } = useConnection()

const isConnected = computed(() => connectionStore.status == "connected")
const connectionType = computed(() => connectionStore.transport)

const { t } = useI18n()

const mounted = ref(false)

let socket = null

watch(
  connectionStore,
  (val) => {
    if (val.status == "connected" && val.transport == "network" && val.ip_address != "") {
      socket = new WebSocket(`ws://${val.ip_address}/ws/shell`)
    }
  }
)

onMounted(() => {
  mounted.value = true
})

function shutdown() {
  if (confirm(t('main.shutdown_confirm'))) {
    socket.send("sudo shutdown now\n")
    addToast("Shutting down.", "success")
    connectionStore.setConnectionStatus("disconnected")
  }
}

function reboot() {
  if (confirm(t('main.reboot_confirm'))) {
    socket.send("sudo reboot now\n")
    addToast("Rebooting robot.", "success")
    connectionStore.setConnectionStatus("disconnected")
  }
}

</script>

<template>
  <a class="nav-link dropdown-toggle" href="#" id="localeDropdown" role="button" data-bs-toggle="dropdown"
    aria-expanded="false">
    <ClientOnly>
      {{ $t("main.connection." + connectionStore.status) }}
    </ClientOnly>
  </a>

  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="localeDropdown">
    <li>
      <button class="dropdown-item" @click="connect('mcu', 'serial')" :disabled="mounted && isConnected">
        USB <ClientOnly>
          <FontAwesomeIcon v-if="isConnected && connectionType == 'serial'" icon="check" />
        </ClientOnly>
      </button>

    </li>
    <!--  <li>
      <button class="dropdown-item" @click="connect('mcu', 'ble')" :disabled="mounted && isConnected">
        Bluetooth <ClientOnly>
          <FontAwesomeIcon v-if="isConnected && connectionType == 'ble'" icon="check" />
        </ClientOnly>
      </button>
    </li> -->


    <li>
      <button class="dropdown-item" @click="connect('sbc', 'network')" :disabled="mounted && isConnected">
        WiFi/Network <ClientOnly>
          <FontAwesomeIcon v-if="isConnected && connectionType == 'network'" icon="check" />
        </ClientOnly>
      </button>
    </li>

    <ClientOnly>
      <li v-if="connectionType == 'network'">
        <hr class="dropdown-divider">
      </li>

      <li v-if="connectionType == 'network'">
        <button class="dropdown-item" @click="shutdown" :disabled="mounted && !isConnected">
          {{ $t("main.connection.shutdown") }}
        </button>
      </li>

      <li v-if="connectionType == 'network'">
        <button class="dropdown-item" @click="reboot" :disabled="mounted && !isConnected">
          {{ $t("main.connection.reboot") }}
        </button>
      </li>
    </ClientOnly>
    
    <li>
      <hr class="dropdown-divider">
    </li>

    <li>
      <button class="dropdown-item" @click="disconnect" :disabled="mounted && !isConnected">
        {{ $t("main.connection.disconnect") }}
      </button>
    </li>



  </ul>
</template>