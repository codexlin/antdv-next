import type { Ref } from 'vue'
import type { TokenWithCSSVar } from '../util/css-variables'
import type { ExtractStyle } from './useGlobalCache'
import { removeCSS, updateCSS } from '@v-c/util/dist/Dom/dynamicCSS'
import { computed } from 'vue'
import { ATTR_MARK, ATTR_TOKEN, CSS_IN_JS_INSTANCE, useStyleContext } from '../StyleContext'
import { isClientSide, toStyleStr } from '../util'
import { transformToken } from '../util/css-variables'
import { useGlobalCache } from './useGlobalCache'
import { uniqueHash } from './useStyleRegister'

export const CSS_VAR_PREFIX = 'cssVar'

export type CSSVarCacheValue<
  V,
  T extends Record<string, V> = Record<string, V>,
> = [
  cssVarToken: TokenWithCSSVar<V, T>,
  cssVarStr: string,
  styleId: string,
  cssVarKey: string,
]

export interface CSSVarRegisterConfig {
  path: string[]
  key: string
  prefix?: string
  unitless?: Record<string, boolean>
  ignore?: Record<string, boolean>
  preserve?: Record<string, boolean>
  scope?: string
  token: any
}

export default function useCSSVarRegister<
  V,
  T extends Record<string, V>,
>(config: Ref<CSSVarRegisterConfig>, fn: () => T) {
  const styleContext = useStyleContext()

  const stylePath = computed<(string | number)[]>(() => {
    const info = config.value
    const tokenKey = info.token?._tokenKey || ''
    const prefix = info.prefix || ''
    const scope = info.scope || ''
    const unitlessKey = info.unitless ? JSON.stringify(info.unitless) : ''
    const ignoreKey = info.ignore ? JSON.stringify(info.ignore) : ''
    const preserveKey = info.preserve ? JSON.stringify(info.preserve) : ''
    return [
      ...info.path,
      info.key,
      prefix,
      scope,
      unitlessKey,
      ignoreKey,
      preserveKey,
      tokenKey,
    ]
  })

  return useGlobalCache<CSSVarCacheValue<V, T>>(
    computed(() => CSS_VAR_PREFIX),
    stylePath,
    () => {
      const info = config.value
      const [mergedToken, cssVarsStr] = transformToken<V, T>(
        fn(),
        info.key,
        {
          prefix: info.prefix,
          unitless: info.unitless,
          ignore: info.ignore,
          preserve: info.preserve,
          scope: info.scope,
        },
      )
      const styleId = uniqueHash(stylePath.value, cssVarsStr)

      return [mergedToken, cssVarsStr, styleId, info.key]
    },
    ([, , styleId]) => {
      if (isClientSide) {
        removeCSS(styleId, {
          mark: ATTR_MARK,
          attachTo: styleContext.value.container,
        })
      }
    },
    ([, cssVarsStr, styleId, cssVarKey]) => {
      if (!cssVarsStr) {
        return
      }

      const context = styleContext.value

      const style = updateCSS(cssVarsStr, styleId, {
        mark: ATTR_MARK,
        prepend: 'queue',
        attachTo: context.container,
        priority: -999,
      })

      ;(style as any)[CSS_IN_JS_INSTANCE] = context.cache.instanceId
      style.setAttribute(ATTR_TOKEN, cssVarKey)
    },
  )
}

export const extract: ExtractStyle<CSSVarCacheValue<any>> = (
  cache,
  _effectStyles,
  options,
) => {
  const [, styleStr, styleId, cssVarKey] = cache
  const { plain } = options || {}

  if (!styleStr) {
    return null
  }

  const order = -999
  const sharedAttrs = {
    'data-rc-order': 'prependQueue',
    'data-rc-priority': `${order}`,
  }

  const styleText = toStyleStr(styleStr, cssVarKey, styleId, sharedAttrs, plain)

  return [order, styleId, styleText]
}
