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
      <input v-model="item.name" class="form-control" />
    </td>

    <!-- PINS -->
    <td>
      <div v-for="(pinType, pinName) in peripheralsDef[item.type].pins" :key="pinName" class="mb-2">
        <select v-model="item.pins[pinName]" class="form-select">
          <option :value="null" disabled>
            {{ pinName }}
          </option>

          <option v-for="opt in getValidPins(item.type, pinName)" :key="opt.value" :value="opt.value">
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
})

defineEmits(["remove"])
</script>