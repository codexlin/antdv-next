<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef()
</script>

<template>
  <a-calendar v-model:value="value" />
</template>
