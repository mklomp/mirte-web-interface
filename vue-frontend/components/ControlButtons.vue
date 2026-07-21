<template>
    <div>

        <!-- Desktop -->
        <div class="d-none d-md-flex">

            <button class="btn btn-outline-light mx-2" :title="$t('programming.undo')" @click="$emit('undo')">
                <ClientOnly>
                    <FontAwesomeIcon icon="undo" />
                </ClientOnly>
            </button>

            <button class="btn btn-outline-light me-2" :title="$t('programming.redo')" @click="$emit('redo')">
                <ClientOnly>
                    <FontAwesomeIcon icon="redo" />
                </ClientOnly>
            </button>

            <span class="nav-spacer"></span>

            <span :title="$t('programming.start')" style="display: inline-block;">
                <button :disabled="!isPlayEnabled" class="btn btn-outline-light mx-2" @click="startCode">
                    <ClientOnly>
                        <FontAwesomeIcon icon="play" />
                    </ClientOnly>
                </button>
            </span>

            <span :title="$t('programming.stop')" style="display: inline-block;">
                <button :disabled="!isStopEnabled" class="btn btn-outline-light me-2" @click="stopCode">
                    <ClientOnly>
                        <FontAwesomeIcon icon="stop" />
                    </ClientOnly>
                </button>
            </span>

            <span class="nav-spacer"></span>

            <button class="btn btn-outline-light mx-2" :title="$t('programming.save')" @click="save">
                <ClientOnly>
                    <FontAwesomeIcon icon="save" />
                </ClientOnly>
            </button>

            <button class="btn btn-outline-light mr-2" :title="$t('programming.open')" @click="openFileWindow">
                <ClientOnly>
                    <FontAwesomeIcon :icon="['fas', 'folder-open']" />
                </ClientOnly>
            </button>

        </div>

        <!-- Mobile / narrow -->
        <div class="d-flex d-md-none align-items-center flex-wrap">

            <span :title="$t('programming.start')">
                <button :disabled="!isPlayEnabled" class="btn btn-outline-light mx-2" @click="startCode">
                    <ClientOnly>
                        <FontAwesomeIcon icon="play" />
                    </ClientOnly>
                </button>
            </span>

            <span :title="$t('programming.stop')">
                <button :disabled="!isStopEnabled" class="btn btn-outline-light" @click="stopCode">
                    <ClientOnly>
                        <FontAwesomeIcon icon="stop" />
                    </ClientOnly>
                </button>
            </span>

            <div class="dropdown">
                <button class="btn btn-outline-light mx-2" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <ClientOnly>
                        <FontAwesomeIcon icon="bars" />
                    </ClientOnly>
                </button>

                <ul class="dropdown-menu dropdown-menu-end">

                    <li>
                        <button class="dropdown-item" @click="$emit('undo')">
                            <FontAwesomeIcon icon="undo" class="me-2" />
                            {{ $t('programming.undo') }}
                        </button>
                    </li>

                    <li>
                        <button class="dropdown-item" @click="$emit('redo')">
                            <FontAwesomeIcon icon="redo" class="me-2" />
                            {{ $t('programming.redo') }}
                        </button>
                    </li>

                    <li>
                        <hr class="dropdown-divider">
                    </li>

                    <li>
                        <button class="dropdown-item" @click="save">
                            <FontAwesomeIcon icon="save" class="me-2" />
                            {{ $t('programming.save') }}
                        </button>
                    </li>

                    <li>
                        <button class="dropdown-item" @click="openFileWindow">
                            <FontAwesomeIcon :icon="['fas', 'folder-open']" class="me-2" />
                            {{ $t('programming.open') }}
                        </button>
                    </li>

                </ul>
            </div>

        </div>

        <input ref="file_input" @change="upload" type="file" name="name" style="display: none;" />

    </div>
</template>


<script setup>

import { useCodeStore } from "@/stores/user_code"
const codeStore = useCodeStore()
const connectionStore = useConnectionStore()
const { startCode, stopCode } = useConnection()

const file_input = ref(null)

const emit = defineEmits(['undo', 'redo'])

const programmingState = useState('programming-state')

const isPlayEnabled = computed(() => programmingState.value === 'idle' && connectionStore.status === "connected" && connectionStore.ros_status == "connected")
const isStopEnabled = computed(() => programmingState.value === 'running' && connectionStore.status === "connected" && connectionStore.ros_status == "connected")

function control(command) {
    programmingState.value = command;
}


function save() {
    console.log(codeStore.split)
    if (codeStore.split != 0) {
        var text = codeStore.blockly;
        var filename = "mirte.xml";
    } else {
        var text = codeStore.python;
        var filename = "mirte.py";
    }

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

}



function openFileWindow() {
    if (!file_input.value) return

    file_input.value.value = ""

    file_input.value.accept = codeStore.split != 0 ? ".xml" : ".py"
    file_input.value.click()
}

function upload(event) {
    const input = event.target
    const files = input.files

    if (!files || files.length === 0) return

    const fr = new FileReader()

    fr.onload = () => {
        if (codeStore.split != 0) {
            codeStore.setBlockly(fr.result, true)
        } else {
            codeStore.setPython(fr.result)
        }
    }

    fr.readAsText(files[0])
}

</script>