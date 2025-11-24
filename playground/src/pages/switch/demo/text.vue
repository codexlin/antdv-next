<script setup lang="ts">
import { CheckOutlined, CloseOutlined } from '@antdv-next/icons'
import { shallowRef } from 'vue'

const checked = shallowRef()
</script>

<template>
  <a-switch v-model:checked="checked" checked-children="开启" un-checked-children="关闭" default-checked />
  <a-switch v-model:checked="checked" checked-children="1" un-checked-children="0" default-checked />
  <a-switch v-model:checked="checked" default-checked>
    <template #checkedChildren>
      <CheckOutlined />
    </template>
    <template #unCheckedChildren>
      <CloseOutlined />
    </template>
  </a-switch>
</template>

<style scoped>

</style>
