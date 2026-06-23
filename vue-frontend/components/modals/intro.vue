<template>
  <div class="intro-modal">
    <h2 class="title">{{ $t("modals.load-settings.welcome-title") }}</h2>
    <p class="subtitle">{{ $t("modals.load-settings.welcome-text") }}</p>

    <div class="cards">
      <!-- Default -->
      <div class="card recommended" @click="selectDefault">
        <ClientOnly><div class="icon"><FontAwesomeIcon icon="robot"/></div></ClientOnly>
        <h3>{{ $t("modals.load-settings.mirte-title") }}</h3>
        <p>{{ $t("modals.load-settings.mirte-text") }}</p>
        <span class="badge">{{ $t("modals.load-settings.recommended") }}</span>
      </div>

      <!-- Custom -->
      <div class="card" @click="selectCustom">
        <ClientOnly><div class="icon"><FontAwesomeIcon icon="sliders"/></div></ClientOnly>
        <h3>{{ $t("modals.load-settings.custom-title") }}</h3>
        <p>{{ $t("modals.load-settings.custom-text") }}</p>
      </div>

      <!-- Connect -->
      <div
        class="card connect"
        :class="{ disabled: isConnected }"
        @click="!isConnected && connectSelected()"
      >

        <ClientOnly><div class="icon"><FontAwesomeIcon icon="plug"/></div></ClientOnly>
        <h3>{{ $t("modals.load-settings.connect-title") }}</h3>
        <p>{{ $t("modals.load-settings.connect-text") }}</p>

        <!-- Show status -->
        <p v-if="isConnected">
          Already connected
        </p>

        <!-- Dropdown selector (hidden if connected) -->
        <div
          v-if="!isConnected"
          class="dropdown"
          @click.stop
        >
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ methodLabel }}
          </a>

          <ul ref="dropdownMenu" class="dropdown-menu">
            <li>
              <button
                class="dropdown-item"
                @click="setMethod('serial')"
              >
                USB
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                @click="setMethod('ble')"
              >
                Bluetooth
              </button>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'
import { useConnectionStore } from '~/stores/connection'

import { usePeripheralStore } from '@/stores/peripherals'
import defaultSettings from '@/assets/json/pcb_settings.json?raw'

import { ref, computed } from 'vue'



const peripheralStore = usePeripheralStore()
const connectionStore = useConnectionStore()
const { connect } = useConnection()

const { t } = useI18n()
const emit = defineEmits(['close'])
const dropdownMenu = ref<HTMLElement | null>(null)

const router = useRouter()
const { addToast } = useToast()

const isConnected = computed(
  () => connectionStore.status === 'connected'
)

const method = ref<'serial' | 'ble'>('serial')

const methodLabel = computed(() =>
  method.value === 'serial' ? 'USB' : 'Bluetooth'
)

function setMethod(m: 'serial' | 'ble') {
  method.value = m
  
  // close connect dropdown. This needs to be done manually since it is a button inside a button.
  // and @click.stop is used.
  dropdownMenu.value?.classList.remove('show')

}

async function connectSelected() {
  let connection = await connect('mcu', method.value)
  if (connection) { emit('close') }
}

function selectDefault() {
  const settings = JSON.parse(defaultSettings)
  peripheralStore.setPeripherals(settings)

  emit('close')
}

function selectCustom() {
  emit('close')
  router.push('/settings')
}
</script>

<style scoped>
.intro-modal {
  text-align: center;
}

/* Titles */
.title {
  font-size: 24px;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  margin-bottom: 24px;
}

/* Cards layout */
.cards {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Card */
.card {
  position: relative;

  width: 240px;
  padding: 10px;

  border-radius: 12px;
  background: white;
  border: 1px solid #eee;

  cursor: pointer;
  text-align: center;

  display: flex;
  flex-direction: column;
  gap: 10px;

  transition: all 0.2s ease;
}

/* Hover */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Active click */
.card:active {
  transform: scale(0.98);
}

/* Disabled state */
.card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.card.disabled:hover {
  transform: none;
  box-shadow: none;
}

/* Recommended highlight */
.recommended {
  border: 2px solid #6089ba;
}

/* Badge */
.badge {
  position: absolute;
  top: 10px;
  right: 10px;

  background: #6089ba;
  color: white;

  font-size: 11px;
  padding: 2px 6px;
  border-radius: 6px;
}

/* Icon */
.icon {
  font-size: 32px;
}

/* Dropdown */
.dropdown-toggle-btn {
  margin-top: 10px;

  padding: 6px 10px;
  font-size: 14px;

  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f8f9fa;

  cursor: pointer;
}

.dropdown-toggle-btn:hover {
  background: #e9ecef;
}

/* Mobile */
@media (max-width: 700px) {
  .card {
    width: 100%;
    max-width: 320px;
  }
}
</style>