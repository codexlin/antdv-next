<docs lang="zh-CN">
Switch 失效状态。
</docs>

<docs lang="en-US">
Disabled state of `Switch`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(true)
const checked = ref(true)

function toggle() {
  disabled.value = !disabled.value
}
</script>

<template>
  <a-space vertical>
    <a-switch v-model:checked="checked" :disabled="disabled" />
    <a-button type="primary" @click="toggle">
      Toggle disabled
    </a-button>
  </a-space>
</template>
