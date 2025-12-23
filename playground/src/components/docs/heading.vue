<script setup lang="ts">
import type { Frontmatter } from '@/composables/doc-page.ts'
import { EditOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'DocHeading',
})
defineProps<{
  frontmatter?: Frontmatter
}>()

const route = useRoute()
const githubUrl = computed(() => {
  const path = route.path
  let docPath = path
  let mdFile = ''
  if (path.endsWith('-cn')) {
    mdFile = 'index.zh-CN.md'
    docPath = path.slice(0, -3)
  }
  else {
    mdFile = 'index.en-US.md'
  }
  return `https://github.com/antdv-next/antdv-next/edit/main/playground/src/pages${docPath}/${mdFile}`
})
</script>

<template>
  <a-typography-title style="font-size: 32px;position: relative">
    <a-space>
      <span>{{ frontmatter?.title }}</span>
      <span>{{ frontmatter?.subtitle }}</span>
      <a-tooltip title="在 GitHub 上编辑此页" destroy-on-hidden>
        <a class="relative top--2px inline-block decoration-none align-mid ml-xs" :href="githubUrl" target="_blank" rel="noopener noreferrer">
          <EditOutlined class="text-16px c-black/45 block" />
        </a>
      </a-tooltip>
    </a-space>
  </a-typography-title>
  {{ frontmatter?.description }}
</template>
