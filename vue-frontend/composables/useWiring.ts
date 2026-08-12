import { ref } from "vue"
import { usePeripheralStore } from "@/stores/peripherals"

export type PeripheralInstance = {
  id: string
  type: string
  name: string
  pins: Record<string, string | null>
}

export function useWiring(
  peripheralsDef: any,
  microcontrollers: any,
  pcbPins: any // <-- placeholder json
) {
  const connectionStore = useConnectionStore()
  const peripheralStore = usePeripheralStore()
  const isConnected = connectionStore.status === "connected"

  const state = ref({
    board: "pico",
    type: "breadboard",
    peripherals: [] as PeripheralInstance[],
  })


  function syncDependentPins(
    peripheral: PeripheralInstance,
    changedPin?: string
  ) {
    if (state.value.type !== "pcb") return

    const config = pcbPins?.[peripheral.type]?.pins

    if (!config) return

    if (peripheral.type === "motor") {
      syncPinPair(peripheral, config, "p1", "p2", changedPin)
    }

    if (peripheral.type === "distance") {
      syncPinPair(peripheral, config, "trigger", "echo", changedPin)
    }

    if (peripheral.type === "line") {
      syncPinPair(peripheral, config, "digital", "analog", changedPin)
    }

    if (
      peripheral.type === "oled" ||
      peripheral.type === "color"
    ) {
      syncPinPair(peripheral, config, "sda", "scl", changedPin)
    }
  }

  function syncPinPair(
    peripheral: PeripheralInstance,
    config: any,
    sourcePin: string,
    targetPin: string,
    changedPin: string
  ) {
    const source = config[sourcePin]
    const target = config[targetPin]

    if (!Array.isArray(source) || !Array.isArray(target)) return

    if (changedPin === sourcePin) {
      const idx = source.indexOf(peripheral.pins[sourcePin])

      if (idx >= 0 && target[idx]) {
        peripheral.pins[targetPin] = target[idx]
      }
    }

    if (changedPin === targetPin) {
      const idx = target.indexOf(peripheral.pins[targetPin])

      if (idx >= 0 && source[idx]) {
        peripheral.pins[sourcePin] = source[idx]
      }
    }
  }

  function updatePeripheralPin(
    peripheralId: string,
    pinName: string,
    value: string
  ) {
    const peripheral = state.value.peripherals.find(
      p => p.id === peripheralId
    )

    if (!peripheral) return

    peripheral.pins[pinName] = value

    syncDependentPins(peripheral, pinName)
  }

  function addPeripheral(
    type: string,
    usedPins: Map<string, any[]>
  ) {
    const def = peripheralsDef[type]

    const pins = Object.fromEntries(
      Object.keys(def.pins).map(pinName => [
        pinName,
        findAvailablePin(type, pinName, usedPins),
      ])
    )

    const peripheral: PeripheralInstance = {
      id: crypto.randomUUID(),
      type,
      name: "",
      pins,
    }

    state.value.peripherals.unshift(peripheral)
  }

  function removePeripheral(id: string) {
    state.value.peripherals = state.value.peripherals.filter(
      (p) => p.id !== id
    )
  }


  function isPinFree(pin: string, usedPins: Map<string, any[]>) {
    return !usedPins.has(pin)
  }


  function findAvailablePin(
    type: string,
    pinName: string,
    usedPins: Map<string, any[]>
  ) {
    const validPins = getValidPins(type, pinName)

    return validPins.find(p => isPinFree(p.value, usedPins))?.value ?? null
  }


  function getValidPins(type: string, pin: string) {
    if (state.value.type === "pcb") {
      const restrictedPins = pcbPins?.[type]?.pins?.[pin]

      if (restrictedPins) {
        const pins = Array.isArray(restrictedPins)
          ? restrictedPins
          : [restrictedPins]

        return pins.map(value => ({
          value,
          text: value,
        }))
      }
    }

    const board = microcontrollers[state.value.board]

    let pinMap = Object.entries(board.pin_map)

    if (peripheralsDef[type].pins[pin] === "analog") {
      pinMap = pinMap.filter(
        ([_, v]) => Number(v) >= board.analog_offset
      )
    }

    return pinMap.map(([value]) => ({
      value,
      text: value,
    }))
  }

  async function saveYAML() {
    const json = UItoJSON()
    const yaml = YAML.dump(json)

    if (connectionStore.status == "connected") {
      const { uploadFile } = useConnection()

      await uploadFile("/settings.yaml", yaml)

      await uploadFile(
        "/.settings.json",
        JSON.stringify(json, null, 2)
      )
    }
  }

  function saveControlJSON(left_motor, right_motor) {
    peripheralStore.setControl(left_motor, right_motor)
  }

  async function saveJSON() {
    const json = UItoJSON()
    peripheralStore.setPeripherals(json)
  }

  function UItoJSON() {
    const result: any = {
      device: {
        mirte: {
          type: state.value.type,
          version: 0.8,
          board: state.value.board,
          max_frequency: 25 // not that this is not read from the config yet. And alos does not work for MCU
        },
      },
    }

    for (const p of state.value.peripherals) {
      if (!result[p.type]) result[p.type] = {}

      result[p.type][p.name] = {
        name: p.name,
        device: "mirte",
        pins: p.pins,
      }
    }
    return result
  }

  function loadFromYAML(data: any) {
    const list: PeripheralInstance[] = []

    if (data?.device?.mirte) {
      state.value.board = data.device.mirte.board || "pico"
      state.value.type = data.device.mirte.type || "pcb"
    }

    if (data) {
      for (const [type, group] of Object.entries(data)) {
        if (type === "device") continue

        for (const [name, item] of Object.entries(group as any)) {
          list.push({
            id: crypto.randomUUID(),
            type,
            name: item.name || name,
            pins: { ...item.pins },
          })
        }
      }
    }

    state.value.peripherals = list
  }

  function JSONtoUI(input: any) {
    loadFromYAML(input)
  }

  async function reinstallMIRTE() {
    const { reinstallMIRTE } = useConnection()
    await reinstallMIRTE()
  }

  return {
    state,
    addPeripheral,
    removePeripheral,
    getValidPins,
    updatePeripheralPin, // <-- use this in PeripheralRow
    loadFromYAML,
    saveYAML,
    saveJSON,
    JSONtoUI,
    reinstallMIRTE,
    saveControlJSON,
  }
}