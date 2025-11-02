import type { LiteralUnion } from '@v-c/util/dist/type'
import type { CSSProperties, SlotsType } from 'vue'
import type { PresetColorType } from '../_util/colors.ts'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import { classNames } from '@v-c/util'
import { computed, defineComponent } from 'vue'
import { isPresetColor } from '../_util/colors.ts'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useConfig } from '../config-provider/context.ts'
import useStyle from './style/ribbon.ts'

export interface RibbonProps extends ComponentBaseProps {
  style?: CSSProperties
  text?: VueNode
  color?: LiteralUnion<PresetColorType>
  placement?: 'start' | 'end'
}

export interface RibbonSlots {
  default?: () => any
  text?: () => any
}

export default defineComponent<
  RibbonProps,
  EmptyEmit,
  string,
  SlotsType<RibbonSlots>
>(
  (props, { slots, attrs }) => {
    const configContext = useConfig()
    const prefixCls = computed(() => configContext.value.getPrefixCls('ribbon', props.prefixCls))
    const wrapperCls = computed(() => `${prefixCls.value}-wrapper`)
    const [hashId, cssVarCls] = useStyle(prefixCls, wrapperCls)

    return () => {
      const placement = props.placement ?? 'end'
      const { class: attrClass, style: attrStyle, ...restAttrs } = attrs
      const colorInPreset = isPresetColor(props.color, false)
      const colorStyle: CSSProperties = {}
      const cornerColorStyle: CSSProperties = {}
      if (props.color && !colorInPreset) {
        colorStyle.background = props.color
        cornerColorStyle.color = props.color
      }

      const textNodes = getSlotPropsFnRun(slots, props, 'text')
      const children = slots.default?.()

      return (
        <div
          class={classNames(wrapperCls.value, props.rootClass, hashId.value, cssVarCls.value)}
        >
          {children}
          <div
            {...restAttrs}
            class={classNames(
              prefixCls.value,
              `${prefixCls.value}-placement-${placement}`,
              {
                [`${prefixCls.value}-rtl`]: configContext.value.direction === 'rtl',
                [`${prefixCls.value}-color-${props.color}`]: colorInPreset,
              },
              attrClass as any,
              hashId.value,
            )}
            style={[colorStyle, props.style, attrStyle as any]}
          >
            <span class={`${prefixCls.value}-text`}>
              {Array.isArray(textNodes) ? textNodes : textNodes ?? props.text}
            </span>
            <div class={`${prefixCls.value}-corner`} style={cornerColorStyle} />
          </div>
        </div>
      )
    }
  },
  {
    name: 'ABadgeRibbon',
    inheritAttrs: false,
  },
)
