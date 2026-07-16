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

            <li class="nav-item">
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

            <button @click="reinstall" class="btn btn-mirte float-end mx-2"
              :disabled="connectionType !== 'serial' || !isConnected">
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
                          <button class="dropdown-item" @click="addPeripheral(key)"
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
                  :getValidPins="getValidPins" @remove="removePeripheral" />
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

import { useWiring } from "~/composables/useWiring"
import { usePeripheralStore } from '@/stores/peripherals'
import { useToast } from '~/composables/useToast'
import { useModal } from '~/composables/useModal'

const { addToast } = useToast()
const { closeModal } = useModal()

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
  reinstallMIRTE,
  saveControlJSON
} = useWiring(peripheralsDef, microcontrollers)

const connection = useConnection()
const connectionStore = useConnectionStore()
const isConnected = computed(() => connectionStore.status == "connected")
const connectionType = computed(() => connectionStore.device)

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
    if (val.status == "connected" && val.transport == "network" && val.ip_address != "") {
      socket = new WebSocket(`ws://${val.ip_address}/ws/shell`)
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
  JSONtoUI(peripheralStore.peripherals)

   leftMotor.value = peripheralStore.controls.left_motor
   rightMotor.value = peripheralStore.controls.right_motor


  if (connectionStore.status == "connected" && connectionStore.transport == "network" && connectionStore.ip_address != "") {
    socket = new WebSocket(`ws://${connectionStore.ip_address}/ws/shell`)
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
    addToast(
      "Er zijn configuratiefouten aanwezig. Controleer de oranje velden.",
      "error",
      "settings-status"
    )
    return
  }

  if (driveErrors.value.sameMotor) {
    addToast(
      "Left and right motor must be different motors.",
      "error",
      "settings-status"
    )
    return
  }

  busy.value = true

  if (leftMotor.value != "" && rightMotor.value != "") {
    socket.send("sed -i 's/left_motor_name:.*/left_motor_name: \"" + leftMotor.value +
      "\"/' /home/mirte/mirte_ws/src/mirte-ros-packages/mirte_control/mirte_pioneer_control/bringup/config/mirte_diff_drive_controllers.yaml " +
      " && sed -i 's/right_motor_name:.*/right_motor_name: \"" + rightMotor.value +
      "\"/' /home/mirte/mirte_ws/src/mirte-ros-packages/mirte_control/mirte_pioneer_control/bringup/config/mirte_diff_drive_controllers.yaml " +
      "\n")
  }

  try {
    await saveJSON()
    saveControlJSON(leftMotor.value, rightMotor.value)
    socket.send("sudo systemctl restart mirte-ros\n")
    connection.getTransport().restartRos()
    addToast(
      "Restarting ROS.",
      "warning",
      "restart-ros",
      "-1"
    )
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