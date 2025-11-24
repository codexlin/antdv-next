<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(true)
function toggle() {
  disabled.value = !disabled.value
}
</script>

<template>
  <a-space vertical>
    <a-switch default-checked :disabled="disabled" />

    <a-button type="primary" @click="toggle">
      Toggle disabled
    </a-button>
  </a-space>
</template>

<style scoped>

</style>
