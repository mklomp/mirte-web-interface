<template>
  <tr>

    <!-- TYPE + DELETE -->
    <td>
      <button @click="$emit('remove', item.id)" class="btn">
        <ClientOnly>
          <FontAwesomeIcon icon="trash" />
        </ClientOnly>
      </button>

      {{ $t("peripherals." + item.type) }}
    </td>

    <!-- NAME -->
    <td>
      <input v-model="item.name" class="form-control" :class="{ 'is-invalid-custom': errors.name }"
        :title="errors.name" />
    </td>

    <!-- PINS -->
    <td>
      <div v-for="(pinType, pinName) in peripheralsDef[item.type].pins" :key="pinName" class="mb-2">

        <select :value="item.pins[pinName]" class="form-select" :class="{ 'is-invalid-custom': errors[pinName] }"
          :title="errors[pinName]" @change="
            updatePeripheralPin(
              item.id,
              pinName,
              $event.target.value
            )
            ">

          <option value="" disabled>
            {{ pinName }}
          </option>

          <option v-for="opt in getAvailablePins(pinName)" :key="opt.value" :value="opt.value">
            {{ opt.text }}
          </option>

        </select>
      </div>
    </td>

  </tr>
</template>

<script setup>
const props = defineProps({
  item: Object,
  peripheralsDef: Object,
  getValidPins: Function,
  usedPins: Object,
  updatePeripheralPin: Function,

  errors: {
    type: Object,
    default: () => ({})
  }
})

function getAvailablePins(pinName) {
  return props.getValidPins(props.item.type, pinName).filter(
    opt =>
      !props.usedPins.has(opt.value) ||
      props.item.pins[pinName] === opt.value
  )
}

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