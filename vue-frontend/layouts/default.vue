<script setup>
import { useLocalePath } from '#i18n'
const localePath = useLocalePath()
const head = useLocaleHead()
const connectionStore = useConnectionStore()
const peripheralStoreStore = usePeripheralStore()

const visible = ref(false)

onMounted(async () => {
  // autoconnect if there are existing connections 
  // and I was previously connected
  if ('serial' in navigator) {
    const ports = await navigator.serial.getPorts()
    if (ports.length > 0 && connectionStore.status == "connected") {
      await useConnection().connect("mcu", "serial", true)
    }
  }

  peripheralStoreStore.loadFromLocalStorage()
})


import { useModal } from '~/composables/useModal'
import settingsModal from '~/components/TelemetrixSettings.vue'
import networkModal from '~/components/NetworkSettings.vue'
const { openModal, closeModal } = useModal()

const isConnected = computed(() => connectionStore.status == "connected")
const connectionType = computed(() => connectionStore.transport)


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
                Robot hardware
              </button>
            </li>

            <ClientOnly>
              <li>
                <button class="dropdown-item" @click="openWifi(); visible = false;" :disabled="!isConnected">
                  Network
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
