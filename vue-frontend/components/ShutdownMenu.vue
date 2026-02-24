<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const busy = ref(false)

function shutdown() {
  if (confirm(t('main.shutdown_confirm'))) {
    busy.value = true

    fetch(`http://192.168.43.1/api/shutdown`)
      .then(res => res.text())
      .then(() => {
        alert(t('main.shutdown_success'))
        busy.value = false
      })
  }
}
</script>

<template>
  <a
    class="nav-link dropdown-toggle"
    href="#"
    id="localeDropdown"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    <ClientOnly>
      <FontAwesomeIcon icon="power-off" />
    </ClientOnly>
  </a>

  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="localeDropdown">
    <li>
      <!-- Use button instead of NuxtLink -->
      <button class="dropdown-item" @click="shutdown">
        <ClientOnly>
          <FontAwesomeIcon icon="power-off" />
        </ClientOnly>
        Shutdown
      </button>
    </li>
  </ul>
</template>