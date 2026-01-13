import type { Ref } from 'vue'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { toRef } from 'vue'

export function getSlotPropFn(slots: any, props: any, key: string) {
  // TODO: 需要考虑 function slot
  const fn = slots[key] || props[key]
  if (typeof fn === 'function') {
    return fn
  }
  return () => [fn]
}

export function getSlotPropsFnRun(slots: any, props: any, key: string, isNull = true, params?: any) {
  const fn = getSlotPropFn(slots, props, key)
  if (typeof fn === 'function') {
    let node = fn?.(params)
    if (!Array.isArray(node)) {
      node = [node]
    }
    if (node && node.length === 1 && node[0] === null) {
      return null
    }
    const nodes = filterEmpty(node).filter(node => node !== undefined && node !== null)
    if (nodes.length) {
      if (nodes.length === 1) {
        return nodes[0]
      }
      return nodes
    }
    return isNull ? null : undefined
  }
  return fn
}

export function toPropsRefs<T extends Record<string, any>, K extends keyof T>(obj: T, ...args: K[]) {
  const _res: Record<any, any> = {}
  args.forEach((key) => {
    _res[key] = toRef(obj, key)
  })
  return _res as { [key in K]-?: Ref<T[key]> }
}

export const clsx = classNames
