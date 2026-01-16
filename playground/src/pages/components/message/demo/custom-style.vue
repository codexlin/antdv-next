<docs lang="zh-CN">
使用 `style` 和 `class` 来定义样式。
</docs>

<docs lang="en-US">
The `style` and `class` are available to customize Message.
</docs>

<script setup lang="ts">
import { message } from 'antdv-next'

const [messageApi, ContextHolder] = message.useMessage()

function success() {
  messageApi.open({
    type: 'success',
    content: 'This is a prompt message with custom class and style',
    class: 'custom-message',
    style: {
      marginTop: '20vh',
    },
  })
}
</script>

<template>
  <ContextHolder />
  <a-button @click="success">
    Customized style
  </a-button>
</template>
