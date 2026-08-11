<template>

  <div class="row h-100">
    <div class="col-12 h-100">
      <div class="layoutbox rounded h-100 d-flex flex-column">

        <!-- HEADER -->
        <div class="layoutbox-title background-secondary d-flex justify-content-between align-items-center px-2 py-2">

          <ul class="nav nav-tabs border-0">
            <li class="nav-item">
              <button class="nav-link" :class="{ active: activeTab === 'peripherals' }"
                @click="activeTab = 'peripherals'">
                {{ $t("settings.wiring") }}
              </button>
            </li>

            <li v-if="!isMCU" class="nav-item">
              <button class="nav-link" :class="{ active: activeTab === 'drive' }" @click="activeTab = 'drive'">
                {{ $t("settings.drive") }}
              </button>
            </li>
          </ul>

          <div>
            <button @click="save" class="btn btn-mirte me-2">
              {{ $t("settings.save") }}
            </button>

            <button @click="closeModal()" class="btn text-white">
              x
            </button>
          </div>

        </div>

        <!-- PERIPHERALS TAB -->
        <template v-if="activeTab === 'peripherals'">


          <!-- HARDWARE -->
          <div class="p-2">
            Hardware:
            <div class="float-end">
              <select v-model="state.type" class="form-control">
                <option value="pcb">MIRTE PCB</option>
                <option value="breadboard">Rapberry Pi Pico</option>
              </select>
            </div>


            <button @click="reinstall" class="btn btn-mirte float-end mx-2" :disabled="!isMCU || !isConnected">
              {{ $t("settings.reinstall") }}
            </button>
          </div>


          <!-- TABLE -->
          <div class="h-100 table-scroll">
            <table class="table table-striped">

              <thead class="sticky-header">
                <tr>
                  <th>
                    <div class="dropdown">
                      <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
                        {{ $t("settings.add") }}
                      </button>

                      <ul class="dropdown-menu">
                        <li v-for="(p, key) in peripheralsDef" :key="key">
                          <button class="dropdown-item" @click="addPeripheral(key, usedPins)"
                            :disabled="!isUsablePeripheral(key)">
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
                <PeripheralRow v-for="item in state.peripherals" :key="item.id" :item="item"
                  :errors="validationErrors[item.id] || {}" :peripheralsDef="peripheralsDef" :usedPins="usedPins"
                  :updatePeripheralPin="updatePeripheralPin" :getValidPins="getValidPins" @remove="removePeripheral" :isUsedInCode="isUsed(item.id)" />
              </tbody>

            </table>
          </div>

        </template>

        <!-- DIFFERENTIAL DRIVE TAB -->
        <template v-else>

          <div class="p-3">

            <div v-if="!hasEnoughMotors" class="alert alert-warning">
              {{ $t("settings.drive_message") }}

            </div>

            <div class="mb-3">
              <label class="form-label">Left motor</label>

              <select v-model="leftMotor" class="form-control" :class="{ 'warning-field': driveErrors.sameMotor }"
                :disabled="!hasEnoughMotors">
                <option v-for="motor in motors" :key="motor" :value="motor">
                  {{ motor }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Right motor</label>

              <select v-model="rightMotor" class="form-control" :class="{ 'warning-field': driveErrors.sameMotor }"
                :disabled="!hasEnoughMotors">
                <option v-for="motor in motors" :key="motor" :value="motor">
                  {{ motor }}
                </option>
              </select>
            </div>

            <div v-if="driveErrors.sameMotor" class="alert alert-warning">
              Left and right motor must be different motors.
            </div>

          </div>

        </template>

      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue"

import properties_ph from "~/assets/json/properties_ph.json"
import properties_mc from "~/assets/json/properties_mc.json"
import pcb_options from "~/assets/json/pcb_options.json"

import { useWiring } from "~/composables/useWiring"
import { usePeripheralStore } from '@/stores/peripherals'
import { useToast } from '~/composables/useToast'
import { useModal } from '~/composables/useModal'

const { addToast } = useToast()
const { closeModal } = useModal()

import PeripheralRow from "~/components/PeripheralRow.vue"

const peripheralsDef = properties_ph
const microcontrollers = properties_mc
const pcb_pin_defs = pcb_options
const peripheralStore = usePeripheralStore()

const {
  state,
  addPeripheral,
  removePeripheral,
  getValidPins,
  JSONtoUI,
  saveJSON,
  reinstallMIRTE,
  saveControlJSON,
  updatePeripheralPin
} = useWiring(peripheralsDef, microcontrollers, pcb_pin_defs)

const connection = useConnection()
const connectionStore = useConnectionStore()
const isConnected = computed(() => connectionStore.status == "connected")
const isMCU = computed(() => connectionStore.device == "mcu")

const activeTab = ref("peripherals")

const leftMotor = ref("")
const rightMotor = ref("")

const motors = computed(() =>
  (state.value.peripherals || [])
    .filter(peripheral => peripheral.type === "motor")
    .map(peripheral => peripheral.name)
    .filter(Boolean)
)

const hasEnoughMotors = computed(() =>
  motors.value.length >= 2
)

const driveErrors = computed(() => ({
  sameMotor:
    hasEnoughMotors.value &&
    leftMotor.value &&
    rightMotor.value &&
    leftMotor.value === rightMotor.value
}))

let socket = null

watch(
  connectionStore,
  (val) => {
    if (val.status == "connected" && val.transport == "network" && val.hostname != "") {
      socket = new WebSocket(`ws://${val.hostname}/ws/shell`)
    }
  }
)

watch(
  peripheralStore.controls,
  (val) => {
    leftMotor.value = val.left_motor
    rightMotor.value = val.right_motor
  },
  { immediate: true }
)



watch(
  motors,
  (motorNames) => {

    // If less that 2 motors, set to empty 
    if (motorNames.length < 2) {
      leftMotor.value = ""
      rightMotor.value = ""
      return
    }

    // If the current control motors are not in the list anymore,
    // just pick the first two motors.
    if (!motorNames.includes(leftMotor.value)) {
      leftMotor.value = motorNames[0]
    }

    if (!motorNames.includes(rightMotor.value)) {
      rightMotor.value =
        motorNames.find(m => m !== leftMotor.value) ??
        motorNames[0]
    }
  },
  { immediate: true }
)

function isUsed(id){

  // We can only try to find usages of blocks. We cannot do this
  // with the python code, since it is undoable to also find
  // usages where the instances are variables. 
  // To easily find the string, we are looking for some string
  // in the generated Python code.
  // This assumes a Python call with the instancename as first
  // functionparam.
  const peripheral = state.value.peripherals.find(x => x.id === id);
  const functions = peripheralsDef[peripheral.type].functions[0]
  const instanceName = peripheral.name
  const findString = functions + "('" + instanceName
  const pythonCode = useCodeStore().python

  return pythonCode.includes(findString)
}

function isUsablePeripheral(key) {
  const allowed =
    useConnectionStore().transport === "network"
      ? ['motor', 'intensity', 'servo', 'keypad', 'distance', 'line', 'object', 'oled', 'color']
      : ['motor', 'intensity', 'servo', 'keypad', 'distance', 'line', 'object']

  if (!allowed.includes(key)) {
    return false
  }

  if (state.value.type !== "pcb") {
    return true
  }

  const config = pcb_pin_defs?.[key]?.pins

  if (!config) {
    return true
  }

  const existingCount = state.value.peripherals.filter(
    p => p.type === key
  ).length

  const firstPinOptions = Object.values(config)[0]

  const maxCount = Array.isArray(firstPinOptions)
    ? firstPinOptions.length
    : 1

  return existingCount < maxCount
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
  JSONtoUI(peripheralStore.peripherals)

  leftMotor.value = peripheralStore.controls.left_motor
  rightMotor.value = peripheralStore.controls.right_motor


  if (connectionStore.status == "connected" && connectionStore.device == "sbc" && connectionStore.hostname != "") {
    socket = new WebSocket(`ws://${connectionStore.hostname}/ws/shell`)
  }
})

watch(
  () => peripheralStore.peripherals,
  (val) => {
    if (val) JSONtoUI(val)
  }
)

const validationErrors = computed(() => {
  const errors = {}
  const nameRegex = /^[A-Za-z0-9_-]+$/

  const namesPerType = new Map()

  for (const peripheral of (state.value.peripherals || [])) {
    const type = peripheral.type
    const name = peripheral.name ?? ""

    if (!type || !name) continue

    const key = `${type}:${name}`

    namesPerType.set(key, (namesPerType.get(key) || 0) + 1)
  }

  for (const peripheral of (state.value.peripherals || [])) {
    const peripheralErrors = {}

    const name = peripheral.name ?? ""

    if (!name) {
      peripheralErrors.name = "Naam mag niet leeg zijn"
    }
    else if (!nameRegex.test(name)) {
      peripheralErrors.name =
        "Alleen letters, cijfers, - en _ zijn toegestaan"
    }
    else {
      const key = `${peripheral.type}:${name}`

      if (namesPerType.get(key) > 1) {
        peripheralErrors.name =
          `De naam '${name}' wordt al gebruikt voor een andere ${peripheral.type}`
      }
    }

    for (const [pinName, pin] of Object.entries(peripheral.pins || {})) {
      if (pin === undefined || pin === null || pin === "") {
        peripheralErrors[pinName] =
          `Pin '${pinName}' is niet ingevuld`
        continue
      }

      if (pin > 0 && usedPins.value.get(pin)?.length > 1) {
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
    addToast($i18n.t('toast.config_errors'), "error", "settings-status")
    return
  }

  if (driveErrors.value.sameMotor) {
    addToast($i18n.t('toast.motor_name_error'), "error", "settings-status")
    return
  }

  busy.value = true

  if (leftMotor.value != "" && rightMotor.value != "") {
    if (socket) {
      socket.send("sed -i 's/left_motor_name:.*/left_motor_name: \"" + leftMotor.value +
        "\"/' /home/mirte/mirte_ws/src/mirte-ros-packages/mirte_control/mirte_pioneer_control/bringup/config/mirte_diff_drive_controllers.yaml " +
        " && sed -i 's/right_motor_name:.*/right_motor_name: \"" + rightMotor.value +
        "\"/' /home/mirte/mirte_ws/src/mirte-ros-packages/mirte_control/mirte_pioneer_control/bringup/config/mirte_diff_drive_controllers.yaml " +
        "\n")
    }
  }

  try {
    await saveJSON()
    saveControlJSON(leftMotor.value, rightMotor.value)
    if (!isMCU) {
      if (socket) { socket.send("sudo systemctl restart mirte-ros\n") }
      connection.getTransport().restartRos()
      addToast($i18n.t('toast.restarting_ros'), "warning", "restart-ros", -1)
    }
  }
  finally {
    busy.value = false
  }
}
</script>

<style scoped>
.table-scroll {
  overflow-y: auto;
}

.layoutbox-title {
  position: sticky;
  top: 0;
  z-index: 100;
}

.sticky-header th {
  position: sticky;
  top: 0;
  z-index: 90;
  background: white;
}

.nav-tabs {
  border-bottom: none;
}

.nav-tabs .nav-link {
  color: white;
  border: none;
  background: transparent;
}

.nav-tabs .nav-link.active {
  color: black;
  border: none;
}

.warning-field {
  background-color: #fff3cd;
  border-color: #ffc107;
}
</style>