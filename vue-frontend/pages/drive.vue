<template>
  <ModalContainer />

  <div class="row m-0 align-items-stretch">

    <div class="col-12 col-md-6 p-2 d-flex">
      <div class="flex-fill">
        <Camera :expanded="true" />
      </div>
    </div>


    <div class="col-12 col-md-6 p-2 d-flex">
      <div class="rounded background-tertiary p-3 mb-2 flex-fill" @contextmenu.prevent>
        <div class="h5">{{ $t("settings.drive") }}
          <NuxtLink to="/" class="btn btn-sm float-end">
            <font-awesome-icon icon="fa-compress" />
          </NuxtLink>
        </div>
        <DriveJoystick />
      </div>
    </div>
  </div>
</template>