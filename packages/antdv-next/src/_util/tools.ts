import { filterEmpty } from '@v-c/util/dist/props-util'

export function getSlotPropFn(slots: any, props: any, key: string) {
  // TODO: 需要考虑 function slot
  const fn = slots[key] || props[key]
  if (typeof fn === 'function') {
    return fn
  }
  return () => [fn]
}

export function getSlotPropsFnRun(slots: any, props: any, key: string) {
  const fn = getSlotPropFn(slots, props, key)
  if (typeof fn === 'function') {
    const nodes = filterEmpty(fn?.()).filter(v => v != null)
    if (nodes.length) {
      if (nodes.length === 1) {
        return nodes[0]
      }
      return nodes
    }
    return null
  }
  return fn
}
