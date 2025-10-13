import type Cache from './Cache'
import { TOKEN_PREFIX, extract as tokenExtractStyle } from './hooks/useCacheToken'
import { CSS_VAR_PREFIX, extract as cssVarExtractStyle } from './hooks/useCSSVarRegister'
import { STYLE_PREFIX, extract as styleExtractStyle } from './hooks/useStyleRegister'
import { toStyleStr } from './util'
import {
  ATTR_CACHE_MAP,
  serialize as serializeCacheMap,
} from './util/cacheMapUtil'

type ExtractStyleFn = (
  cache: any,
  effectStyles: Record<string, boolean>,
  options?: {
    plain?: boolean
  },
) => [order: number, styleId: string, styleStr: string] | null

const ExtractStyleFns: Record<string, ExtractStyleFn> = {
  [STYLE_PREFIX]: styleExtractStyle,
  [CSS_VAR_PREFIX]: cssVarExtractStyle,
  [TOKEN_PREFIX]: tokenExtractStyle,
}

type ExtractStyleType = keyof typeof ExtractStyleFns

function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

export interface ExtractOptions {
  plain?: boolean
  types?: ExtractStyleType | ExtractStyleType[]
  once?: boolean
}

export default function extractStyle(
  cache: Cache,
  options?: boolean | ExtractOptions,
) {
  const { plain = false, types = Object.keys(ExtractStyleFns), once = false }
    = typeof options === 'boolean' ? { plain: options } : options || {}

  const typeList = (Array.isArray(types) ? types : [types]).filter(
    type => type in ExtractStyleFns,
  )

  const matchPrefixRegexp = new RegExp(`^(${typeList.join('|')})%`)

  const styleKeys = Array.from(cache.cache.keys()).filter(key => matchPrefixRegexp.test(key))

  const effectStyles: Record<string, boolean> = {}
  const cachePathMap: Record<string, string> = {}

  let styleText = ''

  styleKeys
    .map<[number, string] | null>((key) => {
      if (once && cache.extracted.has(key)) {
        return null
      }

      const cachePath = key.replace(matchPrefixRegexp, '').replace(/%/g, '|')
      const [prefix] = key.split('%')
      const extractFn = ExtractStyleFns[prefix as keyof typeof ExtractStyleFns]

      if (!extractFn) {
        return null
      }

      const cacheEntry = cache.cache.get(key)
      if (!cacheEntry) {
        return null
      }

      const extractedStyle = extractFn(cacheEntry[1], effectStyles, { plain })
      if (!extractedStyle) {
        return null
      }

      const [order, styleId, styleStr] = extractedStyle

      if (prefix === STYLE_PREFIX) {
        cachePathMap[cachePath] = styleId
      }

      cache.extracted.add(key)

      return [order, styleStr]
    })
    .filter(isNotNull)
    .sort(([o1], [o2]) => o1 - o2)
    .forEach(([, style]) => {
      styleText += style
    })

  styleText += toStyleStr(
    `.${ATTR_CACHE_MAP}{content:"${serializeCacheMap(cachePathMap)}";}`,
    undefined,
    undefined,
    {
      [ATTR_CACHE_MAP]: ATTR_CACHE_MAP,
    },
    plain,
  )

  return styleText
}
