import type { LiteralUnion } from '@v-c/util/dist/type'
import type { App, CSSProperties } from 'vue'
import type { PresetStatusColorType } from '../_util/colors.ts'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { PresetColorKey } from '../theme/interface'
import { cloneVNode, computed, defineComponent, shallowRef, watchEffect } from 'vue'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useConfig } from '../config-provider/context.ts'
import useStyle from './style'

type SemanticName = 'root' | 'indicator'

export interface BadgeProps extends ComponentBaseProps {
  /** Number to show in badge */
  count?: VueNode
  showZero?: boolean
  /** Max count to show */
  overflowCount?: number
  /** Whether to show red dot without number */
  dot?: boolean
  scrollNumberPrefixCls?: string
  status?: PresetStatusColorType
  color?: LiteralUnion<PresetColorKey>
  text?: VueNode
  size?: 'default' | 'small'
  offset?: [number | string, number | string]
  title?: string
  classes?: Partial<Record<SemanticName, string>>
  styles?: Partial<Record<SemanticName, CSSProperties>>
}

const defaultProps = {
  count: null,
  overflowCount: 99,
  size: 'default',
} as any

const InternalBadge = defineComponent<BadgeProps>(
  (props = defaultProps, { slots, emit, attrs }) => {
    const configContext = useConfig()
    const prefixCls = computed(() => configContext.value.getPrefixCls('badge', props.prefixCls))
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value)

    // ================================ Misc ================================
    const numberedDisplayCount = computed(() => {
      const { count, overflowCount } = props
      return ((count as number) > (overflowCount as number) ? `${overflowCount}+` : count) as string | number | null
    })

    const isZero = computed(() => numberedDisplayCount.value === '0' || numberedDisplayCount.value === 0 || props.text === '0' || props.text === 0)
    const ignoreCount = computed(() => props.count === null || (isZero.value && !props.showZero))
    const hasStatus = computed(() => {
      const { status, color } = props
      return ((status !== null && status !== undefined) || (color !== null && color !== undefined))
        && ignoreCount.value
    })
    const hasStatusValue = computed(() => (props.status !== null && props.status !== undefined) || !isZero.value)
    const showAsDot = computed(() => props.dot && !isZero.value)

    const mergedCount = computed(() => showAsDot.value ? '' : numberedDisplayCount.value)
    const isHidden = computed(() => {
      const text = props.text
      const isEmpty = (mergedCount.value === null || mergedCount.value === undefined || mergedCount.value === '')
        && (text === undefined || text === null || text === '')
      return (isEmpty || (isZero.value && !props.showZero)) && !showAsDot.value
    })
    // Count should be cache in case hidden change it
    const countRef = shallowRef(props.count)
    watchEffect(() => {
      if (!isHidden.value) {
        countRef.value = props.count
      }
    })
    const livingCount = computed(() => countRef.value)

    // We need cache count since remove motion should not change count display
    const displayCountRef = shallowRef(mergedCount.value)
    watchEffect(() => {
      if (!isHidden.value) {
        displayCountRef.value = mergedCount.value
      }
    })
    const diplayCount = computed(() => displayCountRef.value)

    // We will cache the dot status to avoid shaking on leaved motion
    const isDotRef = shallowRef(showAsDot.value)
    watchEffect(() => {
      if (!isHidden.value) {
        isDotRef.value = showAsDot.value
      }
    })

    // =============================== Styles ===============================
    const mergedStyle = computed(() => {
      const { offset } = props
      if (!offset) {
        return [configContext.value.badge?.style, attrs.style]
      }
      const offsetStyle: CSSProperties = {
        marginTop: `${offset[1]}px`,
      }
      if (configContext.value.direction === 'rtl') {
        offsetStyle.left = `${Number.parseInt(offset[0] as string, 10)}px`
      }
      else {
        offsetStyle.right = `-${Number.parseInt(offset[0] as string, 10)}px`
      }
      return [
        offsetStyle,
        configContext.value.badge?.style,
        attrs.style,
      ]
    })
    return () => {
      const { title, showZero } = props
      // =============================== Render ===============================
      // >>> Title
      const titleNode = title ?? (typeof livingCount.value === 'string' || typeof livingCount.value === 'number' ? livingCount.value : undefined)
      const text = getSlotPropsFnRun(slots, props, 'text')
      // >>> Status Text
      const showStatusTextNode = !isHidden.value && (text === 0 ? showZero : !!text && text !== true)
      const statusTextNode = !showStatusTextNode
        ? null
        : (<span class={`${prefixCls}-status-text`}>{text}</span>)

      // >>> Display Component
      const count = getSlotPropsFnRun(slots, props, 'count')
      const displayNode = !livingCount.value || typeof livingCount.value !== 'object' ? undefined : (cloneVNode(livingCount.value, {}))
      return null
    }
  },
  {
    name: 'ABadge',
    inheritAttrs: false,
  },
)

;(InternalBadge as any).install = (app: App) => {
  app.component(InternalBadge.name, InternalBadge)
}
export default InternalBadge
