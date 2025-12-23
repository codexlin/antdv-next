<script setup lang="ts">

</script>

<template>
  <main class="ant-doc-main mt-xl flex">
    <a-col :xxl="4" :xl="5" :lg="6" :md="6" :sm="24" :xs="24">
      left
    </a-col>
    <a-col :xxl="20" :xl="19" :lg="18" :md="18" :sm="0" :xs="0">
      <slot />
    </a-col>
  </main>
</template>

<style lang="less">
.ant-doc-main {
}
</style>
