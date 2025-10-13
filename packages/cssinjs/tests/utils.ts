import type { StyleContextProps } from '../src/StyleContext'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import {
  createCache,

  useStyleContextProvide,
} from '../src/StyleContext'

export function mountWithStyleProvider(
  component: any,
  overrides: Partial<StyleContextProps> = {},
) {
  const Provider = defineComponent({
    setup(_, { slots }) {
      const context = ref<StyleContextProps>({
        cache: createCache(),
        defaultCache: true,
        hashPriority: 'low',
        ...overrides,
      })
      useStyleContextProvide(context)
      return () => slots.default?.()
    },
  })

  return mount(() => h(Provider, null, () => h(component)))
}
