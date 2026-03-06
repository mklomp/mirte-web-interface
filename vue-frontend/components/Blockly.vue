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
import CustomNl from "@/locales/nl.json"
import CustomEn from "@/locales/en.json"

// Blockly languages
import * as En from 'blockly/msg/en'
import * as Nl from 'blockly/msg/nl'

const blocklyDiv = ref(null)
let workspace = null

const { locale } = useI18n()
const store = useCodeStore()

// Blockly state
let workspaceDOM = null
let flyout_visible = false
let scale = 1
let scrollX = 0
let scrollY = 0

function loadBlocklyMessages(lang) {
  if (lang === 'nl') {
    Blockly.setLocale(Nl)
    Blockly.setLocale(CustomNl.blockly)
  } else {
    Blockly.setLocale(En)
    Blockly.setLocale(CustomEn.blockly)
  }
}

// Store code to Pinia store (which saves it to localStorage)
function storeCode(){
  if (!workspace) return

  workspaceDOM = Blockly.Xml.workspaceToDom(workspace)
  store.setBlockly(Blockly.Xml.domToText(workspaceDOM))
  store.setPython(pythonGenerator.workspaceToCode(workspace))
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
// - At a language change
// - After refresh (or any revisit, so with something in localStorage)
function initBlockly(lang_changed = false) {

  // Set workspaceDOM from previous session
  if (store.blockly){
    workspaceDOM = Blockly.utils.xml.textToDom(store.blockly)
  }

  // Save and clear workspace if called on language change
  if (lang_changed) {
    saveWorkspace()
    workspace.dispose()
  }

  loadBlocklyMessages(locale.value)

  workspace = Blockly.inject(blocklyDiv.value, {
    toolbox: getToolbox(),
    zoom: {  
      controls: true,
      wheel: true,
      startScale: 0.8,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2
    },
    renderer: 'zelos'
  })

  // Restore workspace (including location), or scroll to center
  if (workspaceDOM) restoreWorkspace()
  if (!lang_changed) workspace.scrollCenter()

  workspace.addChangeListener((event) => {
    // Ignore UI events (scroll, selection, toolbox open, etc.)
    if (event.isUiEvent) return

    // Only store meaningful changes
    if (
      event.type === Blockly.Events.BLOCK_CREATE ||
      event.type === Blockly.Events.BLOCK_DELETE ||
      event.type === Blockly.Events.BLOCK_CHANGE ||
      event.type === Blockly.Events.BLOCK_MOVE
    ) {
      storeCode()
    }
  })

}

onMounted(() => {
  store.loadFromLocalStorage()
  initBlockly()
})

watch(locale, () => {
  initBlockly(true)
})
</script>