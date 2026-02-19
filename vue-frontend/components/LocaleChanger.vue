<script setup>
import { useI18n } from 'vue-i18n'
import { useSwitchLocalePath } from '#i18n'
import nlFlag from 'flag-icons/flags/4x3/nl.svg?url'
import gbFlag from 'flag-icons/flags/4x3/gb.svg?url'

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const langs = [
  { code: "en", text: "English", flag: gbFlag },
  { code: "nl", text: "Nederlands", flag: nlFlag },
]
</script>

<template>
  <a class="nav-link dropdown-toggle locale-selector"
     href="#"
     id="localeDropdown"
     role="button"
     data-bs-toggle="dropdown"
     aria-expanded="false">
    <img class="fi" :src="langs.find(l => l.code === locale).flag" alt="flag">
  </a>
  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="localeDropdown">
    <li v-for="lang in langs" :key="lang.code">
      <NuxtLink class="dropdown-item" :to="switchLocalePath(lang.code)">
        <img class="fi" :src="`${lang.flag}`" alt="flag">
        {{ lang.text }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.fib, .fi {
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
}

.fi {
  position: relative;
  display: inline-block;
  width: 1.333333em;
  line-height: 1em;
}
.fi:before {
  content: " ";
}
.fi.fis {
  width: 1em;
}
</style>