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
import { usePeripheralStore } from '@/stores/peripherals'

import CustomNl from "@/locales/nl.json"
import CustomEn from "@/locales/en.json"
const { t } = useI18n()

// Blockly languages
import * as En from 'blockly/msg/en'
import * as Nl from 'blockly/msg/nl'

const blocklyDiv = ref(null)
let workspace = null
let toolBox = getToolbox()
const customBlockModules = import.meta.glob('@/assets/blockly/*.js', { eager: true })

const { locale } = useI18n()
const codeStore = useCodeStore()
const { addToast } = useToast()
const peripheralStore = usePeripheralStore()

// Blockly state
let workspaceDOM = null
let flyout_visible = false
let scale = 0.8
let scrollX = 0
let scrollY = 0
let suppressSave = false

// TODO: import colors from scss
Blockly.Msg.FLOW_RGB = "#b8d1eb"
Blockly.Msg.DATA_RGB = "#9b372a"
Blockly.Msg.MODULES_RGB = "#cf0000"
Blockly.Msg.SENSORS_RGB = "#6089ba"
Blockly.Msg.ACTIONS_RGB = "#fbb927"

const delay = ms => new Promise(res => setTimeout(res, ms));

function addToToolbox(type, item) {
  const category = toolBox.contents.find(c => c.id === type)
  if (!category) return

  category.contents.push(item)
}

function loadCustomModules(settings) {

  // start with a clean toolbox
  toolBox = getToolbox()

  for (const module of Object.values(customBlockModules)) {
    const module_type = module.getType()
    let dropdown_instances = []
    let instances = []

    if (module_type && settings) {
      instances = Object.keys(settings[module_type.type] || {})
      dropdown_instances = instances.map(n => [n, n])
    }

    // Unregister all modules
    let extensionName = 'dynamic_instances_extension_' + module_type?.type
    if (Blockly.Extensions.isRegistered(extensionName)) {
      Blockly.Extensions.unregister(extensionName)
    }

    // Register all active modules
    if (instances.length != 0) { // default_blocks are already in the toolbox
      const custom_module = module.load(Blockly, pythonGenerator, dropdown_instances)
      addToToolbox(custom_module.type, custom_module.contents)
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

function resize() {
  if (workspace) {
    Blockly.svgResize(workspace)
  }
}

// Store code to Pinia store (which saves it to localStorage)
function storeCode() {
  if (!workspace) return

  workspaceDOM = Blockly.Xml.workspaceToDom(workspace)
  const newCode = Blockly.Xml.domToText(workspaceDOM)
  if (newCode != codeStore.python) {
    codeStore.setBlockly(newCode)
    useState("python-user-modified").value = false
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

  try {
    Blockly.Xml.domToWorkspace(workspaceDOM, workspace)
  } catch {
    // TODO: this needs to be a userchoice
    addToast(t('toast.loading_blocks_error'), 'error')
    codeStore.clear()
    workspace.dispose()
    workspace = getCleanWorkspace()
    workspaceDOM = Blockly.Xml.workspaceToDom(workspace)
  }
  workspace.setScale(scale)
  workspace.scroll(scrollX, scrollY)
  workspace.getToolbox().setSelectedItem(flyout_visible)
}

function getCleanWorkspace() {
  return Blockly.inject(blocklyDiv.value, {
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
}


async function initBlockly(reason) {
  // Set workspaceDOM from previous session
  if (codeStore.blockly) {
    workspaceDOM = Blockly.utils.xml.textToDom(codeStore.blockly)
  } else {
    workspaceDOM = null
  }

  // Save workspace if language or settings changed
  if (reason == "lang_changed" || reason == "settings_changed") {
    saveWorkspace()
  }

  // Clear workspace on any change
  if (reason != "clean") {
    workspace.dispose()
  }

  loadBlocklyMessages(locale.value)

  // Load default_blocks.js
  customBlockModules['/assets/blockly/default_blocks.js'].load(Blockly, pythonGenerator, [])

  workspace = getCleanWorkspace()

  // Restore workspace (including location), or scroll to center
  if (workspaceDOM) { 
    if (reason == "split_changed") { await delay(200); } // wait until the split has been fully recovered
    restoreWorkspace() 
  }
  if (reason == "clean") {
    // make sure the DOM is loaded
    requestAnimationFrame(() => {
      Blockly.svgResize(workspace)
      workspace.scrollCenter()
    })
  }

  // Set color of control_if, since it is part of the logic_blocks
  const i = Blockly.Blocks['controls_if'].init;
  Blockly.Blocks['controls_if'].init = function () { i.call(this); this.setColour(Blockly.Msg.FLOW_RGB); };
  const j = Blockly.Blocks['text_print'].init;
  Blockly.Blocks['text_print'].init = function () { j.call(this); this.setColour(Blockly.Msg.ACTIONS_RGB); };

  workspace.addChangeListener((event) => {
    if (suppressSave) return

    // Only store meaningful changes
    if (
      event.type === Blockly.Events.BLOCK_CREATE ||
      event.type === Blockly.Events.BLOCK_DELETE ||
      event.type === Blockly.Events.BLOCK_CHANGE ||
      event.type === Blockly.Events.BLOCK_MOVE ||
      event.type === Blockly.Events.BLOCK_FIELD_INTERMEDIATE_CHANGE ||
      event.type === Blockly.Events.VIEWPORT_CHANGE
    ) {
      storeCode()
      saveWorkspace() // we need to save it on every change, since the split can make changes
    }
  })
}

onMounted(() => {
  peripheralStore.loadFromLocalStorage()
  loadCustomModules(peripheralStore.peripherals)
  codeStore.loadFromLocalStorage()
  initBlockly("clean")
})

// When user selects different view
watch(() => codeStore.split, (newVal, oldVal) => {
  if (newVal == 0) { //python
    // We need to close the blockly elements
    // that are not inside the Blockly-div 
    // (eg dropdowns). Otherwise they will still
    // be rendered in the python tab.
    Blockly.hideChaff()
    suppressSave = true
  }

  if (oldVal == 0) { // from python to (partial) blockly
    initBlockly("split_changed")
    suppressSave = false
  }
})

// When codeStore block changed (ie user loaded from file)
watch(() => codeStore.blockly, (newVal) => {
  workspaceDOM = Blockly.Xml.workspaceToDom(workspace)
  const currentCode = Blockly.Xml.domToText(workspaceDOM)
  if (newVal != currentCode) {
    initBlockly("blockly_loaded")
  }
})

// When user changes locale
watch(locale, () => {
  initBlockly("lang_changed")
})

// When settings change or user connects (ie settings change)
watch(() => peripheralStore.peripherals, (newVal, oldVal) => {
  if (JSON.stringify(newVal) === JSON.stringify(oldVal)) { return }

  loadCustomModules(peripheralStore.peripherals)
  initBlockly("settings_changed")
})

defineExpose({
  undo,
  redo,
  resize,
  storeCode
})

</script>