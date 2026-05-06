<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from "vue"

const connectionStore = useConnectionStore()
const { connect, disconnect } = useConnection()

const isConnected = computed(() => connectionStore.status == "connected")
const isDisconnected = computed(() => connectionStore.status == "disconnected")

const { t } = useI18n()

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
    {{ $t("main.connection." + connectionStore.status) }}
  </a>

  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="localeDropdown">
    <li>
      <button class="dropdown-item" @click="connect('mcu')" :disabled="!isDisconnected">
        MIRTE Basic
      </button>
    </li>

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
      <button class="dropdown-item" @click="disconnect" :disabled="!isConnected">
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