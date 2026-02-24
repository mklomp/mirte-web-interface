<template>
    <div>
        <button :disabled="isUndoDisabled" class="btn btn-outline-light mr-2"
              :title="$t('programming.undo')"
            @click="control('undo')"
        >
            <FontAwesomeIcon icon="undo" />
        </button>

        <button :disabled="isRedoDisabled" class="btn btn-outline-light mr-2"
            :title="$t('programming.redo')"
            @click="control('redo')"
        >
            <FontAwesomeIcon icon="redo" />
        </button>

        <span class="nav-spacer"></span>

        <span  :title="$t('programming.start')" style="display: inline-block;">
        <button :disabled="!isPlayEnabled" class="btn btn-outline-light mx-2" 
            @click="control('start_initiated')">
            <FontAwesomeIcon icon="play" />
        </button>
        </span>

<!--
        <span v-b-tooltip.hover :title="$t('programming.pause')" style="display: inline-block;">
        <button :disabled="isPauseDisabled" 
            @click="control('pause')" class="btn btn-outline-light mr-2">
            <i class="fa fa-pause"></i>
        </button>
        </span>

        <span v-b-tooltip.hover :title="$t('programming.step')" style="display: inline-block;">
        <button :disabled="isStepDisabled" class="btn btn-outline-light mr-2" 
            @click="control('step')">
            <i class="fa fa-step-forward"></i>
        </button>
        </span>
-->
        <span :title="$t('programming.stop')" style="display: inline-block;">
	<button :disabled="!isStopEnabled" class="btn btn-outline-light mr-2" 
            @click="control('stop_initiated')">
            <FontAwesomeIcon icon="stop" />
        </button>
        </span>

        <span class="nav-spacer"></span>

        <button href="#" class="btn btn-outline-light mx-2" 
   
            :title="$t('programming.save')" 
            @click="download"
        >
            <FontAwesomeIcon icon="save" />
        </button>

        <button class="btn btn-outline-light mr-2" 
       
            :title="$t('programming.open')" 
            @click="openFileWindow"
        >
            <FontAwesomeIcon :icon="['fas', 'folder-open']" />
            <input ref="file_input" @change="upload" type="file" name="name" style="display: none;" />
        </button>

    </div>
</template>

<script>

const programmingState = useState('programming-state')


export default {

    methods: {
        
        control(command) {
            programmingState.value = command;
        },
        openFileWindow(){
            this.$refs.file_input.value = null;
            if (this.$parent.language == 'blockly') {
                this.$refs.file_input.accept = ".xml";
            } else {
                this.$refs.file_input.accept = ".py";
            }
            this.$refs.file_input.click()
        },

        upload(){
            var fr=new FileReader(); 

            fr.onload = () => { 
                if (this.$parent.language == 'blockly') {
                   // this.$store.dispatch('setBlockly', fr.result)
                } else {
                   // this.$store.dispatch('setCode', fr.result)
                }
            } 

            if(this.$refs.file_input.files.length > 0){
                fr.readAsText(this.$refs.file_input.files[0]); 
            }
            
        },

        download(){
            if (this.$parent.language == 'blockly') {
                var text = localStorage.getItem("blockly");
                var filename = "mirte.xml";
            } else {
                //var text = this.$store.getters.getCode;
                var filename = "mirte.py";
            }
            
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);

        },


    },
    computed: {
       isUndoDisabled: function(){
           return false; // TODO: determine strategy 
       },
       isRedoDisabled: function(){
           return false; // TODO: determine strategy
       },
       isPlayEnabled: function(){
         return programmingState.value == "idle";
       },
       isPauseDisabled: function(){
         // return this.$store.getters.getExecution != "running" || this.$store.getters.getExecution == "disconnected";
       },
       isStepDisabled: function(){
         // return this.$store.getters.getExecution != "paused" || this.$store.getters.getExecution == "disconnected";
       },
       isStopEnabled: function(){
         return programmingState.value == "running";
       }
    }

}
</script>
