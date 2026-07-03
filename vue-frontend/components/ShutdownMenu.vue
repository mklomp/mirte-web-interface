<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from "vue"

const connectionStore = useConnectionStore()
const { connect, disconnect } = useConnection()

const isConnected = computed(() => connectionStore.status == "connected")
const connectionType = computed(() => connectionStore.device)

const { t } = useI18n()

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

function shutdown() {
  if (confirm(t('main.shutdown_confirm'))) {
    busy.value = true

    fetch(`http://192.168.43.1/api/shutdown`)
      .then(res => res.text())
      .then(() => {
        alert(t('main.shutdown_success'))
        busy.value = false
      })
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

    <!--
    <li>
      <button class="dropdown-item" @click="connect('sbc', 'usb')">
        MIRTE Pioneer
      </button>
    </li>
-->
    <li>
      <hr class="dropdown-divider">
    </li>

    <li>
      <button class="dropdown-item" @click="disconnect" :disabled="mounted && !isConnected">
        Disconnect
      </button>
    </li>
    <!--
    <li>
      <button class="dropdown-item" @click="shutdown">
        Shutdown
      </button>
    </li>

    <li>
      <button class="dropdown-item" @click="shutdown">
        Reboot
      </button>
    </li>
    -->
  </ul>
</template>