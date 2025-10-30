import type { Key } from '@v-c/util/dist/type'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { Breakpoint } from '../_util/responsiveObserver.ts'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { DescriptionsItemProps } from './Item.tsx'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import { matchScreen } from '../_util/responsiveObserver.ts'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useBaseConfig, useComponentConfig } from '../config-provider/context.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import { useBreakpoint } from '../grid'
import DEFAULT_COLUMN_MAP from './constant.ts'
import { useDescriptionsProvider } from './DescriptionsContext.ts'
import useItems from './hooks/useItems.ts'
import useRow from './hooks/useRow.ts'
import Row from './Row.tsx'
import useStyle from './style'

type SemanticName = 'root' | 'header' | 'title' | 'extra' | 'label' | 'content'

export interface InternalDescriptionsItemType extends Omit<DescriptionsItemProps, 'span'> {
  key?: Key
  filled?: boolean
  span?: number
}

export interface DescriptionsItemType extends Omit<DescriptionsItemProps, 'prefixCls'> {
  key?: Key
}

export interface DescriptionsProps extends ComponentBaseProps {
  bordered?: boolean
  size?: 'middle' | 'small' | 'default'
  title?: VueNode
  extra?: VueNode
  labelRender?: VueNode<[item: DescriptionsItemType, index: number]>
  contentRender?: VueNode<[item: DescriptionsItemType, index: number]>
  column?: number | Partial<Record<Breakpoint, number>>
  layout?: 'horizontal' | 'vertical'
  colon?: boolean
  styles?: Partial<Record<SemanticName, CSSProperties>>
  classes?: Partial<Record<SemanticName, string>>
  items?: DescriptionsItemType[]
  id?: string
}

const defaults = {
  colon: true,
} as any

export interface DescriptionsSlots {
  title?: () => any
  extra?: () => any
  labelRender?: (item: DescriptionsItemType, index: number) => any
  contentRender?: (item: DescriptionsItemType, index: number) => any
}

const Descriptions = defineComponent<
  DescriptionsProps,
  EmptyEmit,
  string,
  SlotsType<DescriptionsSlots>
>(
  (props = defaults, { slots, attrs }) => {
    const compCtx = useComponentConfig('descriptions')
    const { prefixCls, direction } = useBaseConfig('descriptions', props)
    const screens = useBreakpoint()
    const items = computed(() => props.items ?? [])
    const customizeSize = computed(() => props.size)
    // Column count
    const mergedColumn = computed(() => {
      if (typeof props.column === 'number') {
        return props.column
      }
      return matchScreen(screens.value!, {
        ...DEFAULT_COLUMN_MAP,
        ...props?.column,
      }) ?? 3
    })
    // Items with responsive
    const mergedItems = useItems(screens as any, items)

    const mergedSize = useSize(customizeSize)
    const rows = useRow(mergedColumn, mergedItems)
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)
    // ======================== Render ========================
    const contextValue = computed(() => {
      return {
        styles: {
          content: { ...compCtx.value?.styles?.content, ...props?.styles?.content },
          label: { ...compCtx.value?.styles?.label, ...props?.styles?.label },
        },
        classes: {
          content: classNames(compCtx.value?.classes?.content, props?.classes?.content),
          label: classNames(compCtx.value?.classes?.label, props?.classes?.label),
        },
      }
    })
    useDescriptionsProvider(contextValue)
    return () => {
      const { classes: descriptionsClassNames, styles, bordered, rootClass, colon, layout } = props
      const contextClassName = compCtx.value?.class
      const contextStyle = compCtx.value?.style
      const contextClassNames = compCtx.value?.classes
      const contextStyles = compCtx.value?.styles
      const title = getSlotPropsFnRun(slots, props, 'title')
      const extra = getSlotPropsFnRun(slots, props, 'extra')

      return wrapCSSVar(
        <div
          class={classNames(
            prefixCls.value,
            contextClassName,
            contextClassNames.root,
            descriptionsClassNames?.root,
            {
              [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value && mergedSize.value !== 'default',
              [`${prefixCls.value}-bordered`]: !!bordered,
              [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
            },
            (attrs as any).class,
            rootClass,
            hashId.value,
            cssVarCls.value,
          )}
          style={[contextStyle, contextStyles.root, styles?.root, (attrs as any).style]}
          {...omit(attrs, ['class', 'style'])}
        >
          {(!!title || !!extra) && (
            <div
              class={classNames(
                `${prefixCls.value}-header`,
                contextClassNames.header,
                descriptionsClassNames?.header,
              )}
              style={[contextStyles.header, styles?.header]}
            >
              {!!title && (
                <div
                  class={classNames(
                    `${prefixCls.value}-title`,
                    contextClassNames.title,
                    descriptionsClassNames?.title,
                  )}
                  style={[
                    contextStyles.title,
                    styles?.title,
                  ]}
                >
                  {title}
                </div>
              )}
              {!!extra && (
                <div
                  class={classNames(
                    `${prefixCls.value}-extra`,
                    contextClassNames.extra,
                    descriptionsClassNames?.extra,
                  )}
                  style={[contextStyles.extra, styles?.extra]}
                >
                  {extra}
                </div>
              )}
            </div>
          )}

          <div class={`${prefixCls.value}-view`}>
            <table>
              <tbody>
                {rows.value.map(
                  (row, index) => (
                    <Row
                      key={index}
                      index={index}
                      colon={!!colon}
                      prefixCls={prefixCls.value}
                      vertical={layout === 'vertical'}
                      bordered={bordered}
                      row={row}
                    />
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>,
      )
    }
  },
  {
    name: 'ADescriptions',
    inheritAttrs: false,
  },
)
;(Descriptions as any).install = (app: App) => {
  app.component(Descriptions.name, Descriptions)
}
export default Descriptions
