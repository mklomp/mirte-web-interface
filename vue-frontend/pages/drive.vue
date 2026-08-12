<template>
  <ModalContainer />

  <div class="control-layout">
    <div class="pane">
      <Camera :expanded="true" />
    </div>

    <div class="pane">
      <div class="rounded background-tertiary p-3 h-100" @contextmenu.prevent>
        <div class="h5">
          {{ $t("settings.drive") }}

          <NuxtLink :to="{ path: '/', query: route.query }" class="btn btn-sm float-end">
            <ClientOnly>
              <font-awesome-icon icon="fa-compress" />
            </ClientOnly>
          </NuxtLink>
        </div>

        <DriveJoystick />
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped>
.control-layout {
  height: 100%;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
}

.pane {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

@media (orientation: landscape) {
  .control-layout {
    flex-direction: row;
  }
}

@media (orientation: portrait) {
  .control-layout {
    flex-direction: column;
  }
}
</style>
