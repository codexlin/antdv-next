import type { TokenType } from '../../theme'
import type { TokenMap, TokenMapKey, UseComponentStyleResult } from '../interface'
import type {
  GenStyleFn,
  GenStyleUtilsConfig,
  GenStyleUtilsResult,
  GetCompUnitless,
  GetDefaultToken,
  StyleInfo,
} from './genStyleUtils.types'
import { computed, defineComponent, unref } from 'vue'
import useCSSVarRegister from '../../hooks/useCSSVarRegister'
import useStyleRegister from '../../hooks/useStyleRegister'
import genCalc from '../../theme/calc'
import { token2CSSVar } from '../../util'
import useUniqueMemo from '../_util/hooks/useUniqueMemo'
import useDefaultCSP from '../hooks/useCSP'
import getComponentToken from './getComponentToken'
import getCompVarPrefix from './getCompVarPrefix'

import getDefaultComponentToken from './getDefaultComponentToken'
import genMaxMin from './maxmin'
// eslint-disable-next-line import/no-named-default
import { merge as mergeToken, default as statisticToken } from './statistic'

function genStyleUtils<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  DesignToken extends TokenType,
>(config: GenStyleUtilsConfig<CompTokenMap, AliasToken, DesignToken>): GenStyleUtilsResult {
  const {
    usePrefix,
    useToken,
    getResetStyles,
    getCommonStyle,
    getCompUnitless,
    useCSP = useDefaultCSP,
    layer,
  } = config

  function genCSSVarRegister<C extends TokenMapKey<CompTokenMap>>(
    component: C,
    getDefaultToken: GetDefaultToken<CompTokenMap, AliasToken, C> | undefined,
    options: {
      unitless?: ReturnType<Exclude<GetCompUnitless<CompTokenMap, AliasToken>, undefined>>
      ignore?: Record<string, boolean>
      deprecatedTokens?: [string, string][]
      injectStyle?: boolean
      prefixToken: (key: string) => string
    },
  ) {
    return (rootCls: string) => {
      const tokenData = useToken()
      const { cssVar, realToken, token } = tokenData
      const finalRealToken = realToken ?? token

      const hasCSSVar = computed(() => cssVar?.value?.key)

      if (options.injectStyle !== false && hasCSSVar.value) {
        const registerConfig = computed(() => {
          const cssVarValue = unref(cssVar)
          return {
            path: [component as string],
            prefix: cssVarValue?.prefix,
            key: cssVarValue?.key || '',
            unitless: options.unitless,
            ignore: options.ignore,
            token: unref(finalRealToken),
            scope: rootCls,
          }
        })

        useCSSVarRegister(registerConfig as any, () => {
          const defaultToken = getDefaultComponentToken(
            component as any,
            unref(finalRealToken) as any,
            getDefaultToken as any,
          ) as Record<string, any>

          const componentToken = getComponentToken(
            component as any,
            unref(finalRealToken) as any,
            defaultToken,
            { deprecatedTokens: options.deprecatedTokens as any },
          )

          Object.keys(defaultToken || {}).forEach((key) => {
            componentToken[options.prefixToken(key)] = componentToken[key]
            delete componentToken[key]
          })

          return componentToken
        })
      }

      return [(node: any) => node, unref(cssVar)?.key] as const
    }
  }

  function genComponentStyleHook<C extends TokenMapKey<CompTokenMap>>(
    componentName: C | [C, string],
    styleFn: GenStyleFn<CompTokenMap, AliasToken, C>,
    getDefaultToken?: GetDefaultToken<CompTokenMap, AliasToken, C>,
    options: any = {},
  ) {
    const cells = (Array.isArray(componentName) ? componentName : [componentName, componentName]) as [C, string]
    const [component, componentAlias] = cells

    const mergedLayer = layer || { name: 'antd' }

    return (prefixCls: string, rootCls: string = prefixCls): UseComponentStyleResult => {
      const tokenData = useToken()
      const { theme, token, realToken, hashId, cssVar } = tokenData
      const finalRealToken = realToken ?? token

      const prefix = usePrefix()
      const iconPrefixCls = computed(() => prefix?.value?.iconPrefixCls || 'anticon')
      const rootPrefixCls = computed(() => prefix?.value?.rootPrefixCls || 'ant')
      const csp = useCSP()

      const type = computed<'css' | 'js'>(() => unref(cssVar) ? 'css' : 'js')

      const calc = useUniqueMemo(() => {
        const unitlessCssVar = new Set<string>()
        const cssVarValue = unref(cssVar)
        if (cssVarValue) {
          const unitlessMap = (getCompUnitless && getCompUnitless(componentName as any)) || {}
          Object.keys(unitlessMap).forEach((key) => {
            unitlessCssVar.add(token2CSSVar(key, cssVarValue.prefix))
            unitlessCssVar.add(token2CSSVar(key, getCompVarPrefix(componentAlias as any, cssVarValue.prefix)))
          })
        }

        return genCalc(type.value, unitlessCssVar)
      }, [type, componentAlias, unref(cssVar)?.prefix])

      const { max, min } = genMaxMin(type.value)

      if (typeof getResetStyles === 'function') {
        useStyleRegister(
          computed(() => ({
            theme: unref(theme)!,
            token: unref(token),
            hashId: unref(hashId),
            nonce: unref(csp)?.nonce,
            clientOnly: false,
            layer: mergedLayer,
            order: options.order ?? -999,
            path: ['Shared', rootPrefixCls.value],
          })),
          () => getResetStyles(
            unref(token),
            {
              prefix: { rootPrefixCls: rootPrefixCls.value, iconPrefixCls: iconPrefixCls.value },
              csp: csp.value,
            },
          ),
        )
      }

      const wrapSSR = useStyleRegister(
        computed(() => ({
          theme: unref(theme)!,
          token: unref(token),
          hashId: unref(hashId),
          nonce: unref(csp)?.nonce,
          clientOnly: options.clientOnly,
          layer: mergedLayer,
          order: options.order ?? -999,
          path: [cells.join('-'), prefixCls, iconPrefixCls.value],
        })),
        () => {
          if (options.injectStyle === false) {
            return []
          }

          const tokenValue = unref(token)
          const { token: proxyToken, flush } = statisticToken(tokenValue as any)

          const realTokenValue = unref(finalRealToken)
          const defaultComponentToken = getDefaultComponentToken(
            component as any,
            realTokenValue as any,
            getDefaultToken as any,
          ) as Record<string, any>

          const componentToken = getComponentToken(
            component as any,
            realTokenValue as any,
            defaultComponentToken,
            { deprecatedTokens: options.deprecatedTokens as any },
          )

          const cssVarValue = unref(cssVar)
          if (cssVarValue && defaultComponentToken && typeof defaultComponentToken === 'object') {
            Object.keys(defaultComponentToken).forEach((key) => {
              defaultComponentToken[key] = `var(${token2CSSVar(
                key,
                getCompVarPrefix(componentAlias as any, cssVarValue.prefix),
              )})`
            })
          }

          const mergedToken = mergeToken<any>(
            proxyToken,
            {
              componentCls: `.${prefixCls}`,
              prefixCls,
              iconCls: `.${iconPrefixCls.value}`,
              antCls: `.${rootPrefixCls.value}`,
              calc,
              max,
              min,
            },
            cssVarValue ? defaultComponentToken : componentToken,
          )

          const hashIdValue = unref(hashId)
          const styleInterpolation = styleFn(mergedToken as any, {
            hashId: hashIdValue,
            prefixCls,
            rootPrefixCls: rootPrefixCls.value,
            iconPrefixCls: iconPrefixCls.value,
          } as StyleInfo)

          flush(componentAlias as any, componentToken)

          const commonStyle
            = typeof getCommonStyle === 'function'
              ? getCommonStyle(mergedToken, prefixCls, rootCls, options.resetFont)
              : null

          return [options.resetStyle === false ? null : commonStyle, styleInterpolation].filter(Boolean)
        },
      )

      const cssVarHook = genCSSVarRegister(
        component,
        getDefaultToken,
        {
          unitless: getCompUnitless?.(componentName as any),
          ignore: options.ignore,
          deprecatedTokens: options.deprecatedTokens,
          injectStyle: options.injectStyle,
          prefixToken: (key: string) => `${String(component)}${key.slice(0, 1).toUpperCase()}${key.slice(1)}`,
        },
      )

      const [wrapCSSVar, cssVarCls] = cssVarHook(rootCls)

      const wrapAll = (node: any) => wrapCSSVar(wrapSSR(node))

      return [wrapAll, unref(hashId) || '', cssVarCls] as UseComponentStyleResult
    }
  }

  function genStyleHooks<C extends TokenMapKey<CompTokenMap>>(
    component: C | [C, string],
    styleFn: GenStyleFn<CompTokenMap, AliasToken, C> | GenStyleFn<CompTokenMap, AliasToken, C>[],
    getDefaultToken?: GetDefaultToken<CompTokenMap, AliasToken, C>,
    options?: Parameters<typeof genComponentStyleHook<C>>[3],
  ) {
    const styleFns = Array.isArray(styleFn) ? styleFn : [styleFn]

    const useStyle = genComponentStyleHook<C>(
      component,
      (token, info) => styleFns.map(fn => fn(token, info)),
      getDefaultToken,
      options,
    )

    const cssVarHook = genCSSVarRegister(
      Array.isArray(component) ? component[0] : component,
      getDefaultToken,
      {
        unitless: options?.unitless,
        ignore: options?.ignore,
        deprecatedTokens: options?.deprecatedTokens,
        injectStyle: options?.injectStyle,
        prefixToken: (key: string) => `${String(Array.isArray(component) ? component[0] : component)}${key.slice(0, 1).toUpperCase()}${key.slice(1)}`,
      },
    )

    return (prefixCls: string, rootCls: string = prefixCls) => {
      const [wrapSSR, hashId, cssVarCls] = useStyle(prefixCls, rootCls)
      const [wrapCSSVar] = cssVarHook(rootCls)

      const wrapAll = (node: any) => wrapCSSVar(wrapSSR(node))

      return [wrapAll, hashId, cssVarCls] as UseComponentStyleResult
    }
  }

  function genSubStyleComponent<C extends TokenMapKey<CompTokenMap>>(
    componentName: C | [C, string],
    styleFn: GenStyleFn<CompTokenMap, AliasToken, C>,
    getDefaultToken?: GetDefaultToken<CompTokenMap, AliasToken, C>,
    options?: Parameters<typeof genComponentStyleHook<C>>[3],
  ) {
    const useStyle = genComponentStyleHook(componentName, styleFn, getDefaultToken, {
      resetStyle: false,
      order: -998,
      ...options,
    })

    return defineComponent({
      name: `SubStyle_${String(Array.isArray(componentName) ? componentName.join('.') : componentName)}`,
      props: {
        prefixCls: {
          type: String,
          required: true,
        },
        rootCls: {
          type: String,
          default: undefined,
        },
      },
      setup(props) {
        useStyle(props.prefixCls, props.rootCls ?? props.prefixCls)
        return () => null
      },
    }) as any
  }

  return {
    genStyleHooks,
    genSubStyleComponent,
    genComponentStyleHook,
  }
}

export default genStyleUtils
export * from './genStyleUtils.types'
