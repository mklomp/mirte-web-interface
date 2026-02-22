<template>
  <div class="h-100">
    <div ref="editorContainer" class="editor h-100"></div>
  </div>
</template>

<script>
//import codemirror from 'codemirror'
//import 'codemirror/mode/python/python.js'
//import 'codemirror/lib/codemirror.css'

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


/*
    this.editor = codemirror.fromTextArea(this.$refs.codemirror, {
      mode: "python",
      lineNumbers: true,
      autoRefresh: true,
      gutters: ["linetracer"],
      viewportMargin: Infinity
    });
    this.editor.on('change', editor => {
      this.$store.dispatch('setCode', editor.getValue())
    });
    this.editor.save()
    this.editor.setValue(this.$store.getters.getCode)
    */
  //}
  watch: {
    visible(newVal) {
      if (newVal && this.editor) {
        this.$nextTick(() => {
          this.editor.refresh();
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
