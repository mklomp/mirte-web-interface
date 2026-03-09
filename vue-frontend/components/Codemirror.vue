<template>
  <div class="d-flex flex-column h-100">
    <div ref="editorContainer" class="editor d-flex flex-column h-100"></div>
  </div>
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

function undoAction() {
  undo(editor)
}

function redoAction() {
  redo(editor)
}

onMounted(() => {

  editor = new EditorView({
    parent: editorContainer.value,
    doc: codeStore.python,

    extensions: [
      basicSetup,
      python(),
      EditorView.updateListener.of(update => {
        if (update.docChanged && codeStore.active == "python") {
          codeStore.setPython(update.state.doc.toString())
        }
      })
    ]
  })

})

watch(
  () => codeStore.python,
  (newCode) => {

    if (!editor || codeStore.active == "python") return

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