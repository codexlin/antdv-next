import type { Ref } from 'vue'
import type { KeyType } from '../Cache'
import { computed, watch } from 'vue'
import { pathKey } from '../Cache'
import { useStyleContext } from '../StyleContext'
import { isClientSide } from '../util'

export type ExtractStyle<CacheValue> = (
  cache: CacheValue,
  effectStyles: Record<string, boolean>,
  options?: {
    plain?: boolean
    autoPrefix?: boolean
  },
) => [order: number, styleId: string, style: string] | null
const effectMap = new Map<string, boolean>()

/**
 * Global cache for CSS-in-JS styles
 *
 * This hook manages a reference-counted cache to ensure styles are properly
 * created, shared, and cleaned up across component instances.
 *
 * Key differences from React version:
 * - No useInsertionEffect needed - Vue's watchEffect handles timing naturally
 * - No StrictMode double-mounting issues - Vue doesn't double-mount
 * - HMR handling is simpler - can rely on Vue's reactivity system
 * - No need for cleanup register pattern - onBeforeUnmount is sufficient
 */
export function useGlobalCache<CacheType>(
  prefix: Ref<string>,
  keyPath: Ref<KeyType[]>,
  cacheFn: () => CacheType,
  onCacheRemove?: (cache: CacheType, fromHMR: boolean) => void,
  // Add additional effect trigger
  onCacheEffect?: (cachedValue: CacheType) => void,
): Ref<CacheType> {
  const styleContext = useStyleContext()
  const fullPath = computed(() => [prefix.value, ...keyPath.value])
  const fullPathStr = computed(() => pathKey(fullPath.value))

  type UpdaterArgs = [times: number, cache: CacheType]

  const buildCache = (updater?: (data: UpdaterArgs) => UpdaterArgs) => {
    const globalCache = styleContext.value.cache
    globalCache.opUpdate(fullPathStr.value, (prevCache) => {
      const [times = 0, cache] = prevCache || [undefined, undefined]
      const mergedCache = cache || cacheFn()
      const data: UpdaterArgs = [times, mergedCache]

      return updater ? updater(data) : data
    })
  }

  const getCacheEntity = () => styleContext.value.cache.opGet(fullPathStr.value)

  buildCache()

  const cacheContent = computed(() => {
    let entity = styleContext.value.cache.opGet(fullPathStr.value)

    // 在所有环境下检查 entity 是否存在，避免生产环境下主题切换时缓存为空导致的错误
    if (!entity) {
      buildCache()
      entity = getCacheEntity()
    }

    return entity![1]!
  })

  // Initial cache creation - watch for keyPath changes
  watch(
    fullPathStr,
    (_, _1, onCleanup) => {
      const currentPath = fullPathStr.value
      buildCache(([times, cache]) => [times + 1, cache])
      if (!effectMap.has(currentPath)) {
        onCacheEffect?.(cacheContent.value)
        effectMap.set(currentPath, true)
        // 微任务清理混存，可以认为是单次 batch render 中只触发一次 effect
        Promise.resolve().then(() => {
          effectMap.delete(currentPath)
        })
      }
      const globalCache = styleContext.value.cache
      const isServerSide = styleContext.value.mock !== undefined
        ? styleContext.value.mock === 'server'
        : !isClientSide

      // Cleanup on unmount or when fullPathStr changes
      onCleanup(() => {
        if (isServerSide) {
          return
        }
        globalCache.opUpdate(currentPath, (prevCache) => {
          // if (!prevCache)
          //   return null
          const [times = 0, cache] = prevCache || []
          const nextCount = times - 1

          if (nextCount === 0) {
          // Last reference, remove cache
            onCacheRemove?.(cache, false)
            effectMap.delete(currentPath)
            return null
          }

          return [times - 1, cache]
        })
      })
    },
    {
      immediate: true,
    },
  )

  return cacheContent
}
