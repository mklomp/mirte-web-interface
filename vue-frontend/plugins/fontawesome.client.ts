import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import the icons you need
import { faUndo,  faRedo, faPlay, faStop, faSave, faFolderOpen, faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faTimesCircle, faPowerOff} from '@fortawesome/free-solid-svg-icons'

library.add(faUndo, faRedo, faPlay, faStop, faSave, faFolderOpen, faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faTimesCircle, faPowerOff )

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})