<template>

  <div class="row h-100">
    <div class="col-12 h-100">
      <div class="layoutbox rounded h-100 d-flex flex-column">

        <!-- HEADER -->
        <div class="text-white p-2 h3 layoutbox-title background-secondary">
          {{ $t("settings.wiring") }}

          <button @click="save" class="btn btn-mirte float-end">
            {{ $t("settings.save") }}
          </button>
          <button @click="reinstall" class="btn btn-mirte float-end" v-if="connectionType == 'serial' && isConnected">
            {{ $t("settings.reinstall") }}
          </button>
        </div>

        <!-- BOARD -->
        <div class="p-2">
          Microcontroller:
          <div class="float-end">
            <select v-model="state.board" class="form-control">
              <option v-for="(mc, name) in microcontrollers" :key="name" :value="name" :disabled="!isUsableMC(name)">
                {{ mc.text }}
              </option>
            </select>
          </div>
        </div>

        <!-- TABLE -->
        <div class="h-100" style="overflow-y: auto">
          <table class="table table-striped">

            <thead>
              <tr>
                <th>
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
                      {{ $t("settings.add") }}
                    </button>

                    <ul class="dropdown-menu">
                      <li v-for="(p, key) in peripheralsDef" :key="key">
                        <button class="dropdown-item" @click="addPeripheral(key)" :disabled="!isUsablePeripheral(key)">
                          {{ $t("peripherals." + p.text) }}
                        </button>
                      </li>
                    </ul>
                  </div>
                </th>

                <th>{{ $t("settings.name") }}</th>
                <th>{{ $t("settings.pin") }}</th>
              </tr>
            </thead>

            <tbody>
              <PeripheralRow
                v-for="item in state.peripherals"
                :key="item.id"
                :item="item"
                :errors="validationErrors[item.id] || {}"
                :peripheralsDef="peripheralsDef"
                :usedPins="usedPins"
                :getValidPins="getValidPins"
                @remove="removePeripheral"
              />
            </tbody>

          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue"

import properties_ph from "~/assets/json/properties_ph.json"
import properties_mc from "~/assets/json/properties_mc.json"

import { useWiring } from "~/composables/useWiring"
import { usePeripheralStore } from '@/stores/peripherals'
import { useToast } from '~/composables/useToast'

const { addToast } = useToast()

import PeripheralRow from "~/components/PeripheralRow.vue"

const peripheralsDef = properties_ph
const microcontrollers = properties_mc
const peripheralStore = usePeripheralStore()

const {
  state,
  addPeripheral,
  removePeripheral,
  getValidPins,
  JSONtoUI,
  saveJSON,
  reinstallMIRTE
} = useWiring(peripheralsDef, microcontrollers)

const connectionStore = useConnectionStore()
const isConnected = computed(() => connectionStore.status == "connected")
const connectionType = computed(() => connectionStore.device)

function isUsableMC(name) {
  return name === "pico"
}

function isUsablePeripheral(key) {
  return ['motor', 'intensity', 'servo', 'keypad', 'distance', 'line', 'object'].includes(key)
}


const usedPins = computed(() => {
  const map = new Map()

  for (const peripheral of (state.value.peripherals || [])) {
    for (const [pinName, pin] of Object.entries(peripheral.pins || {})) {
      if (pin !== undefined && pin !== null && pin !== "") {
        if (!map.has(pin)) {
          map.set(pin, [])
        }

        map.get(pin).push({
          peripheralId: peripheral.id,
          pinName
        })
      }
    }
  }

  return map
})


onMounted(() => {
  peripheralStore.loadFromLocalStorage()
})

watch(
  peripheralStore,
  (val) => {
    if (val) JSONtoUI(val.peripherals)
  }
)

const validationErrors = computed(() => {
  const errors = {}
  const nameRegex = /^[A-Za-z0-9_-]+$/

  for (const peripheral of (state.value.peripherals || [])) {
    const peripheralErrors = {}

    const name = peripheral.name?.trim() ?? ""

    if (!name) {
      peripheralErrors.name = "Naam mag niet leeg zijn"
    }
    else if (!nameRegex.test(name)) {
      peripheralErrors.name =
        "Alleen letters, cijfers, - en _ zijn toegestaan"
    }

    for (const [pinName, pin] of Object.entries(peripheral.pins || {})) {

      if (pin === undefined || pin === null || pin === "") {
        peripheralErrors[pinName] =
          `Pin '${pinName}' is niet ingevuld`
        continue
      }

      if (usedPins.value.get(pin)?.length > 1) {
        peripheralErrors[pinName] =
          `Pin ${pin} wordt meerdere keren gebruikt`
      }
    }

    if (Object.keys(peripheralErrors).length > 0) {
      errors[peripheral.id] = peripheralErrors
    }
  }

  return errors
})

const hasErrors = computed(() =>
  Object.keys(validationErrors.value).length > 0
)

const busy = ref(false)

async function reinstall() {
  await reinstallMIRTE()
  await save()
}

async function save() {

  if (hasErrors.value) {
    addToast("Er zijn configuratiefouten aanwezig. Controleer de oranje velden.", "error", "setting-error")
    return
  }

  busy.value = true

  try {
    await saveJSON()
  }
  finally {
    busy.value = false
  }
}
</script>