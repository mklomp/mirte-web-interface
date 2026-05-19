import { ref } from "vue"
import * as YAML from 'js-yaml'

export type PeripheralInstance = {
  id: string
  type: string
  name: string
  pins: Record<string, string | null>
}

export function useWiring(peripheralsDef: any, microcontrollers: any) {
  const state = ref({
    board: "pico",
    type: "breadboard",
    peripherals: [] as PeripheralInstance[],
  })

  function addPeripheral(type: string) {
    const def = peripheralsDef[type]

    const pins = Object.fromEntries(
      Object.keys(def.pins).map((k) => [k, null])
    )

    state.value.peripherals.unshift({
      id: crypto.randomUUID(),
      type,
      name: "",
      pins,
    })
  }

  function removePeripheral(id: string) {
    state.value.peripherals = state.value.peripherals.filter(
      (p) => p.id !== id
    )
  }

  function getValidPins(type: string, pin: string) {
    const board = microcontrollers[state.value.board]
    let pinMap = Object.entries(board.pin_map)

    if (peripheralsDef[type].pins[pin] === "analog") {
      pinMap = pinMap.filter(([_, v]) => v >= board.analog_offset)
    }

    return pinMap.map(([value]) => ({ value, text: value }))
  }

  function loadFromYAML(data: any) {
    
    const list: PeripheralInstance[] = []

    // device info
    if (data?.device?.mirte) {
      state.value.board = data.device.mirte.board || "pico"
      state.value.type = data.device.mirte.type || "breadboard"
    }

    // peripherals
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

  async function saveYAML() {

    const { addToast } = useToast()
    const { uploadFile } = useConnection()
    const json = toJSON()
    const yamlText = YAML.dump(json)
    await uploadFile('/settings.yaml', yamlText)

    // but also store the json equivalent to be
    // used by mircopython
    await uploadFile('/.settings.json', JSON.stringify(json, null, 2))

    // modify the used state (TODO: or should this be in Device?)
    const yaml = YAML.load(yamlText)
    useState("peripheral-settings").value = yaml
    addToast('Successfully saved the settings.', 'success', 'upload-settings')
  }

  function toJSON() {
    const result: any = {
      device: {
        mirte: {
          type: state.value.type,
          board: state.value.board,
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

  return {
    state,
    addPeripheral,
    removePeripheral,
    getValidPins,
    loadFromYAML,
    saveYAML,
  }
}