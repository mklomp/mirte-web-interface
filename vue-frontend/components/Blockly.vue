<template>
  <div ref="blocklyDiv" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as Blockly from 'blockly'
import { pythonGenerator } from "blockly/python"

import { useCodeStore } from "@/stores/user_code"

// Blockly languages
import * as En from 'blockly/msg/en'
import * as Nl from 'blockly/msg/nl'

const blocklyDiv = ref(null)
let workspace = null

const { locale } = useI18n()
const store = useCodeStore()

function loadBlocklyMessages(lang) {
  if (lang === 'nl') Blockly.setLocale(Nl)
  else Blockly.setLocale(En)
}


function saveWorkspace() {
  if (!workspace) return

  const dom = Blockly.Xml.workspaceToDom(workspace)
  store.setBlockly(Blockly.Xml.domToText(dom))
  store.setBlocklyDOM(dom)
  store.setPython(pythonGenerator.workspaceToCode(workspace))

  /*const toolbox = workspace.getToolbox()
  if (toolbox) {
    const item = toolbox.getSelectedItem()
    if (item) selectedCategory = item.id_
  }*/
}

function restoreWorkspace() {
  if (!store.blockly_dom) return

  Blockly.Xml.domToWorkspace(store.blockly_dom, workspace)
}


function initBlockly() {

  var toolbox_item = null
  if (workspace) {
    workspace.dispose()
    toolbox_item = workspace.getToolbox().getSelectedItem()
  }

  loadBlocklyMessages(locale.value)

  workspace = Blockly.inject(blocklyDiv.value, {
    toolbox: `<xml>
    <category name="Logic" categorystyle="logic_category">
      <block type="controls_if"></block>
    </category>

    <category name="Loops">
      <block type="controls_repeat_ext"></block>
    </category>
  </xml>
  `
  })

  restoreWorkspace()
  if (toolbox_item) workspace.setToolbox().setSelectedItem(toolbox_item)

  workspace.addChangeListener(() => {
    saveWorkspace()
  })

}

onMounted(() => {
  initBlockly()
})

watch(locale, () => {
  initBlockly()
})
</script>