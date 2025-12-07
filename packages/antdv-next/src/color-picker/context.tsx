import type { Ref } from 'vue'
import type { AggregationColor } from './color'
import type { ModeOptions } from './hooks/useModeColor'
import type { ColorFormatType, ColorPickerEmits, ModeType, PresetsItem } from './interface'
import { computed, defineComponent, inject, provide, shallowRef } from 'vue'

export interface PanelPickerContextProps {
  prefixCls: string
  allowClear?: boolean
  disabled?: boolean
  disabledAlpha?: boolean
  mode: ModeType
  onModeChange: (mode: ModeType) => void
  modeOptions: ModeOptions
  value: AggregationColor
  onChange?: (value?: AggregationColor, fromPicker?: boolean) => void
  onChangeComplete?: ColorPickerEmits['changeComplete']
  format?: ColorFormatType
  onFormatChange?: ColorPickerEmits['formatChange']

  /** The gradient Slider active handle */
  activeIndex: number
  /** The gradient Slider handle active changed */
  onActive: (index: number) => void
  /** Is gradient Slider dragging */
  gradientDragging: boolean
  /** The gradient Slider dragging changed */
  onGradientDragging: (dragging: boolean) => void

  onClear?: () => void
  disabledFormat?: boolean
  // classes?: SemanticClassNames<any>
  // styles?: SemanticStyles<any>
}

export interface PanelPresetsContextProps {
  prefixCls: string
  presets?: PresetsItem[]
  disabled?: boolean
  value: AggregationColor
  onChange?: (value: AggregationColor) => void
  // classes?: SemanticClassNames<any>
  // styles?: SemanticStyles<any>
}

const PanelPickerContextKey = Symbol('PanelPickerContext')
const PanelPresetsContextKey = Symbol('PanelPresetsContext')

export function usePanelPickerProvider(value: Ref<PanelPickerContextProps>) {
  provide(PanelPickerContextKey, value)
}

export function usePanelPickerContext() {
  return inject<Ref<PanelPickerContextProps>>(PanelPickerContextKey, shallowRef({} as PanelPickerContextProps))
}

export const PanelPickerContextProvider = defineComponent<PanelPickerContextProps>(
  (props, { slots }) => {
    usePanelPickerProvider(computed(() => props))
    return () => slots.default?.()
  },
  {
    inheritAttrs: false,
  },
)

export function usePanelPresetsProvider(value: Ref<PanelPresetsContextProps>) {
  provide(PanelPresetsContextKey, value)
}

export function usePanelPresetsContext() {
  return inject<Ref<PanelPresetsContextProps>>(PanelPresetsContextKey, shallowRef({} as PanelPresetsContextProps))
}

export const PanelPresetsContextProvider = defineComponent<PanelPresetsContextProps>(
  (props, { slots }) => {
    usePanelPresetsProvider(computed(() => props))
    return () => slots.default?.()
  },
  {
    inheritAttrs: false,
  },
)
