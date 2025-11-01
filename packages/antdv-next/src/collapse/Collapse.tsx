import type { ItemType, CollapseProps as VcCollapseProps } from '@v-c/collapse'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { VueNode } from '../_util/type.ts'
import type { SizeType } from '../config-provider/SizeContext.tsx'
import type { CollapsibleType } from './CollapsePanel.tsx'
import { RightOutlined } from '@antdv-next/icons'
import VcCollapse from '@v-c/collapse'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent } from 'vue'
import initCollapseMotion from '../_util/motion.ts'
import { checkRenderNode, cloneElement } from '../_util/vueNode.ts'
import { useBaseConfig, useComponentConfig } from '../config-provider/context.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import useStyle from './style'

export type ExpandIconPosition = 'start' | 'end' | undefined

export interface CollapseProps extends Pick<VcCollapseProps, 'items'> {
  activeKey?: Array<string | number> | string | number
  defaultActiveKey?: Array<string | number> | string | number
  /** 手风琴效果 */
  accordion?: boolean
  /**
   * @since 5.25.0
   */
  destroyOnHidden?: boolean
  rootClass?: string
  bordered?: boolean
  prefixCls?: string
  expandIcon?: (panelProps: PanelProps) => any
  expandIconPosition?: ExpandIconPosition
  ghost?: boolean
  size?: SizeType
  collapsible?: CollapsibleType
  labelRender?: (params: { item: ItemType, index: number }) => any
  contentRender?: (params: { item: ItemType, index: number }) => any
}

export interface CollapseEmits {
  change: (key: string[]) => void
  [key: string]: (...args: any[]) => void
}

interface PanelProps {
  isActive?: boolean
  header?: VueNode
  className?: string
  style?: CSSProperties
  showArrow?: boolean
  forceRender?: boolean
  extra?: VueNode
  collapsible?: CollapsibleType
}

interface CollapseSlots {
  expandIcon: (panelProps: PanelProps) => any
  labelRender: (params: { item: ItemType, index: number }) => any
  contentRender: (params: { item: ItemType, index: number }) => any
}

const defaults = {
  expandIconPosition: 'start',
  bordered: true,
} as any
const Collapse = defineComponent<
  CollapseProps,
  CollapseEmits,
  string,
  SlotsType<CollapseSlots>
>(
  (props = defaults, { attrs, emit, slots }) => {
    const compCtx = useComponentConfig('collapse')
    const mergedSize = useSize<SizeType>(ctxSize => props?.size ?? ctxSize ?? 'middle')
    const { direction, prefixCls, getPrefixCls } = useBaseConfig('collapse', props)
    const rootPrefixCls = getPrefixCls()
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls)

    const mergedExpandIconPosition = computed(() => props.expandIconPosition)

    const renderExpandIcon = (panelProps: PanelProps = {}) => {
      const mergedExpandIcon = slots?.expandIcon ?? props?.expandIcon ?? compCtx.value?.expandIcon
      const icon = typeof mergedExpandIcon === 'function'
        ? mergedExpandIcon?.(panelProps)
        : (
            <RightOutlined
              rotate={panelProps.isActive ? (direction.value === 'rtl' ? -90 : 90) : undefined}
              aria-label={panelProps.isActive ? 'expanded' : 'collapsed'}
            />
          )
      return cloneElement(icon, () => {
        return {
          class: classNames(
            icon.props?.class,
            `${prefixCls.value}-arrow`,
          ),
        }
      })
    }
    const openMotion = computed(() => {
      return {
        ...initCollapseMotion(rootPrefixCls),
        appear: false,
        leaveActiveClass: `${prefixCls.value}-content-hidden`,
      }
    })
    return () => {
      const { bordered, ghost, rootClass, destroyOnHidden } = props
      const collapseClassName = classNames(
        `${prefixCls.value}-icon-position-${mergedExpandIconPosition.value}`,
        {
          [`${prefixCls.value}-borderless`]: !bordered,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-ghost`]: !!ghost,
          [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value !== 'middle',
        },
        compCtx.value?.class,
        (attrs as any).class,
        rootClass,
        hashId.value,
        cssVarCls.value,
      )
      const labelRender = slots?.labelRender ?? props?.labelRender
      const contentRender = slots?.contentRender ?? props?.contentRender
      const items = (props.items ?? []).map((item, index) => {
        const label = checkRenderNode(labelRender ? labelRender?.({ item, index }) : item.label)
        const children = checkRenderNode(contentRender ? contentRender?.({ item, index }) : item.children)
        const _item = {
          ...item,
        }
        if (label) {
          _item.label = label
        }
        if (children) {
          _item.children = children
        }
        return _item
      })
      return wrapCSSVar(
        <VcCollapse
          openMotion={openMotion.value}
          {...omit(attrs, ['class', 'style'])}
          {...omit(props, ['rootClass', 'items'])}
          class={collapseClassName}
          prefixCls={prefixCls.value}
          style={[compCtx.value.style, (attrs as any).style]}
          expandIcon={renderExpandIcon}
          onChange={key => emit('change', key)}
          destroyOnHidden={destroyOnHidden}
          items={items}
        />,
      )
    }
  },
  {
    name: 'ACollapse',
    inheritAttrs: false,
  },
)

;(Collapse as any).install = (app: App) => {
  app.component(Collapse.name, Collapse)
}
export default Collapse
