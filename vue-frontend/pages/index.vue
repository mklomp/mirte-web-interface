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

import { useLocalePath } from '#i18n'
const localePath = useLocalePath()

const isBlockly = ref(true)
const blocklyEditor = ref(null)
const pythonEditor = ref(null)

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


   <div class="row p-4 h-100">

      <div class="col-3 p-2 h-100" style="overflow: hidden;">
         <div class="layoutbox rounded h-100" style="overflow: hidden; display: flex; flex-flow: column;">

            <div class="text-black p-2 h3 m-0 layoutbox-title w-100 background-secondary">
               {{ $t('main.sensors') }}
            </div>


            <div class="h-100" style="overflow-y: auto;">
               <Sensors />
            </div>


         </div>
      </div>




      <div class="col-6 p-2 h-100" style="overflow: hidden;">
         <div class="layoutbox rounded h-100" style="overflow: hidden; display: flex; flex-flow: column;">

            <div class="text-black p-2 h3 m-0 layoutbox-title w-100 background-secondary">
               {{ $t('main.programming') }}

               <button v-bind:class="isBlockly ? 'code-active' : ''" class="btn btn-outline-light mr-2"
                  @click="isBlockly = true;">
                  {{ $t('programming.blockly') }}
               </button>

               <button v-bind:class="!isBlockly ? 'code-active' : ''" class="btn btn-outline-light mr-2"
                  @click="isBlockly = false;">
                  {{ $t('programming.python') }}
               </button>




               <div style="float: right">
                  <ControlButtons @undo="undo" @redo="redo" />
               </div>

            </div>


            <div v-show="isBlockly" class="h-100">
               <Blockly :active="isBlockly" ref="blocklyEditor"/>
            </div>




            <div v-show="!isBlockly" class="h-100">
               <Codemirror :active="!isBlockly" ref="pythonEditor" />
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