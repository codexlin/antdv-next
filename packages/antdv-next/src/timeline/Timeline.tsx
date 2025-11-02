import type { App, SlotsType } from 'vue'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { TimelineItemProps } from './TimelineItem.tsx'
import { classNames } from '@v-c/util'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
import { useBaseConfig } from '../config-provider/context.ts'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import useStyle from './style'
import TimelineItemList from './TimelineItemList.tsx'

export interface TimelineProps extends ComponentBaseProps {
  pending?: VueNode
  pendingDot?: VueNode
  reverse?: boolean
  mode?: 'left' | 'alternate' | 'right'
  items?: TimelineItemProps[]
  dotRender?: (params: { item: TimelineItemProps, index: number }) => void
  labelRender?: (params: { item: TimelineItemProps, index: number }) => void
  contentRender?: (params: { item: TimelineItemProps, index: number }) => void
}

export interface TimelineSlots {
  pending?: () => void
  pendingDot?: () => void
  dotRender?: (params: { item: TimelineItemProps, index: number }) => void
  labelRender?: (params: { item: TimelineItemProps, index: number }) => void
  contentRender?: (params: { item: TimelineItemProps, index: number }) => void
}

const Timeline = defineComponent<
  TimelineProps,
  EmptyEmit,
  string,
  SlotsType<TimelineSlots>
>(
  (props, { slots, attrs }) => {
    const { prefixCls, direction, timeline } = useBaseConfig('timeline', props)

    // Style
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    return () => {
      return (
        <TimelineItemList
          {...omit(attrs, ['class', 'style'])}
          {...omit(props, ['items', 'prefixCls'])}
          class={classNames(
            timeline.value?.class,
            (attrs as any).class,
            cssVarCls.value,
            rootCls.value,
          )}
          style={[timeline?.value?.style, (attrs as any).style]}
          prefixCls={prefixCls.value}
          direction={direction.value}
          items={props.items}
          hashId={hashId.value}
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'ATimeline',
    inheritAttrs: false,
  },
)

;(Timeline as any).install = (app: App) => {
  app.component(Timeline.name, Timeline)
}

export default Timeline
