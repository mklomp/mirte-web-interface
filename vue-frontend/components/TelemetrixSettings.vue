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
        </div>

        <!-- BOARD -->
        <div class="p-2">
          Microcontroller:
          <div class="float-end">
            <select v-model="state.board" class="form-control">
              <option
                v-for="(mc, name) in microcontrollers"
                :key="name"
                :value="name"
              >
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
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      {{ $t("settings.add") }}
                    </button>

                    <ul class="dropdown-menu">
                      <li v-for="(p, key) in peripheralsDef" :key="key">
                        <button
                          class="dropdown-item"
                          @click="addPeripheral(key)"
                        >
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
                :peripheralsDef="peripheralsDef"
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
import { ref, watch } from "vue"
import { storeToRefs } from "pinia"

import properties_ph from "~/assets/json/properties_ph.json"
import properties_mc from "~/assets/json/properties_mc.json"

import { useWiring } from "~/composables/useWiring"
import { useRosStore } from "~/stores/ros_params"

import PeripheralRow from "~/components/PeripheralRow.vue"

const peripheralsDef = properties_ph
const microcontrollers = properties_mc

const {
  state,
  addPeripheral,
  removePeripheral,
  getValidPins,
  loadFromYAML,
  saveYAML
} = useWiring(peripheralsDef, microcontrollers)

const rosStore = useRosStore()
const { peripherals } = storeToRefs(rosStore)
const peripheralsSetting = useState("peripheral-settings")

watch(
  peripheralsSetting,
  (val) => {
    console.log("--------------")
    console.log(val)
    if (val) loadFromYAML(val)
  }
)

const busy = ref(false)

async function save() {
  busy.value = true
  await saveYAML()
  //location.reload()
}
</script>