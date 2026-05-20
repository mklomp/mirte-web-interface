<template>
  <div ref="blocklyDiv" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as Blockly from 'blockly'
import { pythonGenerator } from "blockly/python"

// Import custom items
import { getToolbox } from '@/assets/blockly/toolbox'
import { useCodeStore } from "@/stores/user_code"
import { useRosStore } from '@/stores/ros_params'
import { useConnectionStore } from "@/stores/connection"

import CustomNl from "@/locales/nl.json"
import CustomEn from "@/locales/en.json"

// Blockly languages
import * as En from 'blockly/msg/en'
import * as Nl from 'blockly/msg/nl'

const blocklyDiv = ref(null)
let workspace = null
let toolBox = getToolbox()
const customBlockModules = import.meta.glob('@/assets/blockly/*.js', { eager: true })

const { locale } = useI18n()
const codeStore = useCodeStore()
const rosStore = useRosStore()
const connectionStore = useConnectionStore()
const settingsState = useState("peripheral-settings");

// Blockly state
let workspaceDOM = null
let flyout_visible = false
let scale = 0.8
let scrollX = 0
let scrollY = 0
let suppressStore = false

// TODO: import colors from scss
Blockly.Msg.FLOW_RGB = "#b8d1eb"
Blockly.Msg.DATA_RGB = "#9b372a"
Blockly.Msg.MODULES_RGB = "#cf0000"
Blockly.Msg.SENSORS_RGB = "#6089ba"
Blockly.Msg.ACTIONS_RGB = "#fbb927"

function addToToolbox(type, item) {
  const category = toolBox.contents.find(c => c.id === type)
  if (!category) return

  category.contents.push(item)
}

function loadCustomModules(settings) {

  if (connectionStore.compute_type == "sbc" && Object.keys(rosStore.peripherals).length == 0) return
  if (connectionStore.compute_type == "mcu" && connectionStore.status != "connected") return

  for (const module of Object.values(customBlockModules)) {
    const module_type = module.getType()
    let dropdown_instances = []
    let instances = []

    if (module_type && settings) {
      instances = Object.keys(settings[module_type.type] || {})
      dropdown_instances = instances.map(n => [n, n])
    }

    if (!Blockly.Extensions.isRegistered('dynamic_instances_extension_' + module_type?.type)) {
      if (instances.length != 0) { // default_blocks are already in the toolbox
        const custom_module = module.load(Blockly, pythonGenerator, dropdown_instances)
        addToToolbox(custom_module.type, custom_module.contents)
      }
    }
  }
}

function loadBlocklyMessages(lang) {
  if (lang === 'nl') {
    Blockly.setLocale(Nl)
    Blockly.setLocale(CustomNl.blockly)
  } else {
    Blockly.setLocale(En)
    Blockly.setLocale(CustomEn.blockly)
  }
}

function undo() {
  if (!workspace) return
  workspace.undo(false)
}

function redo() {
  if (!workspace) return
  workspace.undo(true)
}

// Store code to Pinia store (which saves it to localStorage)
function storeCode() {
  if (!workspace) return

  workspaceDOM = Blockly.Xml.workspaceToDom(workspace)
  const newCode = Blockly.Xml.domToText(workspaceDOM)
  if (newCode != codeStore.python) {
    codeStore.setBlockly(newCode)
    codeStore.setPython(pythonGenerator.workspaceToCode(workspace))
  }
}

// Save workspace elements for language reset
function saveWorkspace() {
  if (!workspace) return

  workspaceDOM = Blockly.Xml.workspaceToDom(workspace)
  flyout_visible = workspace.getToolbox().getSelectedItem()
  scale = workspace.getScale()
  scrollX = workspace.scrollX
  scrollY = workspace.scrollY
}

// Restore workspace elements after language reset
function restoreWorkspace() {
  if (!workspaceDOM) return

  Blockly.Xml.domToWorkspace(workspaceDOM, workspace)
  workspace.setScale(scale)
  workspace.scroll(scrollX, scrollY)
  workspace.getToolbox().setSelectedItem(flyout_visible)
}

// There are three options that this function can be called:
// - First time (with nothing in localStorage)
// - At a language/rosstate change
// - After refresh (or any revisit, so with something in localStorage)
function initBlockly(reason = "") {

  // Set workspaceDOM from previous session
  if (codeStore.blockly && (Object.keys(rosStore.peripherals).length != 0 || connectionStore.status == "connected")) {
    workspaceDOM = Blockly.utils.xml.textToDom(codeStore.blockly)
  }

  // Save workspace if language changed
  if (reason == "lang_change" || reason == "tab_change") {
    saveWorkspace()
  }

  // Clear workspace on any change
  if (reason != "") {
    workspace.dispose()
  }

  loadBlocklyMessages(locale.value)

  // Load default_blocks.js
  customBlockModules['/assets/blockly/default_blocks.js'].load(Blockly, pythonGenerator, [])

  workspace = Blockly.inject(blocklyDiv.value, {
    toolbox: toolBox,
    media: 'blockly/media',
    zoom: {
      controls: true,
      wheel: true,
      startScale: scale,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    theme: Blockly.Theme.defineTheme("customTheme", {
      base: Blockly.Themes.Zelos,
      blockStyles: {
        loop_blocks: { colourPrimary: Blockly.Msg.FLOW_RGB, colourSecondary: "", colourTertiary: "" },
        procedure_blocks: { colourPrimary: Blockly.Msg.FLOW_RGB, colourSecondary: "", colourTertiary: "" },
        logic_blocks: { colourPrimary: Blockly.Msg.DATA_RGB, colourSecondary: "", colourTertiary: "" },
        math_blocks: { colourPrimary: Blockly.Msg.DATA_RGB, colourSecondary: "", colourTertiary: "" },
        text_blocks: { colourPrimary: Blockly.Msg.DATA_RGB, colourSecondary: "", colourTertiary: "" },
        list_blocks: { colourPrimary: Blockly.Msg.DATA_RGB, colourSecondary: "", colourTertiary: "" },
        variable_blocks: { colourPrimary: Blockly.Msg.DATA_RGB, colourSecondary: "", colourTertiary: "" },
      },
    }),
    renderer: 'zelos'
  })

  // Set color of control_if, since it is part of the logic_blocks
  const i = Blockly.Blocks['controls_if'].init;
  Blockly.Blocks['controls_if'].init = function () { i.call(this); this.setColour(Blockly.Msg.FLOW_RGB); };
  const j = Blockly.Blocks['text_print'].init;
  Blockly.Blocks['text_print'].init = function () { j.call(this); this.setColour(Blockly.Msg.ACTIONS_RGB); };

  // Restore workspace (including location), or scroll to center
  if (workspaceDOM) restoreWorkspace()
  if (reason != "lang_change" && reason != "tab_change") workspace.scrollCenter()

  workspace.addChangeListener((event) => {
    // Ignore UI events (scroll, selection, toolbox open, etc.)
    if (event.isUiEvent || suppressStore) return

    // Only store meaningful changes
    if (
      event.type === Blockly.Events.BLOCK_CREATE ||
      event.type === Blockly.Events.BLOCK_DELETE ||
      event.type === Blockly.Events.BLOCK_CHANGE ||
      event.type === Blockly.Events.BLOCK_MOVE ||
      event.type === Blockly.Events.BLOCK_FIELD_INTERMEDIATE_CHANGE
    ) {
      storeCode()
    }
  })

}

onMounted(() => {
  loadCustomModules(settingsState.value)
  codeStore.loadFromLocalStorage()
  initBlockly()
})

onBeforeUnmount(() => {
  // We need to close the blockly elements
  // that are not inside the Blockly-div 
  // (eg dropdowns). Otherwise they will still
  // be rendered in the python tab.
  Blockly.hideChaff()
})

watch(locale, () => {
  initBlockly("lang_change")
})

// TODO: we could rewrite initBlockly in a way that we only
// need to do Blockly.resizeSvg() in these two watches.
// Only the lang_change, really needs a re-init of the
// whole blockly workspace.
watch(() => codeStore.active, (newVal) => {
  // TODO: check if this is working at all. does not seem to work
  // when settings change due to connecting
  if (newVal == "blockly") {
    nextTick(() => {
      initBlockly("tab_change")
    })
  }
})

watch(settingsState, (newState) => {
  // TODO: check if this is working at all. does not seem to work
  // when settings change due to connecting
  loadCustomModules(newState)
  initBlockly("serial_connection")
})

watch(() => connectionStore.status, (newStatus) => {
  if (newStatus == "disconnected") {
    suppressStore = true

    workspace.clear()

    // Let Blockly finish firing events, then re-enable
    setTimeout(() => {
      suppressStore = false
    }, 50)
  } else {
    initBlockly("serial_connection")
  }
})

watch(() => rosStore.peripherals, () => {
  loadCustomModules()
  initBlockly("ros_change")
})

watch(() => codeStore.reinit_blockly, () => {
  nextTick(() => {
    initBlockly("xml_loaded")
    codeStore.reinit_blockly = false
  })
})

defineExpose({
  undo,
  redo
})

</script>