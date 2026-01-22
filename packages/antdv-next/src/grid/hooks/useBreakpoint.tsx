import type { Ref } from 'vue'
import type { ScreenMap } from '../../_util/responsiveObserver'
import canUseDom from '@v-c/util/dist/Dom/canUseDom'
import { nextTick, ref, unref, watchEffect } from 'vue'
import useResponsiveObserver from '../../_util/responsiveObserver'

export function useBreakpoint(
  refreshOnChange: boolean | Ref<boolean> = true,
  defaultScreens: ScreenMap | null | Ref<ScreenMap | null> = {} as ScreenMap,
) {
  const screensRef = ref<ScreenMap | null>(unref(defaultScreens))
  const responsiveObserver = useResponsiveObserver()

  watchEffect(async (onCleanup) => {
    if (!canUseDom()) {
      return
    }
    await nextTick()
    const token = responsiveObserver.value?.subscribe(
      (supportScreens) => {
        screensRef.value = unref(supportScreens)
        if (unref(refreshOnChange)) {
          // TODO: trigger component update
        }
      },
    )
    onCleanup(() => {
      responsiveObserver.value.unsubscribe(token)
    })
  })

  return screensRef
}

export default useBreakpoint
