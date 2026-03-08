<template>
  <div class="d-flex flex-column h-100">
    <div ref="editorContainer" class="editor d-flex flex-column h-100"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { EditorView, basicSetup } from "codemirror"
import { python } from "@codemirror/lang-python"
import { useCodeStore } from "@/stores/user_code"

const props = defineProps({
  visible: Boolean
})

const editorContainer = ref(null)
const editor = ref(null)

const codeStore = useCodeStore()

onMounted(() => {

  editor.value = new EditorView({
    parent: editorContainer.value,
    doc: codeStore.python,

    extensions: [
      basicSetup,
      python(),

      EditorView.updateListener.of(update => {
        if (update.docChanged && props.visible) {
          codeStore.setPython(update.state.doc.toString())
        }
      })
    ]
  })

})

watch(
  () => codeStore.python,
  (newCode) => {

    if (!editor.value || props.visible) return

    const current = editor.value.state.doc.toString()

    if (current !== newCode) {
      editor.value.dispatch({
        changes: {
          from: 0,
          to: current.length,
          insert: newCode
        }
      })
    }
  }
)

</script>