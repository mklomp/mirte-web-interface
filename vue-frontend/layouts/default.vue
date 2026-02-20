<script setup>
import { useLocalePath } from '#i18n'
const localePath = useLocalePath()
const head = useLocaleHead()

onMounted(() => {
  const { $connectRos } = useNuxtApp()
  $connectRos()
})

</script>

<template>
<Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
  <div class="container-fluid">
    <NuxtLink :to="localePath('index')" class="navbar-brand">
      <NuxtImg style="float: left; margin-right: 10px;" src="/images/mirte_logo.png" alt="MIRTE lite" height="45" width="45" format="webp"/>
      <h1>MIRTE</h1>
    </NuxtLink>
    <button aria-label="navbar-toggler" class="navbar-toggler" type="button" data-bs-toggle="collapse"
      data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-collapse"  id="navbarNavDropdown">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <NuxtLink :to="localePath({ path: '/settings' })" class="nav-link"> {{ $t("main.settings") }}
          </NuxtLink>
        </li>
<!--        <li class="nav-item">
          <NuxtLink :to="localePath({ path: '/programming' })" class="nav-link"> {{ $t("main.programming") }}
          </NuxtLink>
        </li> -->
        <li class="nav-item dropdown">
          <LocaleChanger/>
        </li>
      </ul>
    </div>
  </div>


</Html>
</template>
