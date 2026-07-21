<template>
  <div class="wrapper">
    <nav class="navbar navbar-expand-sm fixed-top">
      <NuxtLayout />
    </nav>

    <main class="flex-grow-1">
      <NuxtPage />
    </main>

    <!--
    <footer>
      <span class="mirte">MIRTE</span> {{ $t("footer") }} TU Delft -
      <NuxtLink to="mailto:info@mirte.org">contact</NuxtLink> -
      <NuxtLink to="https://github.com/mirte-robot" target="_blank" rel="noopener noreferrer">github</NuxtLink> -
      <NuxtLink :to="localePath({ path: '/privacy' })" >privacy</NuxtLink>
    </footer>
  -->

    <ToastContainer />


  </div>
</template>

<script setup>
import ToastContainer from '~/components/ToastContainer.vue'
</script>

<style>
html,
body,
#__nuxt {
  height: 100%;
}

.wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}


main {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}
</style>