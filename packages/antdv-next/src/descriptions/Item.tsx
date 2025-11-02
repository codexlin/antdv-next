import type { CSSProperties } from 'vue'
import type { Breakpoint } from '../_util/responsiveObserver.ts'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'

type SemanticName = 'label' | 'content'

export interface DescriptionsItemProps extends ComponentBaseProps {
  class?: string
  style?: CSSProperties
  label?: VueNode
  styles?: Partial<Record<SemanticName, CSSProperties>>
  classes?: Partial<Record<SemanticName, string>>
  content?: VueNode
  span?: number | 'filled' | { [key in Breakpoint]?: number }
}
