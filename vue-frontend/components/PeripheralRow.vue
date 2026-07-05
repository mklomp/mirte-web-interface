<template>
  <tr>

    <!-- TYPE + DELETE -->
    <td>
      <button
        @click="$emit('remove', item.id)"
        class="btn"
      >
        <ClientOnly>
          <FontAwesomeIcon icon="trash" />
        </ClientOnly>
      </button>

      {{ $t("peripherals." + item.type) }}
    </td>

    <!-- NAME -->
    <td>
      <input
        v-model="item.name"
        class="form-control"
        :class="{ 'is-invalid-custom': errors.name }"
        :title="errors.name"
      />
    </td>

    <!-- PINS -->
    <td>
      <div
        v-for="(pinType, pinName) in peripheralsDef[item.type].pins"
        :key="pinName"
        class="mb-2"
      >
        <select
          v-model="item.pins[pinName]"
          class="form-select"
          :class="{ 'is-invalid-custom': errors[pinName] }"
          :title="errors[pinName]"
        >
          <option
            :value="null"
            disabled
          >
            {{ pinName }}
          </option>

          <option
            v-for="opt in getValidPins(item.type, pinName)"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.text }}
          </option>
        </select>
      </div>
    </td>

  </tr>
</template>

<script setup>
defineProps({
  item: Object,
  peripheralsDef: Object,
  getValidPins: Function,

  errors: {
    type: Object,
    default: () => ({})
  }
})

defineEmits([
  "remove"
])
</script>

<style scoped>
.is-invalid-custom {
  background-color: #ffe5b4 !important;
  border-color: #ff9800 !important;
}
</style>