<script setup>
defineProps({
  interactive: Boolean
});

import { useI18n } from 'vue-i18n'
import { onMounted, watch } from 'vue'

const { t, locale } = useI18n()
const svgRef = ref(null)

const updateText = () => {
  if (!svgRef.value) return
  const labels = svgRef.value.querySelectorAll('textPath')

  labels.forEach(el => {
    const key = `mirte_complexity.${el.id}`
    el.textContent = t(key)
  })
}

onMounted(updateText)
watch(locale, updateText) // update when language changes

import MirteComplexity from '@/assets/images/mirte_complexity_layers.svg'

</script>

<template>

  <div ref="svgRef" class="d-flex flex-row">
    <MirteComplexity />
  </div>

</template>
