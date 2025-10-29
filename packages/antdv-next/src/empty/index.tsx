import type { App, CSSProperties, SlotsType } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useBaseConfig, useComponentConfig } from '../config-provider/context.ts'
import useLocale from '../locale/useLocale.ts'
import DefaultEmptyImg from './empty'
import SimpleEmptyImg from './simple'
import useStyle from './style'

export interface TransferLocale {
  description: string
}

const defaultEmptyImg = <DefaultEmptyImg />
const simpleEmptyImg = <SimpleEmptyImg />

export type SemanticName = 'root' | 'image' | 'description' | 'footer'

export interface EmptyProps extends ComponentBaseProps {
  classes?: Partial<Record<SemanticName, string>>
  styles?: Partial<Record<SemanticName, CSSProperties>>
  image?: VueNode
  description?: VueNode
}

export interface EmptySlots {
  image: () => any
  description: () => any
  default: () => any
}

const defaultProps = {
  image: undefined,
  description: undefined,
}

const Empty = defineComponent<
  EmptyProps,
  Record<string, any>,
  string,
  SlotsType<EmptySlots>
>(
  (props = defaultProps, { slots, attrs }) => {
    const { prefixCls, direction } = useBaseConfig('empty', props)
    const componentConfig = useComponentConfig('empty')
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)
    const [locale] = useLocale('Empty')
    return () => {
      const description = getSlotPropsFnRun(slots, props, 'description')
      const des = description ?? locale?.value?.description
      const alt = typeof des === 'string' ? des : 'empty'
      const mergedImage = getSlotPropsFnRun(slots, props, 'image') ?? componentConfig.value?.image ?? defaultEmptyImg
      let imageNode: any = null
      if (typeof mergedImage === 'string') {
        imageNode = <img draggable={false} alt={alt} src={mergedImage} />
      }
      else {
        imageNode = mergedImage
      }
      const children = filterEmpty(slots?.default?.() ?? [])
      const contextClassNames = componentConfig?.value?.classes
      const contextStyles = componentConfig?.value?.styles
      const emptyClassNames = props?.classes
      const emptyStyles = props?.styles
      return wrapCSSVar(
        <div
          class={classNames(
            hashId.value,
            cssVarCls.value,
            prefixCls.value,
            componentConfig?.value?.class,
            {
              [`${prefixCls.value}-normal`]: mergedImage === simpleEmptyImg,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            props.rootClass,
            contextClassNames?.root,
            emptyClassNames?.root,
            (attrs as any).class,
          )}
          style={[
            contextStyles?.root,
            (attrs as any).style,
            emptyStyles?.root,
          ]}
          {...omit(attrs, ['class', 'style'])}
        >
          <div
            class={classNames(
              `${prefixCls.value}-image`,
              contextClassNames?.image,
              emptyClassNames?.image,
            )}
            style={[contextClassNames?.image, emptyStyles?.image]}
          >
            {imageNode}
          </div>
          {des && (
            <div
              class={classNames(
                `${prefixCls.value}-description`,
                contextClassNames?.description,
                emptyClassNames?.description,
              )}
              style={[contextStyles?.description, emptyStyles?.description]}
            >
              {des}
            </div>
          )}
          {!!children.length && (
            <div
              class={classNames(
                `${prefixCls.value}-footer`,
                contextClassNames?.footer,
                emptyClassNames?.footer,
              )}
              style={[contextStyles?.footer, emptyStyles?.footer]}
            >
              {children}
            </div>
          )}
        </div>,
      )
    }
  },
  {
    name: 'AEmpty',
  },
)

;(Empty as any).PRESENTED_IMAGE_DEFAULT = defaultEmptyImg
;(Empty as any).PRESENTED_IMAGE_SIMPLE = simpleEmptyImg

;(Empty as any).install = (app: App) => {
  app.component(Empty.name, Empty)
}

export default Empty as typeof Empty & {
  PRESENTED_IMAGE_DEFAULT: typeof defaultEmptyImg
  PRESENTED_IMAGE_SIMPLE: typeof simpleEmptyImg
}
