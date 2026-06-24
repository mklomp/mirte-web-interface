<script setup>
useHead({
   title: 'webIDE - MIRTE',
   meta: [
      {
         name: 'description',
         content: 'Programming environment for the MIRTE robot. Using Blocky, Python and ROS.'
      }
   ]
})

import { usePeripheralStore } from '@/stores/peripherals'
import { useConnectionStore } from '@/stores/connection'
import { useModal } from '~/composables/useModal'
import IntroModal from '~/components/modals/intro.vue'
import { useCodeStore } from "@/stores/user_code"

import { ref, computed, watch, onMounted } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const connectionStore = useConnectionStore()
const { openModal, closeModal } = useModal()
const codeStore = useCodeStore()
const peripheralStore = usePeripheralStore()

const blocklyEditor = ref(null)
const pythonEditor = ref(null)
const blocklyContainer = ref()


const split = ref(60)
const lastSplit = ref(60)


const splitThemeClass = computed(() =>
   split.value != 0 && split.value != 100 ? 'default-theme' : ''
)

const viewMode = computed({
   get() {
      if (split.value == 100) return 'blockly'
      if (split.value == 0) return 'python'
      return 'split'
   },
   set(val) {
      if (val == 'blockly') {
         split.value = 100
      } else if (val == 'python') {
         split.value = 0
      } else {
         split.value = lastSplit.value
      }
   }
})

onMounted(() => {
   split.value = codeStore.split
   const observer = new ResizeObserver(() => {
      blocklyEditor.value?.resize()
   })

   observer.observe(blocklyContainer.value)
})

function onResize(event) {
   const newSize = event.panes[0].size
   if (typeof newSize === 'number') {
      split.value = Math.round(newSize)
   }
}

watch(split, (val) => {
   codeStore.setSplit(val)
   if (val > 0 && val < 100) {
      lastSplit.value = val
   }
})

watch(
   () => peripheralStore.peripherals,
   (settings) => {
      if (Object.keys(settings).length < 2) {
         openModal(IntroModal)
      } else {
         closeModal()
      }
   },
   { deep: true, immediate: true }
)

function undo() {
   blocklyEditor.value.undo()
   pythonEditor.value.undoAction()
}

function redo() {
   blocklyEditor.value.redo()
   pythonEditor.value.redoAction()
}
</script>

<template>
   <ModalContainer />

   <div class="row p-4 h-100">

      <div v-if="false" class="col-3 p-2 h-100" style="overflow: hidden;">
         <div class="layoutbox rounded h-100" style="overflow: hidden; display: flex; flex-flow: column;">

            <div class="text-black p-2 h3 m-0 layoutbox-title w-100 background-secondary">
               {{ $t('main.sensors') }}
            </div>

            <div class="h-100" style="overflow-y: auto;">
               <Sensors />
            </div>

         </div>
      </div>

      <div class="col-9 p-2 h-100" style="overflow: hidden;">
         <div class="layoutbox rounded" style="overflow: hidden; display: flex; flex-direction: column; height: 100%">

            <div class="layoutbox-title text-black p-2 h3 m-0 w-100 background-secondary" style="flex: 0 0 auto;">
               {{ $t('main.programming') }}

               <div class="btn-group" role="group" aria-label="View mode">

                  <input
                     type="radio"
                     class="btn-check"
                     name="viewMode"
                     id="blockly"
                     autocomplete="off"
                     value="blockly"
                     v-model="viewMode"
                  >
                  <label class="btn btn-outline-light" for="blockly" data-bs-toggle="tooltip" title="Visual block-based programming">
                     <ClientOnly><FontAwesomeIcon icon="puzzle-piece" /></ClientOnly>
                  </label>

                  <input
                     type="radio"
                     class="btn-check"
                     name="viewMode"
                     id="split"
                     autocomplete="off"
                     value="split"
                     v-model="viewMode"
                  >
                  <label class="btn btn-outline-light" for="split">
                     <ClientOnly><FontAwesomeIcon icon="table-columns" /></ClientOnly>
                  </label>

                  <input
                     type="radio"
                     class="btn-check"
                     name="viewMode"
                     id="python"
                     autocomplete="off"
                     value="python"
                     v-model="viewMode"
                  >
                  <label class="btn btn-outline-light" for="python">
                     <ClientOnly><FontAwesomeIcon icon="code" /></ClientOnly>
                  </label>

               </div>

               <div style="float: right">
                  <ControlButtons @undo="undo" @redo="redo" />
               </div>

            </div>

            <div class="layoutbox-content" style="flex: 1 1 auto; min-height: 0; padding: 0; margin: 0;">
               <Splitpanes :class="splitThemeClass" @resized="onResize">
                  <Pane :size="split">
                     <div ref="blocklyContainer" class="h-100">
                        <Blockly ref="blocklyEditor" />
                     </div>
                  </Pane>
                  <Pane :size="100 - split">
                     <div class="h-100">
                        <Codemirror ref="pythonEditor" />
                     </div>
                  </Pane>
               </Splitpanes>
            </div>

         </div>
      </div>

      <div class="col-3 p-2 h-100" style="overflow: hidden;">
         <div class="layoutbox rounded h-100" style="overflow: hidden; display: flex; flex-flow: column;">

            <div class="text-black p-2 h3 m-0 layoutbox-title w-100 background-secondary">
               {{ $t('main.actuators') }}
            </div>

            <div class="h-100" style="overflow-y: auto;">
               <Actuators />
            </div>

         </div>
      </div>

   </div>
</template>