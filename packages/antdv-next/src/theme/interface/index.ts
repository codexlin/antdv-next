import type { CSSInterpolation, DerivativeFunc } from '@antdv-next/cssinjs'
import type { VNodeChild } from 'vue'
import type { AnyObject } from '../../_util/type.ts'

import type { AliasToken } from './alias'

export type { ComponentTokenMap } from './components'
export type {
  FullToken,
  GenStyleFn,
  GetDefaultToken,
  GlobalToken,
  OverrideComponent,
  OverrideToken,
} from './cssinjs-utils'

export type {
  ColorMapToken,
  ColorNeutralMapToken,
  CommonMapToken,
  FontMapToken,
  HeightMapToken,
  MapToken,
  SizeMapToken,
  StyleMapToken,
} from './maps'
export { PresetColors } from './presetColors'
export type {
  ColorPalettes,
  LegacyColorPalettes,
  PresetColorKey,
  PresetColorType,
} from './presetColors'

export type { SeedToken } from './seeds'

export type TokenType = object

export type GenerateStyle<
  ComponentToken extends AnyObject = AliasToken,
  ReturnType = CSSInterpolation,
> = (token: ComponentToken) => ReturnType

export type UseComponentStyleResult = [(node: VNodeChild) => VNodeChild, string]

export type {
  AliasToken,
  CSSInterpolation,
  DerivativeFunc,
}
