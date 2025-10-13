import type { Ref } from 'vue'
import type Theme from '../theme/Theme'
import type { ExtractStyle } from './useGlobalCache'
import hash from '@emotion/hash'
import { updateCSS } from '@v-c/util/dist/Dom/dynamicCSS'
import { computed, ref } from 'vue'
import { ATTR_MARK, ATTR_TOKEN, CSS_IN_JS_INSTANCE, useStyleContext } from '../StyleContext'
import { flattenToken, memoResult, token2key, toStyleStr } from '../util'
import { transformToken } from '../util/css-variables'
import { useGlobalCache } from './useGlobalCache'

const EMPTY_OVERRIDE = {}

// @ts-expect-error fix this
const hashPrefix = process.env.NODE_ENV !== 'production'
  ? 'css-dev-only-do-not-override'
  : 'css'

export interface Option<DerivativeToken, DesignToken> {
  salt?: string
  override?: object
  formatToken?: (mergedToken: any) => DerivativeToken
  getComputedToken?: (
    origin: DesignToken,
    override: object,
    theme: Theme<any, any>,
  ) => DerivativeToken
  cssVar?: {
    prefix?: string
    unitless?: Record<string, boolean>
    ignore?: Record<string, boolean>
    preserve?: Record<string, boolean>
    key?: string
  }
}

const tokenKeys = new Map<string, number>()

function recordCleanToken(tokenKey: string) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1)
}

function removeStyleTags(key: string, instanceId: string) {
  if (typeof document !== 'undefined') {
    const styles = document.querySelectorAll(`style[${ATTR_TOKEN}="${key}"]`)
    styles.forEach((style) => {
      if ((style as any)[CSS_IN_JS_INSTANCE] === instanceId) {
        style.parentNode?.removeChild(style)
      }
    })
  }
}

const TOKEN_THRESHOLD = 0

function cleanTokenStyle(tokenKey: string, instanceId: string) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1)

  const cleanableKeyList = new Set<string>()
  tokenKeys.forEach((value, key) => {
    if (value <= 0) {
      cleanableKeyList.add(key)
    }
  })

  if (tokenKeys.size - cleanableKeyList.size > TOKEN_THRESHOLD) {
    cleanableKeyList.forEach((key) => {
      removeStyleTags(key, instanceId)
      tokenKeys.delete(key)
    })
  }
}

export function getComputedToken<
  DerivativeToken = object,
  DesignToken = DerivativeToken,
>(originToken: DesignToken, overrideToken: object, theme: Theme<any, any>, format?: (token: DesignToken) => DerivativeToken) {
  const derivativeToken = theme.getDerivativeToken(originToken)

  let mergedDerivativeToken = {
    ...derivativeToken,
    ...overrideToken,
  }

  if (format) {
    mergedDerivativeToken = format(mergedDerivativeToken)
  }

  return mergedDerivativeToken
}

export const TOKEN_PREFIX = 'token'

type TokenCacheValue<DerivativeToken> = [
  token: DerivativeToken & { _tokenKey: string, _themeKey: string },
  hashId: string,
  realToken: DerivativeToken & { _tokenKey: string },
  cssVarStr: string,
  cssVarKey: string,
]

export default function useCacheToken<
  DerivativeToken = Record<string, any>,
  DesignToken = DerivativeToken,
>(
  theme: Ref<Theme<any, any>>,
  tokens: Ref<(Partial<DesignToken> | (() => Partial<DesignToken>))[]>,
  option: Ref<Option<DerivativeToken, DesignToken>> = ref({}),
) {
  const styleContext = useStyleContext()

  const salt = computed(() => option.value.salt ?? '')
  const override = computed(() => option.value.override ? option.value.override : EMPTY_OVERRIDE)
  const formatToken = computed(() => option.value.formatToken)
  const compute = computed(() => option.value.getComputedToken)
  const cssVar = computed(() => option.value.cssVar ? option.value.cssVar : undefined)

  const resolvedTokens = computed(() => tokens.value.map(token => (typeof token === 'function' ? token() : token)))

  const mergedToken = computed(() => memoResult(
    () => Object.assign({}, ...resolvedTokens.value),
    resolvedTokens.value,
  ))

  const tokenStr = computed(() => flattenToken(mergedToken.value))
  const overrideTokenStr = computed(() => flattenToken(override.value))
  const cssVarStr = computed(() => (cssVar.value ? flattenToken(cssVar.value) : ''))

  return useGlobalCache<TokenCacheValue<DerivativeToken>>(
    computed(() => TOKEN_PREFIX),
    computed(() => [salt.value, theme.value.id, tokenStr.value, overrideTokenStr.value, cssVarStr.value]),
    () => {
      let mergedDerivativeToken = compute.value
        ? compute.value(mergedToken.value as DesignToken, override.value, theme.value)
        : getComputedToken(mergedToken.value as DesignToken, override.value, theme.value, formatToken.value)

      const actualToken = { ...mergedDerivativeToken }
      let cssVarsStr = ''

      if (cssVar.value) {
        [mergedDerivativeToken, cssVarsStr] = transformToken(
          mergedDerivativeToken,
          cssVar.value.key!,
          {
            prefix: cssVar.value.prefix,
            ignore: cssVar.value.ignore,
            unitless: cssVar.value.unitless,
            preserve: cssVar.value.preserve,
          },
        )
      }

      const tokenKey = token2key(mergedDerivativeToken, salt.value)
      ;(mergedDerivativeToken as any)._tokenKey = tokenKey
      ;(actualToken as any)._tokenKey = token2key(actualToken, salt.value)

      const themeKey = cssVar.value?.key ?? tokenKey
      ;(mergedDerivativeToken as any)._themeKey = themeKey
      recordCleanToken(themeKey)

      const hashId = `${hashPrefix}-${hash(tokenKey)}`
      ;(mergedDerivativeToken as any)._hashId = hashId

      return [
        mergedDerivativeToken as TokenCacheValue<DerivativeToken>[0],
        hashId,
        actualToken as TokenCacheValue<DerivativeToken>[2],
        cssVarsStr,
        cssVar.value?.key || '',
      ]
    },
    (cache) => {
      cleanTokenStyle(cache[0]._themeKey, styleContext.value.cache.instanceId)
    },
    ([token, , , cssVarsStr]) => {
      if (cssVar.value && cssVarsStr) {
        const style = updateCSS(
          cssVarsStr,
          hash(`css-variables-${token._themeKey}`),
          {
            mark: ATTR_MARK,
            prepend: 'queue',
            attachTo: styleContext.value.container,
            priority: -999,
          },
        )

        ;(style as any)[CSS_IN_JS_INSTANCE] = styleContext.value.cache.instanceId
        style.setAttribute(ATTR_TOKEN, token._themeKey)
      }
    },
  )
}

export const extract: ExtractStyle<TokenCacheValue<any>> = (
  cache,
  _effectStyles,
  options,
) => {
  const [, , realToken, styleStr, cssVarKey] = cache
  const { plain } = options || {}

  if (!styleStr) {
    return null
  }

  const styleId = realToken._tokenKey
  const order = -999

  const sharedAttrs = {
    'data-rc-order': 'prependQueue',
    'data-rc-priority': `${order}`,
  }

  const styleText = toStyleStr(
    styleStr,
    cssVarKey,
    styleId,
    sharedAttrs,
    plain,
  )

  return [order, styleId, styleText]
}
