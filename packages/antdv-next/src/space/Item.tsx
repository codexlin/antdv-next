import type { SlotsType } from 'vue'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { defineComponent } from 'vue'
import { useSpaceContext } from './context.ts'

export interface ItemProps {
  index: number
  className: string
}

export interface ItemSlots {
  default?: () => any
  split?: () => any
}

const Item = defineComponent<ItemProps, Record<string, any>, string, SlotsType<ItemSlots>>(
  (props, { slots, attrs }) => {
    const spaceContext = useSpaceContext()
    return () => {
      const { index, className } = props
      const { latestIndex } = spaceContext.value
      const children = filterEmpty(slots?.default?.())
      const split = filterEmpty(slots?.split?.())
      if (children.length === 0) {
        return null
      }
      return (
        <>
          <div class={className} {...attrs}>
            {children}
          </div>
          {index < latestIndex && split.length && <span class={`${className}-split`}>{split}</span>}
        </>
      )
    }
  },
)

export default Item
