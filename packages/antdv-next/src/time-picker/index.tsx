import type { PickerMode, PickerRef } from '@v-c/picker'
import type { App, CSSProperties, SlotsType } from 'vue'
import type {
  SemanticClassNames,
  SemanticClassNamesType,
  SemanticStyles,
  SemanticStylesType,
} from '../_util/hooks'

import type { InputStatus } from '../_util/statusUtils'
import type { AnyObject, VueNode } from '../_util/type'
import type {
  GenericTimePickerProps,
  PickerPropsWithMultiple,
  RangePickerProps,
} from '../date-picker/generatePicker'
import { computed, defineComponent, shallowRef } from 'vue'
import { toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import DatePicker from '../date-picker'
import useMergedPickerSemantic from '../date-picker/hooks/useMergedPickerSemantic'
import { useVariants } from '../form/hooks/useVariant'

export type PanelSemanticName = 'root' | 'content' | 'item' | 'footer' | 'container'

type PickerSemanticName = 'root' | 'prefix' | 'input' | 'suffix'

export type TimePickerClassNames = SemanticClassNamesType<
  TimePickerProps,
  PickerSemanticName,
  { popup?: string | SemanticClassNames<PanelSemanticName> }
>

export type TimePickerStyles = SemanticStylesType<
  TimePickerProps,
  PickerSemanticName,
  { popup?: SemanticStyles<PanelSemanticName> }
>

export type PickerTimeProps<DateType extends AnyObject> = PickerPropsWithMultiple<
  DateType,
  GenericTimePickerProps<DateType>
>

export type RangePickerTimeProps<DateType extends AnyObject> = Omit<
  RangePickerProps<DateType>,
  'showTime' | 'picker'
>

const { TimePicker: InternalTimePicker, RangePicker: InternalRangePicker } = DatePicker

export interface TimePickerLocale {
  placeholder?: string
  rangePlaceholder?: [string, string]
}

export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<AnyObject>, 'picker'> {
  /** @deprecated Please use `classes.popup` instead */
  popupClassName?: string
  /** @deprecated Please use `styles.popup` instead */
  popupStyle?: CSSProperties
}

export interface TimeRangePickerEmits<DateType = AnyObject> {
  'change': (dates: DateType[] | null, dateStrings: [string, string]) => void
  'update:value': (dates: DateType[] | null) => void
  'calendarChange': (dates: DateType[], dateStrings: [string, string], info: any) => void
  'panelChange': (dates: DateType[], modes: [PickerMode, PickerMode]) => void
  'openChange': (open: boolean) => void
  'ok': (dates: DateType[]) => void
  'focus': (e: FocusEvent, info: any) => void
  'blur': (e: FocusEvent, info: any) => void
  'keydown': (e: KeyboardEvent, preventDefault: VoidFunction) => void
  [key: string]: (...args: any[]) => void
}

const RangePicker = defineComponent<
  TimeRangePickerProps,
  TimeRangePickerEmits
>(
  (props, { slots, emit, expose, attrs }) => {
    const rangeRef = shallowRef<PickerRef>()

    const onChange = (dates: AnyObject[] | null, dateStrings: [string, string]) => {
      emit('update:value', dates)
      emit('change', dates, dateStrings)
    }

    const onCalendarChange = (dates: AnyObject[], dateStrings: [string, string], info: any) => {
      emit('calendarChange', dates, dateStrings, info)
    }

    const onPanelChange = (dates: AnyObject[], modes: [PickerMode, PickerMode]) => {
      emit('panelChange', dates, modes)
    }

    const onOpenChange = (open: boolean) => {
      emit('openChange', open)
    }

    const onOk = (dates: AnyObject[]) => {
      emit('ok', dates)
    }

    const onFocus = (e: FocusEvent, info: any) => {
      emit('focus', e, info)
    }

    const onBlur = (e: FocusEvent, info: any) => {
      emit('blur', e, info)
    }

    const onKeyDown = (e: KeyboardEvent, preventDefault: VoidFunction) => {
      emit('keydown', e, preventDefault)
    }

    expose({
      focus: (options?: FocusOptions) => rangeRef.value?.focus?.(options as any),
      blur: () => rangeRef.value?.blur?.(),
      nativeElement: computed(() => rangeRef.value?.nativeElement),
    })

    return () => (
      <InternalRangePicker
        {...attrs}
        {...props as any}
        ref={rangeRef as any}
        picker="time"
        mode={undefined}
        onChange={onChange}
        onCalendarChange={onCalendarChange}
        onPanelChange={onPanelChange}
        onOpenChange={onOpenChange}
        onOk={onOk}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        v-slots={slots}
      />
    )
  },
  {
    name: 'ATimeRangePicker',
    inheritAttrs: false,
  },
)

export interface TimePickerProps
  extends Omit<PickerTimeProps<AnyObject>, 'picker' | 'classes' | 'styles'> {
  addon?: () => VueNode
  status?: InputStatus
  /** @deprecated Please use `classes.popup` instead */
  popupClassName?: string
  /** @deprecated Please use `styles.popup` instead */
  popupStyle?: CSSProperties
  rootClass?: string

  classes?: TimePickerClassNames
  styles?: TimePickerStyles
}

export interface TimePickerSlots {
  addon?: () => any
  renderExtraFooter?: (mode: PickerMode) => any
  suffixIcon?: () => any
  [key: string]: any
}

export interface TimePickerEmits<DateType = AnyObject> {
  'change': (date: DateType | DateType[] | null, dateString: string | string[]) => void
  'update:value': (date: DateType | DateType[] | null) => void
  'calendarChange': (date: DateType | DateType[], dateString: string | string[], info: any) => void
  'panelChange': (date: DateType, mode: PickerMode) => void
  'openChange': (open: boolean) => void
  'ok': (date: DateType | DateType[]) => void
  'select': (date: DateType) => void
  'focus': (e: FocusEvent, info: any) => void
  'blur': (e: FocusEvent, info: any) => void
  'keydown': (e: KeyboardEvent, preventDefault: VoidFunction) => void
  [key: string]: (...args: any[]) => void
}

const TimePicker = defineComponent<
  TimePickerProps,
  TimePickerEmits,
  string,
  SlotsType<TimePickerSlots>
>(
  (props, { slots, emit, expose, attrs }) => {
    const {
      variant,
      bordered,
      classes,
      styles,
      popupClassName,
      popupStyle,
    } = toPropsRefs(
      props,
      'variant',
      'bordered',
      'classes',
      'styles',
      'popupClassName',
      'popupStyle',
    )

    if (isDev) {
      const warning = devUseWarning('TimePicker')
      warning.deprecated(!props.addon, 'addon', 'renderExtraFooter')
    }

    const [mergedVariant] = useVariants('timePicker', variant, bordered)

    const mergedProps = computed(() => ({
      ...props,
      variant: mergedVariant.value,
    }))

    const [mergedClassNames, mergedStyles] = useMergedPickerSemantic<TimePickerProps>(
      'timePicker',
      classes,
      styles,
      popupClassName,
      popupStyle,
      mergedProps,
    )

    const pickerRef = shallowRef<PickerRef>()

    const onChange = (date: AnyObject | AnyObject[] | null, dateString: string | string[]) => {
      emit('update:value', date)
      emit('change', date, dateString)
    }

    const onCalendarChange = (date: AnyObject | AnyObject[], dateString: string | string[], info: any) => {
      emit('calendarChange', date, dateString, info)
    }

    const onPanelChange = (date: AnyObject, mode: PickerMode) => {
      emit('panelChange', date, mode)
    }

    const onOpenChange = (open: boolean) => {
      emit('openChange', open)
    }

    const onOk = (date: AnyObject | AnyObject[]) => {
      emit('ok', date)
    }

    const onSelect = (date: AnyObject) => {
      emit('select', date)
    }

    const onFocus = (e: FocusEvent, info: any) => {
      emit('focus', e, info)
    }

    const onBlur = (e: FocusEvent, info: any) => {
      emit('blur', e, info)
    }

    const onKeyDown = (e: KeyboardEvent, preventDefault: VoidFunction) => {
      emit('keydown', e, preventDefault)
    }

    const internalRenderExtraFooter = (mode: PickerMode) => {
      const renderSlot = slots.renderExtraFooter
      if (renderSlot) {
        return renderSlot(mode)
      }
      const renderExtraFooter = props.renderExtraFooter
      if (renderExtraFooter) {
        return renderExtraFooter(mode)
      }
      const addonSlot = slots.addon
      if (addonSlot) {
        return addonSlot()
      }
      const addon = props.addon
      if (addon) {
        return addon()
      }
      return undefined
    }

    expose({
      focus: (options?: FocusOptions) => pickerRef.value?.focus?.(options),
      blur: () => pickerRef.value?.blur?.(),
      nativeElement: computed(() => pickerRef.value?.nativeElement),
    })

    return () => {
      const {
        addon,
        renderExtraFooter,
        classes,
        styles,
        popupClassName,
        popupStyle,
        variant,
        bordered,
        ...restProps
      } = props

      return (
        <InternalTimePicker
          {...attrs}
          {...restProps}
          ref={pickerRef as any}
          mode={undefined}
          renderExtraFooter={internalRenderExtraFooter as any}
          variant={mergedVariant.value}
          classes={mergedClassNames.value as any}
          styles={mergedStyles.value as any}
          {
            ...{
              onChange,
              onCalendarChange,
              onPanelChange,
              onOpenChange,
              onOk,
              onSelect,
              onFocus,
              onBlur,
              onKeyDown,
            } as any
          }
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'ATimePicker',
    inheritAttrs: false,
  },
)

export type MergedTimePicker = typeof TimePicker & {
  RangePicker: typeof RangePicker
}

;(TimePicker as MergedTimePicker).RangePicker = RangePicker

;(TimePicker as any).install = (app: App) => {
  app.component(TimePicker.name, TimePicker)
  app.component(RangePicker.name, RangePicker)
}

export default TimePicker as MergedTimePicker

export const TimeRangePicker = RangePicker
