<template>
    <div>
        <button :disabled="isUndoDisabled" class="btn btn-outline-light mr-2" :title="$t('programming.undo')"
            @click="$emit('undo')">
            <ClientOnly>
                <FontAwesomeIcon icon="undo" />
            </ClientOnly>
        </button>

        <button :disabled="isRedoDisabled" class="btn btn-outline-light mr-2" :title="$t('programming.redo')"
            @click="$emit('redo')">
            <ClientOnly>
                <FontAwesomeIcon icon="redo" />
            </ClientOnly>
        </button>

        <span class="nav-spacer"></span>

        <span :title="$t('programming.start')" style="display: inline-block;">
            <button :disabled="!isPlayEnabled" class="btn btn-outline-light mx-2" @click="control('start_initiated')">
                <ClientOnly>
                    <FontAwesomeIcon icon="play" />
                </ClientOnly>
            </button>
        </span>

        <span :title="$t('programming.stop')" style="display: inline-block;">
            <button :disabled="!isStopEnabled" class="btn btn-outline-light mr-2" @click="control('stop_initiated')">
                <ClientOnly>
                    <FontAwesomeIcon icon="stop" />
                </ClientOnly>
            </button>
        </span>

        <span class="nav-spacer"></span>

        <button href="#" class="btn btn-outline-light mx-2" :title="$t('programming.save')" @click="download">
            <ClientOnly>
                <FontAwesomeIcon icon="save" />
            </ClientOnly>
        </button>

        <button class="btn btn-outline-light mr-2" :title="$t('programming.open')" @click="openFileWindow">
            <ClientOnly>
                <FontAwesomeIcon :icon="['fas', 'folder-open']" />
            </ClientOnly>
            <input ref="file_input" @change="upload" type="file" name="name" style="display: none;" />
        </button>

    </div>
</template>


<script setup>
const emit = defineEmits(['undo', 'redo'])

const programmingState = useState('programming-state')


const isPlayEnabled = computed(() => programmingState.value === 'idle')
const isStopEnabled = computed(() => programmingState.value === 'running')

function control(command) {
    programmingState.value = command;
}

/*
return {
    programmingState,
    isPlayEnabled,
    isStopEnabled
}
*/

</script>


<script>

export default {

    methods: {

        openFileWindow() {
            this.$refs.file_input.value = null;
            if (this.$parent.language == 'blockly') {
                this.$refs.file_input.accept = ".xml";
            } else {
                this.$refs.file_input.accept = ".py";
            }
            this.$refs.file_input.click()
        },

        upload() {
            var fr = new FileReader();

            fr.onload = () => {
                if (this.$parent.language == 'blockly') {
                    // this.$store.dispatch('setBlockly', fr.result)
                } else {
                    // this.$store.dispatch('setCode', fr.result)
                }
            }

            if (this.$refs.file_input.files.length > 0) {
                fr.readAsText(this.$refs.file_input.files[0]);
            }

        },

        download() {
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
        isUndoDisabled: function () {
            return false; // TODO: determine strategy 
        },
        isRedoDisabled: function () {
            return false; // TODO: determine strategy
        },
        isPauseDisabled: function () {
            // return this.$store.getters.getExecution != "running" || this.$store.getters.getExecution == "disconnected";
        },
        isStepDisabled: function () {
            // return this.$store.getters.getExecution != "paused" || this.$store.getters.getExecution == "disconnected";
        }
    }

}
</script>
