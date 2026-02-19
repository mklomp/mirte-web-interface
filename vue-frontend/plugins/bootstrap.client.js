import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default defineNuxtPlugin(() => {
  // ensure this runs only on client
  if (process.client) {
    // attach for easy access from components
    window.bootstrap = bootstrap
  }
})