<template>
  <div ref="editorContainer" class="editor" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { EditorView, basicSetup } from "codemirror"
import { undo, redo } from "@codemirror/commands"
import { python } from "@codemirror/lang-python"
import { useCodeStore } from "@/stores/user_code"

const editorContainer = ref(null)
let editor = null // could not be ref due to undo/redo
const codeStore = useCodeStore()
const connectionStore = useConnectionStore()
let pythonCode = (connectionStore.status == "connected") ? codeStore.python : ""

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
      EditorView.updateListener.of(update => {
        const newCode = update.state.doc.toString()
        if (update.docChanged && 
            codeStore.active == "python" &&
            newCode != codeStore.python) {
          codeStore.setPython(newCode)
        }
      })
    ]
  })

})

watch(
  () => codeStore.python,
  (newCode) => {

    if (!editor || connectionStore.status != "connected") return

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

watch(() => connectionStore.status, async () => {
  if (!editor) return

  if (connectionStore.status == "connected"){
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: codeStore.python
        }
      })
  }
})

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