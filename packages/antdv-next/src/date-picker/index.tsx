import type { Dayjs } from 'dayjs'
import type { App } from 'vue'
import type {
  RangePickerProps as BaseRangePickerProps,
  PickerProps,
  PickerPropsWithMultiple,
} from './generatePicker/interface'
import dayjsGenerateConfig from '@v-c/picker/generate/dayjs'
import generatePicker from './generatePicker'

export type { PickerLocale } from './generatePicker'

export type DatePickerProps<
  ValueType = Dayjs,
  IsMultiple extends boolean = boolean,
> = PickerPropsWithMultiple<Dayjs, PickerProps<Dayjs>, ValueType, IsMultiple>

export type MonthPickerProps<ValueType = Dayjs | Dayjs> = Omit<
  DatePickerProps<ValueType>,
  'picker'
>

export type WeekPickerProps<ValueType = Dayjs | Dayjs> = Omit<
  DatePickerProps<ValueType>,
  'picker'
>

export type RangePickerProps = BaseRangePickerProps<Dayjs>

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)

export type DatePickerType = typeof DatePicker & {
  generatePicker: typeof generatePicker
}

;(DatePicker as DatePickerType).generatePicker = generatePicker

;(DatePicker as any).install = (app: App) => {
  app.component(DatePicker.name, DatePicker)
  app.component(DatePicker.WeekPicker.name, DatePicker.WeekPicker)
  app.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker)
  app.component(DatePicker.YearPicker.name, DatePicker.YearPicker)
  app.component(DatePicker.QuarterPicker.name, DatePicker.QuarterPicker)
  app.component(DatePicker.RangePicker.name, DatePicker.RangePicker)
  app.component(DatePicker.TimePicker.name, DatePicker.TimePicker)
}

export default DatePicker as DatePickerType

export const DateRangePicker = DatePicker.RangePicker
export const DateWeekPicker = DatePicker.WeekPicker
export const DateMonthPicker = DatePicker.MonthPicker
export const DateYearPicker = DatePicker.YearPicker
export const DateQuarterPicker = DatePicker.QuarterPicker
export const DateTimePicker = DatePicker.TimePicker
