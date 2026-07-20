import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import the icons you need
import { faUndo,  faRedo, faPlay, faStop, faSave, faFolderOpen, faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faTimesCircle, faPowerOff, faTrash, faPlug, faSliders, faRobot, faCheck, faPuzzlePiece, faTableColumns, faCode, faGamepad, faExpand, faCompress} from '@fortawesome/free-solid-svg-icons'

library.add(faUndo, faRedo, faPlay, faStop, faSave, faFolderOpen, faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faTimesCircle, faPowerOff, faTrash, faPlug, faSliders, faRobot, faCheck, faPuzzlePiece, faTableColumns, faCode, faGamepad, faExpand, faCompress )

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})