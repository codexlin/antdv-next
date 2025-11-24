<script setup lang="ts">
import { shallowRef } from 'vue'

const checked = shallowRef()
</script>

<template>
  <a-switch v-model:checked="checked" default-checked />
</template>
