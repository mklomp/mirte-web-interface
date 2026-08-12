<script setup>
import { useLocalePath } from '#i18n'
const localePath = useLocalePath()
const head = useLocaleHead()
const connectionStore = useConnectionStore()
const peripheralStoreStore = usePeripheralStore()
const config = useRuntimeConfig()
const visible = ref(false)

const route = useRoute()

// TODO: or should this be in app.vue?
onMounted(async () => {
  // Load peripherals 
  peripheralStoreStore.loadFromLocalStorage()

  // Determine if we are MCU (default) or SBC (running on a robot)
  // If the ENV variable MIRTE_SBC_IDE is set, we are running from the robot/SBC
  connectionStore.setConnectionDevice("mcu")
  if (config.sbcIDE) { connectionStore.setConnectionDevice("sbc") }

  // Determine the host to connect to
  if (connectionStore.device == "sbc") {
    connectionStore.setConnectionHostname(location.hostname)
  } else {
    connectionStore.setConnectionHostname("")
  }

  // For development purposes we can also connect to a remote SBC
  if (location.hostname == "localhost" && route.query.ip){
    connectionStore.setConnectionDevice("sbc")
    connectionStore.setConnectionHostname(route.query.ip)
  }

  // Set debug value
  if (location.hostname == "localhost" && route.query.debug){
    useState("debug").value = true
  }

  // autoconnect if there are existing connections 
  // and you were previously connected
  if (connectionStore.device == "mcu" && 'serial' in navigator) {
    const ports = await navigator.serial.getPorts()
    if (ports.length > 0 && connectionStore.status == "connected") {
      await useConnection().connect("mcu", "serial", true)
    }
  }
  if (connectionStore.device == "sbc") {
    await useConnection().connect("sbc", "network", true)
  }
})


import { useModal } from '~/composables/useModal'
import settingsModal from '~/components/TelemetrixSettings.vue'
import networkModal from '~/components/NetworkSettings.vue'
const { openModal, closeModal } = useModal()

const isConnected = computed(() => connectionStore.status == "connected")
const deviceType = computed(() => connectionStore.device)


function openSettings() {
  openModal(settingsModal)
}

function openWifi() {
  openModal(networkModal)
}


</script>

<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
  <div class="container-fluid">
    <NuxtLink :to="localePath('index')" class="navbar-brand">
      <NuxtImg style="float: left; margin-right: 10px;" src="/images/mirte_logo.png" alt="MIRTE lite" height="45"
        width="45" format="webp" />
      <h1>MIRTE</h1>
    </NuxtLink>
    <button aria-label="navbar-toggler" class="navbar-toggler" type="button" data-bs-toggle="collapse"
      data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" @click="visible = true">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-collapse" :class="!visible ? 'collapse' : ''" id="navbarNavDropdown">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item dropdown">

          <a class="nav-link dropdown-toggle" href="#" id="settingsDropdown" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            {{ $t("main.settings") }}
          </a>

          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="settingsDropdown">
            <li>
              <button class="dropdown-item" @click="openSettings(); visible = false; ">
                {{ $t("main.connection.robot_hardware") }}
              </button>
            </li>

            <ClientOnly>
              <li v-if="deviceType == 'sbc'">
                <button class="dropdown-item" @click="openWifi(); visible = false;" :disabled="!isConnected">
                  {{ $t("main.connection.network") }}
                </button>
              </li>
            </ClientOnly>
          </ul>
        </li>
        <li class="nav-item dropdown">
          <ShutdownMenu v-model:visible="visible"/>
        </li>
        <li class="nav-item dropdown">
          <LocaleChanger />
        </li>
      </ul>
    </div>
  </div>


  </Html>
</template>
