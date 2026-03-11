<template>
  <div class="row h-100">
    <div class="col-12 h-100" style="overflow: hidden">
      <div
        class="layoutbox rounded h-100"
        style="overflow: hidden; display: flex; flex-flow: column"
      >
        <div class="text-white p-2 h3 layoutbox-title w-100 background-secondary">
          {{ $t("settings.wiring") }}
          <button @click="uploadYAML" type="button" class="btn btn-mirte float-end">
            <span v-if="!busy">{{ $t("settings.save") }}</span>
            <i v-else class="fa fa-spin fa-stroopwafel"></i>
          </button>
        </div>

        <div>
          Microcontroller:
          <div class="float-end">
            <select id="mcu-select" class="form-control" name="mcu" v-model="board">
              <option v-for="(mc, name) of microcontrollers" :key="name" :value="name">
                {{ mc.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="h-100" style="overflow-y: auto">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>
                  <div class="dropdown">
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropdown-1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {{ $t("settings.add") }}
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdown-1">
                      <li v-for="i in Object.keys(peripherals)" :key="i">
                        <button class="dropdown-item" type="button" @click="add_item(i)">
                          {{ $t("peripherals." + peripherals[i].text) }}
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
              <template v-for="(set_peripherals, type) in items" :key="type">
                <tr v-for="(item, name) in set_peripherals" :key="name">
                  <td>
                    <button
                      @click="delete_item(type, item.name)"
                      type="button"
                      class="btn float-left"
                    >
                      <span class="fa fa-trash"> </span>
                    </button>
                    {{ $t("peripherals." + peripherals[type].text) }}
                  </td>

                  <td>
                    <input
                      type="text"
                      class="form-control"
                      v-model="item.name"
                      :placeholder="$t('settings.placeholder')"
                    />
                  </td>

                  <td>
                    <div
                      v-for="p in Object.keys(peripherals[type].pins)"
                      :key="p"
                      class="mb-2"
                    >
                      <select class="form-select" v-model="item.pins[p]">
                        <option :value="null" disabled>{{ p }}</option>
                        <option
                          v-for="opt in getValidPinBinds(type, p)"
                          :key="opt.value"
                          :value="opt.value"
                        >
                          {{ opt.text }}
                        </option>
                      </select>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import properties_ph from "../assets/json/properties_ph.json";
import properties_mc from "../assets/json/properties_mc.json";
import { storeToRefs } from "pinia";
import { useRosStore } from "~/stores/ros_params";
import { watch } from "vue";

export default {
  data() {
    return {
      peripherals: properties_ph,
      microcontrollers: properties_mc,
      type: "breadboard",
      board: "pico",
      items: {},
      busy: false,
      password: null,
    };
  },

  methods: {
    getPeripherals() {
      return { ...this.items.sensors, ...this.items.actuators };
    },

    add_item(type, name, pins) {
      let binds = pins ? pins : { ...this.peripherals[type].pins };
      Object.keys(binds).forEach((k) => (binds[k] = null));

      if (!this.items[type]) this.items[type] = {};
      this.items[type][name] = {
        name: name,
        pins: { ...binds },
      };
    },

    delete_item(type, name) {
      delete this.items[type][name];
      if (Object.keys(this.items[type]).length === 0) delete this.items[type];
    },

    getValidPinBinds(type, pin) {
      let pinMap = Object.entries({ ...this.microcontrollers[this.board].pin_map });
      if (this.peripherals[type].pins[pin] === "analog") {
        pinMap = pinMap.filter(
          ([_, value]) => value >= this.microcontrollers[this.board].analog_offset
        );
      }
      return pinMap.map(([value, _]) => ({ value, text: value }));
    },

    saveConfiguration() {
      this.busy = true;
      const restructured = { device: {} };
      restructured["device"]["mirte"] = { type: this.type, board: this.board };

      for (const [name, item] of Object.entries(this.items)) {
        if (name.slice(-5) === "motor") {
          const type = name.split("_")[0];
          restructured.motor = {};
          for (const [motor_name, motor] of Object.entries(item)) {
            motor.type = type;
            restructured.motor[motor.name] = motor;
          }
        } else {
          restructured[name] = {};
          for (const [i_name, i] of Object.entries(item)) {
            restructured[name][i.name] = i;
          }
        }
      }

      return YAML.load(JSON.stringify(restructured));
    },

    generateYAML() {
      const yaml = {
        name: "Mirte",
        type: this.type,
        board: {
          board: this.board,
          max_pwm_value: this.microcontrollers[this.board].max_pwm_value,
          analog_offset: this.microcontrollers[this.board].analog_offset,
        },
        peripherals: {},
      };

      for (const item of this.items) {
        yaml.peripherals[item.name] = {
          super_type: this.peripherals[item.type].rel_path.split("\\")[0],
          abstract_type: this.peripherals[item.type].rel_path.split("\\")[1],
          peripheral_type: item.type,
          pin_binds: {},
        };
        for (let key in this.peripherals[item.type].pins) {
          yaml["peripherals"][item.name].pin_binds[key] = item[key];
        }
      }

      return YAML.load(JSON.stringify(yaml));
    },

    uploadYAML() {
      if (!confirm(this.$i18n.t("settings.save_confirm"))) return;
      this.busy = true;

      let yaml = this.saveConfiguration();
      yaml = { "/**": { ros__parameters: yaml } };

      fetch(`http://192.168.43.1/api/settings`, {
        method: "POST",
        body: YAML.dump(yaml),
      })
        .then((res) => res.text())
        .then(() => {
          setTimeout(() => (window.location.href = window.location.origin), 10000);
        });
    },

    uploadMCU() {
      if (!confirm(this.$i18n.t("settings.upload_confirm"))) return;
      this.busy = true;
      const body = { mcu: this.mcu };

      fetch(`http://192.168.43.1/api/upload_telemetrix`, {
        method: "POST",
        body: JSON.stringify(body),
      })
        .then((res) => res.text())
        .then((data) => {
          this.busy = false;
          alert(
            data.toLowerCase().includes("download done")
              ? "Uploaden is succesvol afgerond"
              : "Er is een fout opgetreden:\n\n" + data
          );
        });
    },

    setPassword() {
      if (!confirm("Weet je zeker dat je het wachtwoord wilt veranderen?")) return;

      fetch(`http://192.168.43.1/api/passwd`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          CORS: "Access-Control-Allow-Origin",
        },
        body: this.password + "\n",
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    },
  },

  mounted() {
    const rosStore = useRosStore();
    const { peripherals } = storeToRefs(rosStore);

    // Watch Pinia store for async updates
    watch(
      peripherals,
      (newVal) => {
        if (!newVal) return;

        this.items = {};

        const items = { ...newVal.sensors, ...newVal.actuators };
        for (const [type_name, type] of Object.entries(items)) {
          this.items[type_name] = {};

          for (const [item_name, item] of Object.entries(type)) {
            this.items[type_name][item_name] = {
              name: item.name,
              pins: { ...item.pins },
            };
          }
        }
      },
      { immediate: true }
    );
  },
};
</script>
