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

import { useMediaQuery } from '@vueuse/core'

import { usePeripheralStore } from '@/stores/peripherals'
import { useConnectionStore } from '@/stores/connection'
import { useModal } from '~/composables/useModal'
import IntroModal from '~/components/modals/intro.vue'
import { useCodeStore } from "@/stores/user_code"

import { ref, computed, watch, onMounted } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

const connectionStore = useConnectionStore()
const { openModal, closeModal, isOpen } = useModal()
const codeStore = useCodeStore()
const peripheralStore = usePeripheralStore()

const blocklyEditor = ref(null)
const pythonEditor = ref(null)
const blocklyContainer = ref()

const isMobile = useMediaQuery('(max-width: 900px)')
const split = ref(0)
const lastSplit = ref(60)
const splitHidden = ref(false)

const splitThemeClass = computed(() =>
   split.value != 0 && split.value != 100 ? 'default-theme' : ''
)

const pythonReadOnly = computed(() =>
   split.value != 0
)

const showSensors = computed(() => {
   return connectionStore.status == "connected" && connectionStore.transport == 'network'
})

const showActuators = computed(() => {
   return connectionStore.status == "connected"
})

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

   // Open modal
   if (Object.keys(peripheralStore.peripherals).length < 2) {
      openModal(IntroModal)
   }
})

function onResize(event) {
   const newSize = event.panes[0].size
   if (typeof newSize === 'number') {
      split.value = Math.round(newSize)
   }
}

watch(isMobile, (mobile) => {
   if (mobile && lastSplit.value == split.value) {
      splitHidden.value = true
      split.value = 100 // blockly
   } else if (!mobile && splitHidden.value) {
      split.value = lastSplit.value
      splitHidden.value = false // split
   }
})



watch(split, (val) => {
   codeStore.setSplit(val)
   if (val > 0 && val < 100) {
      lastSplit.value = val
   }
})



watch(
   () => peripheralStore.peripherals,
   (newVal, oldVal) => {
      if (JSON.stringify(newVal) != JSON.stringify(oldVal)) {
         if (Object.keys(newVal).length < 2) {
            openModal(IntroModal)
         } else {
            closeModal(IntroModal)
         }
      }
   }
)


watch(isOpen, (open) => {
   if (!open && Object.keys(peripheralStore.peripherals).length < 2) {
      openModal(IntroModal)
   }
})



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

   <div class="main-layout h-100">

      <div v-show="showSensors" class="sidebar sensors" style="overflow: hidden;">
         <div class="layoutbox rounded h-100" style="overflow: hidden; display: flex; flex-flow: column;">

            <div class="text-black p-1 h3 m-0 layoutbox-title w-100 background-secondary">
               {{ $t('main.sensors') }}
            </div>

            <div class="h-100" style="overflow-y: auto;">
               <Sensors />
            </div>

         </div>
      </div>

      <div class="programming-area" style="overflow: hidden;">
         <div class="layoutbox rounded" style="overflow: hidden; display: flex; flex-direction: column;">

            <div class="layoutbox-title text-black p-1 h3 m-0 w-100 background-secondary" style="flex: 0 0 auto;">
               {{ $t('main.programming') }}

               <div class="btn-group" role="group" aria-label="View mode">

                  <input type="radio" class="btn-check" name="viewMode" id="blockly" autocomplete="off" value="blockly"
                     v-model="viewMode">
                  <label class="btn btn-outline-light" for="blockly" data-bs-toggle="tooltip"
                     title="Visual block-based programming">
                     <ClientOnly>
                        <FontAwesomeIcon icon="puzzle-piece" />
                     </ClientOnly>
                  </label>


                  <input type="radio" class="btn-check split-btn" name="viewMode" id="split" autocomplete="off"
                     value="split" v-model="viewMode">
                  <label class="btn btn-outline-light split-btn" for="split">
                     <ClientOnly>
                        <FontAwesomeIcon icon="table-columns" />
                     </ClientOnly>
                  </label>


                  <input type="radio" class="btn-check" name="viewMode" id="python" autocomplete="off" value="python"
                     v-model="viewMode">
                  <label class="btn btn-outline-light" for="python">
                     <ClientOnly>
                        <FontAwesomeIcon icon="code" />
                     </ClientOnly>
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
                        <Codemirror :read_only="pythonReadOnly" ref="pythonEditor" />
                     </div>
                  </Pane>
               </Splitpanes>
            </div>

         </div>
      </div>

      <div v-show="showActuators" class="sidebar" style="overflow: hidden;">
         <div class="layoutbox rounded h-100" style="overflow: hidden; display: flex; flex-flow: column;">

            <div class="text-black p-1 h3 m-0 layoutbox-title w-100 background-secondary">
               {{ $t('main.actuators') }}
            </div>

            <div class="h-100" style="overflow-y: auto;">
               <Actuators />
            </div>

         </div>
      </div>

   </div>
</template>

<style scoped>
.main-layout {
   display: flex;
   height: 100%;
   gap: 0.5rem;
   padding: 0.5rem;
   overflow: auto;
}

.sidebar {
   width: 280px;
   flex-shrink: 0;
}

.programming-area {
   flex: 1;
   min-width: 0;
}

.programming-area> :first-child {
   height: 100%;
}

@media (max-width: 1300px) {
   .main-layout {
      flex-wrap: wrap;
   }

   .programming-area {
      order: 1;
      flex: 0 0 100%;
      width: 100%;
      min-height: 70vh;
   }

   .sidebar {
      order: 2;
      flex: 1 1 0;
      width: auto;
      min-width: 0;
   }
}

@media (max-width: 900px) {
   .split-btn {
      display: none;
   }
}

@media (max-width: 575px) {
   .sidebar {
      flex: 0 0 100%;
      width: 100%;
   }
}
</style>