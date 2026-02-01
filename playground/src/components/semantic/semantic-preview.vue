<script setup lang="ts">
import { InfoCircleOutlined, PushpinOutlined } from '@antdv-next/icons'
import { set } from '@v-c/util'
import { theme } from 'antdv-next'
import useLocale from 'antdv-next/locale/useLocale'
import Prism from 'prismjs'
import { computed, ref } from 'vue'
import Markers from './markers.vue'

defineOptions({
  name: 'SemanticPreview',
})

const props = withDefaults(defineProps<{
  componentName?: string
  semantics?: SemanticItem[]
  itemsAPI?: string
  height?: number
  padding?: boolean
}>(), {
  componentName: 'Component',
  semantics: () => [],
  padding: true,
})

export interface SemanticItem {
  name: string
  desc: string
  version?: string
}

const locales = {
  cn: {
    usage: '使用示例',
  },
  en: {
    usage: 'Usage Example',
  },
}

const [, lang] = useLocale('Table')
const locale = computed(() => {
  return lang?.value.toLowerCase() === 'zh-cn' ? locales.cn : locales.en
})

const { token } = theme.useToken()

// Get semantic path cells
function getSemanticCells(semanticPath: string): string[] {
  return semanticPath.split('.')
}

// Generate mark class name
function getMarkClassName(semanticKey: string): string {
  return `semantic-mark-${semanticKey}`.replace(/\./g, '-')
}

// Generate semantic classes for injection
const semanticClasses = computed<Record<string, string>>(() => {
  let classes: Record<string, string> = {}

  props.semantics.forEach((semantic) => {
    const pathCell = getSemanticCells(semantic.name)
    classes = set(classes, pathCell, getMarkClassName(semantic.name))
  })

  return classes
})

// Hover and pin state
const containerRef = ref<HTMLDivElement | null>(null)
const pinSemantic = ref<string | null>(null)
const hoverSemantic = ref<string | null>(null)

const mergedSemantic = computed(() => pinSemantic.value || hoverSemantic.value)

// Generate classes with active state
const hoveredSemanticClasses = computed(() => {
  if (!mergedSemantic.value) {
    return semanticClasses.value
  }

  const hoverCell = getSemanticCells(mergedSemantic.value)
  const currentClassName = hoverCell.reduce((obj, key) => obj?.[key], semanticClasses.value as any)
  const clone = set(
    semanticClasses.value,
    hoverCell,
    `${currentClassName || ''} ${getMarkClassName('active')}`.trim(),
  )

  return clone
})

// Generate highlight code example
function generateHighlightCode(semanticName: string): string {
  const classes = set({}, getSemanticCells(semanticName), 'my-classname')
  const styles = set({}, getSemanticCells(semanticName), { color: 'red' })

  function format(obj: object, offset = 1): string {
    const str = JSON.stringify(obj, null, 2)
    return str
      .split('\n')
      .map(line => `${'  '.repeat(offset)}${line}`)
      .join('\n')
      .trim()
      .replace(/"/g, '\'')
      .replace(/'([^']+)':/g, '$1:')
  }

  let code: string

  if (props.itemsAPI) {
    code = `
<${props.componentName}
  :${props.itemsAPI}="[{
    classes: ${format(classes, 2)},
    styles: ${format(styles, 2)},
  }]"
/>`.trim()
  }
  else {
    code = `
<${props.componentName}
  :classes="${format(classes)}"
  :styles="${format(styles)}"
/>`.trim()
  }

  return Prism.highlight(code, Prism.languages.javascript, 'jsx')
}

// Toggle pin
function togglePin(semanticName: string) {
  pinSemantic.value = pinSemantic.value === semanticName ? null : semanticName
}
</script>

<template>
  <div ref="containerRef" class="semantic-preview-container">
    <a-row :style="{ minHeight: height ? `${height}px` : undefined }">
      <a-col
        :span="16"
        class="semantic-preview-col"
        :class="{ 'semantic-preview-col-no-padding': !padding }"
      >
        <a-config-provider :theme="{ token: { motion: false } }">
          <slot :classes="hoveredSemanticClasses" />
        </a-config-provider>
      </a-col>
      <a-col :span="8">
        <ul class="semantic-list">
          <li
            v-for="semantic in semantics"
            :key="semantic.name"
            class="semantic-list-item"
            @mouseenter="hoverSemantic = semantic.name"
            @mouseleave="hoverSemantic = null"
          >
            <a-flex vertical gap="small">
              <a-flex gap="small" align="center" justify="space-between">
                <!-- Title + Version -->
                <a-flex gap="small" align="center">
                  <a-typography-title :level="5" :style="{ margin: 0 }">
                    {{ semantic.name }}
                  </a-typography-title>
                  <a-tag v-if="semantic.version" color="blue">
                    {{ semantic.version }}
                  </a-tag>
                </a-flex>

                <!-- Pin + Sample -->
                <a-flex gap="small" align="center">
                  <a-button
                    size="small"
                    :type="pinSemantic === semantic.name ? 'primary' : 'text'"
                    @click="togglePin(semantic.name)"
                  >
                    <template #icon>
                      <PushpinOutlined />
                    </template>
                  </a-button>
                  <a-popover :title="locale.usage">
                    <template #content>
                      <a-typography :style="{ fontSize: '12px', minWidth: '300px' }">
                        <pre dir="ltr"><code dir="ltr" v-html="generateHighlightCode(semantic.name)" /></pre>
                      </a-typography>
                    </template>
                    <a-button size="small" type="text">
                      <template #icon>
                        <InfoCircleOutlined />
                      </template>
                    </a-button>
                  </a-popover>
                </a-flex>
              </a-flex>
              <a-typography-paragraph :style="{ margin: 0, fontSize: `${token.fontSizeSM}px` }">
                {{ semantic.desc }}
              </a-typography-paragraph>
            </a-flex>
          </li>
        </ul>
      </a-col>
    </a-row>
    <Markers
      :container-ref="containerRef"
      :target-class-name="mergedSemantic ? getMarkClassName(mergedSemantic) : null"
    />
  </div>
</template>

<style scoped>
.semantic-preview-container {
  position: relative;
  z-index: 0;
}

.semantic-preview-col {
  border-inline-end: 1px solid var(--ant-color-border-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--ant-padding-md);
  overflow: hidden;
  position: relative;
  z-index: 0;
}

.semantic-preview-col-no-padding {
  padding: 0;
}

.semantic-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.semantic-list-item {
  cursor: pointer;
  padding: var(--ant-padding-sm);
  transition: background-color var(--ant-motion-duration-fast) ease;
}

.semantic-list-item:hover {
  background-color: var(--ant-control-item-bg-hover);
}

.semantic-list-item:not(:first-of-type) {
  border-top: 1px solid var(--ant-color-border-secondary);
}
</style>
