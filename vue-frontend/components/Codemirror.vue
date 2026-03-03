<template>
  <div class="d-flex flex-column h-100">
    <div ref="editorContainer" class="editor d-flex flex-column h-100"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { EditorView, basicSetup } from "codemirror"
import { python } from "@codemirror/lang-python"

const editorContainer = ref(null)



export default {
  props: ['visible'],
  data: () => ({
    editor: Object
  }),
  methods: {
    makeMarker: () => {
      var marker = document.createElement("div");
      marker.style.color = "#822";
      marker.innerHTML = "⇨";
      return marker;
    }
  },
  mounted() {
    this.editorContainer = this.$refs.editorContainer
    const codeStore = useCodeStore()

    this.editor = new EditorView({
      parent: this.editorContainer,
      doc: codeStore.python, // initial value from store
      extensions: [
        basicSetup,
        python(),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            // update store whenever user types
            codeStore.setPython(update.state.doc.toString())
          }
        })
      ]
    })

  },
  watch: {
    visible(newVal) {
      if (newVal && this.editor) {
        this.$nextTick(() => {
          //this.editor.refresh();
        });
      }
    },
    '$store.getters.getCode': function(newVal, oldVal) {
       if (newVal != this.editor.getDoc().getValue()){
          this.editor.setValue(newVal)
       }
    },
    '$store.getters.getLinenumber': function(newVal, oldVal){
      this.editor.clearGutter("linetracer");
      this.editor.setGutterMarker(newVal-1, "linetracer", this.makeMarker());
    }
  }
}
</script>
