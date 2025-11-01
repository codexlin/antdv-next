<script setup lang="ts">
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`
const items = [
  {
    key: '1',
    label: 'This is panel header 1',
  },
  {
    key: '2',
    label: 'This is panel header 2',
  },
  {
    key: '3',
    label: 'This is panel header 3',
  },
]
</script>

<template>
  <div class="p-5">
    <a-collapse :items="items">
      <template #contentRender>
        <p>{{ text }}</p>
      </template>
    </a-collapse>
  </div>
</template>
