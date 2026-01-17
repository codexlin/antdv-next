<docs lang="zh-CN">
标识开关操作仍在执行中。
</docs>

<docs lang="en-US">
Mark a pending state of switch.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const checked1 = shallowRef(true)
const checked2 = shallowRef(false)
</script>

<template>
  <a-switch v-model:checked="checked1" loading />
  <br>
  <a-switch v-model:checked="checked2" size="small" loading />
</template>
