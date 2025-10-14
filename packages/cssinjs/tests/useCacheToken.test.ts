import hash from '@emotion/hash'
import { beforeEach, describe, expect, it } from 'vitest'
import { computed, defineComponent, h, nextTick, ref } from 'vue'
import useCacheToken, { extract as extractToken } from '../src/hooks/useCacheToken'
import { ATTR_TOKEN, createCache } from '../src/StyleContext'
import { createTheme } from '../src/theme'
import { mountWithStyleProvider } from './utils'

interface DesignToken {
  colorPrimary: string
  borderRadius: number
}

interface DerivativeToken extends DesignToken {
  colorPrimaryHover: string
}

const theme = ref<any>(createTheme<DesignToken, DerivativeToken>(token => ({
  ...token,
  colorPrimaryHover: `${token.colorPrimary}80`,
})))

describe('useCacheToken', () => {
  beforeEach(() => {
    document
      .querySelectorAll(`style[${ATTR_TOKEN}]`)
      .forEach(style => style.parentNode?.removeChild(style))
  })

  it('memoizes derivative token and reacts to design token changes', async () => {
    const baseToken = ref<DesignToken>({
      colorPrimary: '#1677ff',
      borderRadius: 2,
    })

    let cacheRef: ReturnType<typeof useCacheToken<DerivativeToken, DesignToken>>

    const Demo = defineComponent({
      setup() {
        cacheRef = useCacheToken<DerivativeToken, DesignToken>(theme, ref([() => baseToken.value]))
        return () => h('div', { class: cacheRef.value[1] })
      },
    })

    mountWithStyleProvider(Demo)
    await nextTick()

    const [token, hashId, realToken] = cacheRef!.value
    expect(token.colorPrimary).toBe('#1677ff')
    expect(token.borderRadius).toBe(2)
    expect(hashId.startsWith('css-')).toBe(true)
    expect(realToken.colorPrimary).toBe('#1677ff')

    baseToken.value = {
      colorPrimary: '#fa541c',
      borderRadius: 4,
    }

    await nextTick()

    const [nextToken] = cacheRef!.value
    expect(nextToken.colorPrimary).toBe('#fa541c')
    expect(nextToken.borderRadius).toBe(4)
  })

  it('injects css variables and cleans up after unmount', async () => {
    const baseToken = ref<DesignToken>({
      colorPrimary: '#1677ff',
      borderRadius: 2,
    })

    let cacheRef: ReturnType<typeof useCacheToken<DerivativeToken, DesignToken>>

    const Demo = defineComponent({
      setup() {
        cacheRef = useCacheToken(theme, computed(() => [() => baseToken.value]), computed(() => ({
          cssVar: {
            key: 'demo-token',
            prefix: 'demo',
          },
        })))
        return () => h('div')
      },
    })

    const wrapper = mountWithStyleProvider(Demo)
    await nextTick()

    const themeKey = cacheRef!.value[0]._themeKey
    expect(themeKey).toBe('demo-token')

    const styleId = hash(`css-variables-${themeKey}`)
    const styleEl = document.querySelector<HTMLStyleElement>(`style[data-css-hash="${styleId}"]`)
    expect(styleEl).not.toBeNull()
    expect(styleEl?.textContent).toContain('--demo-color-primary:#1677ff;')

    baseToken.value = {
      colorPrimary: '#52c41a',
      borderRadius: 6,
    }
    await nextTick()

    expect(styleEl?.textContent).toContain('--demo-color-primary:#52c41a;')

    wrapper.unmount()
    await nextTick()

    expect(document.querySelectorAll(`style[${ATTR_TOKEN}="${themeKey}"]`).length).toBeLessThanOrEqual(1)
  })

  it('supports extract helper for css vars', async () => {
    const cache = createCache()

    let cacheRef: ReturnType<typeof useCacheToken<DerivativeToken, DesignToken>>

    const Demo = defineComponent({
      setup() {
        cacheRef = useCacheToken(theme, computed(() => [
          () => ({ colorPrimary: '#1677ff', borderRadius: 2 }),
        ]), computed(() => ({
          cssVar: {
            key: 'extract',
            prefix: 'extract',
          },
        })))

        return () => h('div')
      },
    })

    const wrapper = mountWithStyleProvider(Demo, { cache })
    await nextTick()

    const result = extractToken(cacheRef!.value, {}, { plain: true })
    expect(result).not.toBeNull()
    expect(result?.[2]).toContain('--extract-color-primary:#1677ff;')

    wrapper.unmount()
  })

  it('merges override and format token options', async () => {
    let cacheRef: ReturnType<typeof useCacheToken<DerivativeToken, DesignToken>>

    const Demo = defineComponent({
      setup() {
        cacheRef = useCacheToken(theme, ref([
          () => ({ colorPrimary: '#1677ff', borderRadius: 2 }),
        ]), ref({
          override: {
            colorPrimary: '#000000',
          },
          formatToken: token => ({
            ...token,
            customColor: token.colorPrimary,
          }),
        }))

        return () => h('div')
      },
    })

    mountWithStyleProvider(Demo)
    await nextTick()

    const [token] = cacheRef!.value
    expect(token.colorPrimary).toBe('#000000')
    expect((token as any).customColor).toBe('#000000')
  })
})
