<docs lang="zh-CN">
可以通过唯一的 `key` 来更新内容。
</docs>

<docs lang="en-US">
Update message content with unique `key`.
</docs>

<script setup lang="ts">
import { message } from 'antdv-next'

const key = 'updatable'

const [messageApi, ContextHolder] = message.useMessage()
function openMessage() {
  messageApi.open({
    key,
    type: 'loading',
    content: 'Loading...',
  })
  setTimeout(() => {
    messageApi.open({
      key,
      type: 'success',
      content: 'Loaded!',
      duration: 2,
    })
  }, 2500)
}
</script>

<template>
  <ContextHolder />
  <a-button type="primary" @click="openMessage">
    Open the message box
  </a-button>
</template>
