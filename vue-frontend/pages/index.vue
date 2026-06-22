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


const connectionStore = useConnectionStore()
const { openModal, closeModal } = useModal()
const codeStore = useCodeStore()
const peripheralStore = usePeripheralStore()

const isBlockly = ref(true)
const blocklyEditor = ref(null)
const pythonEditor = ref(null)

onMounted(() => {
  isBlockly.value = codeStore.active == "blockly"
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

watch(() => codeStore.active, (newVal) => {
   isBlockly.value = newVal == "blockly"
})

function undo() {
   if (isBlockly.value) {
      blocklyEditor.value.undo()
   } else {
      pythonEditor.value.undoAction()
   }
}

function redo() {
   if (isBlockly.value) {
      blocklyEditor.value.redo()
   } else {
      pythonEditor.value.redoAction()
   }
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

               <button v-bind:class="isBlockly ? 'code-active' : ''" class="btn btn-outline-light mx-2"
                  @click="codeStore.setActive('blockly')">
                  {{ $t('programming.blockly') }}
               </button>

               <button v-bind:class="!isBlockly ? 'code-active' : ''" class="btn btn-outline-light mr-2"
                  @click="codeStore.setActive('python')">
                  {{ $t('programming.python') }}
               </button>

               <div style="float: right">
                  <ControlButtons @undo="undo" @redo="redo" />
               </div>

            </div>

            <div class="layoutbox-content" style="flex: 1 1 auto; min-height: 0; padding: 0; margin: 0;">
               <div v-show="isBlockly" class="h-100">
                  <Blockly ref="blocklyEditor" />
               </div>

               <div v-show="!isBlockly" class="h-100">
                  <Codemirror ref="pythonEditor" />
               </div>
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