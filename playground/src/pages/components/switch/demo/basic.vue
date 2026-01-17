<docs lang="zh-CN">
最简单的用法。
</docs>

<docs lang="en-US">
The most basic usage.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const checked = shallowRef(true)

function onChange(checked: boolean) {
  console.log(`switch to ${checked}`)
}
</script>

<template>
  <a-switch v-model:checked="checked" @change="onChange" />
</template>
