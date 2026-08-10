<template>
  <div ref="editorContainer" class="editor" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { EditorView, basicSetup } from "codemirror"
import { undo, redo } from "@codemirror/commands"
import { python } from "@codemirror/lang-python"
import { EditorState } from "@codemirror/state"
import { useCodeStore } from "@/stores/user_code"

import { Compartment } from "@codemirror/state"

const { addToast } = useToast()
const { $i18n } = useNuxtApp()

const readOnlyCompartment = new Compartment()
const editableCompartment = new Compartment()


const editorContainer = ref(null)
let editor = null // could not be ref due to undo/redo
let suppressStore = false
const codeStore = useCodeStore()
let pythonCode = codeStore.python

const props = defineProps({
  read_only: Boolean
})


function undoAction() {
  undo(editor)
}

function redoAction() {
  redo(editor)
}

onMounted(() => {

  editor = new EditorView({
    parent: editorContainer.value,
    doc: pythonCode,

    extensions: [
      basicSetup,
      python(),
      readOnlyCompartment.of(EditorState.readOnly.of(props.read_only)),
      editableCompartment.of(EditorView.editable.of(!props.read_only)),
      EditorView.updateListener.of(update => {
        if (suppressStore) return
        const newCode = update.state.doc.toString()
        if (update.docChanged && newCode != codeStore.python) {
          codeStore.setPython(newCode)
          if (!useState("python-user-modified").value) {
            addToast($i18n.t('toast.python-changed'), "warning", "python-changed", -1)
          }
          useState("python-user-modified").value = true;
        }
      })
    ]
  })

})

watch(
  () => props.read_only,
  (newVal) => {
    if (!editor) return

    editor.dispatch({
      effects: [
        readOnlyCompartment.reconfigure(
          EditorState.readOnly.of(newVal)
        ),
        editableCompartment.reconfigure(
          EditorView.editable.of(!newVal)
        )
      ]
    })
  }
)

watch(
  () => codeStore.python,
  (newCode) => {

    if (!editor) return

    const current = editor.state.doc.toString()

    if (current !== newCode) {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: newCode
        }
      })
    }
  }
)

defineExpose({
  undoAction,
  redoAction
})


</script>

<style scoped>
:deep(.cm-editor) {
  height: 100%;
}
</style>