import type { DerivativeFunc } from '@antdv-next/cssinjs'
import type { CSSProperties, InjectionKey, Ref } from 'vue'
import type { WarningContextProps } from '../_util/warning.ts'
import type { ShowWaveEffect } from '../_util/wave/interface.ts'
import type { AlertProps } from '../alert'
import type { BadgeProps } from '../badge'
import type { ButtonProps } from '../button'
import type { CollapseProps } from '../collapse/Collapse.tsx'
import type { DescriptionsProps } from '../descriptions'
import type { EmptyProps } from '../empty'
import type { FlexProps } from '../flex'
import type { Locale } from '../locale'
import type { SpaceProps } from '../space'
import type { SpinProps } from '../spin'
import type { TagProps } from '../tag'
import type { AliasToken, MapToken, OverrideToken, SeedToken } from '../theme/interface'
import type { RenderEmptyHandler } from './defaultRenderEmpty.tsx'
import { computed, inject, provide, ref } from 'vue'

export const defaultPrefixCls = 'ant'
export const defaultIconPrefixCls = 'anticon'
const EMPTY_OBJECT = {}

type GetClassNamesOrEmptyObject<Config extends { classes?: any }> = Config extends {
  classes?: infer ClassNames
}
  ? ClassNames
  : object

type GetStylesOrEmptyObject<Config extends { styles?: any }> = Config extends {
  styles?: infer Styles
}
  ? Styles
  : object

type ComponentReturnType<T extends keyof ConfigComponentProps> = Omit<
  NonNullable<ConfigComponentProps[T]>,
    'classes' | 'styles'
> & {
  classes: GetClassNamesOrEmptyObject<NonNullable<ConfigComponentProps[T]>>
  styles: GetStylesOrEmptyObject<NonNullable<ConfigComponentProps[T]>>
  getPrefixCls: ConfigConsumerProps['getPrefixCls']
  direction: ConfigConsumerProps['direction']
  getPopupContainer: ConfigConsumerProps['getPopupContainer']
}
export interface Theme {
  primaryColor?: string
  infoColor?: string
  successColor?: string
  processingColor?: string
  errorColor?: string
  warningColor?: string
}

export interface CSPConfig {
  nonce?: string
}

export type DirectionType = 'ltr' | 'rtl' | undefined

export type MappingAlgorithm = DerivativeFunc<SeedToken, MapToken>

export interface ComponentBaseProps {
  rootClass?: string
  prefixCls?: string
}

type ComponentsConfig = {
  [key in keyof OverrideToken]?: OverrideToken[key] & {
    algorithm?: boolean | MappingAlgorithm | MappingAlgorithm[]
  };
}

export interface ThemeConfig {
  /**
   * @descCN 用于修改 Design Token。
   * @descEN Modify Design Token.
   */
  token?: Partial<AliasToken>
  /**
   * @descCN 用于修改各个组件的 Component Token 以及覆盖该组件消费的 Alias Token。
   * @descEN Modify Component Token and Alias Token applied to components.
   */
  components?: ComponentsConfig
  /**
   * @descCN 用于修改 Seed Token 到 Map Token 的算法。
   * @descEN Modify the algorithms of theme.
   * @default defaultAlgorithm
   */
  algorithm?: MappingAlgorithm | MappingAlgorithm[]
  /**
   * @descCN 是否继承外层 `ConfigProvider` 中配置的主题。
   * @descEN Whether to inherit the theme configured in the outer layer `ConfigProvider`.
   * @default true
   */
  inherit?: boolean
  /**
   * @descCN 是否开启 `hashed` 属性。如果你的应用中只存在一个版本的 antd，你可以设置为 `false` 来进一步减小样式体积。
   * @descEN Whether to enable the `hashed` attribute. If there is only one version of antd in your application, you can set `false` to reduce the bundle size.
   * @default true
   * @since 5.0.0
   */
  hashed?: boolean
  /**
   * @descCN 通过 `cssVar` 配置来开启 CSS 变量模式，这个配置会被继承。
   * @descEN Enable CSS variable mode through `cssVar` configuration, This configuration will be inherited.
   * @default false
   * @since 5.12.0
   */
  cssVar?:
    | {
      /**
       * @descCN css 变量的前缀
       * @descEN Prefix for css variable.
       * @default ant
       */
      prefix?: string
      /**
       * @descCN 主题的唯一 key，版本低于 react@18 时需要手动设置。
       * @descEN Unique key for theme, should be set manually < react@18.
       */
      key?: string
    }
    | boolean
}

export interface ComponentStyleConfig {
  class?: string
  style?: CSSProperties
  classes?: any
  styles?: any
}

export type PopupOverflow = 'viewport' | 'scroll'

export const Variants = ['outlined', 'borderless', 'filled', 'underlined'] as const

export type Variant = (typeof Variants)[number]

export interface WaveConfig {
  /**
   * @descCN 是否禁用水波纹效果。
   * @descEN Whether to disable wave effect.
   * @default false
   */
  disabled?: boolean
  /**
   * @descCN 自定义水波纹效果。
   * @descEN Customized wave effect.
   */
  showEffect?: ShowWaveEffect
}

export type SpaceConfig = ComponentStyleConfig & Pick<SpaceProps, 'size' | 'classes' | 'styles'>

export type ButtonConfig = ComponentStyleConfig
  & Pick<ButtonProps, 'classes' | 'styles' | 'autoInsertSpace' | 'variant' | 'color' | 'shape'>

export type FlexConfig = ComponentStyleConfig & Pick<FlexProps, 'vertical'>

export type AlertConfig = ComponentStyleConfig & Pick<AlertProps, 'closable' | 'closeIcon'>

export type BadgeConfig = ComponentStyleConfig & Pick<BadgeProps, 'classes' | 'styles'>

export type TagConfig = ComponentStyleConfig & Pick<TagProps, 'closeIcon' | 'closable'>

export type EmptyConfig = ComponentStyleConfig & Pick<EmptyProps, 'classes' | 'styles' | 'image'>

export type SpinConfig = ComponentStyleConfig & Pick<SpinProps, 'indicator'>

export type DescriptionsConfig = ComponentStyleConfig & Pick<DescriptionsProps, 'styles' | 'classes'>

export type CollapseConfig = ComponentStyleConfig & Pick<CollapseProps, 'expandIcon'>

export interface ConfigComponentProps {
  // input?: InputConfig;
  // textArea?: TextAreaConfig;
  // inputNumber?: InputNumberConfig;
  // pagination?: PaginationConfig;
  space?: SpaceConfig
  splitter?: ComponentStyleConfig
  // form?: FormConfig;
  // select?: SelectConfig;
  alert?: AlertConfig
  anchor?: ComponentStyleConfig
  button?: ButtonConfig
  divider?: ComponentStyleConfig
  // drawer?: DrawerConfig;
  calendar?: ComponentStyleConfig
  carousel?: ComponentStyleConfig
  // cascader?: CascaderConfig;
  // treeSelect?: TreeSelectConfig;
  collapse?: CollapseConfig
  // floatButton?: FloatButtonConfig;
  // floatButtonGroup?: FloatButtonGroupConfig;
  typography?: ComponentStyleConfig
  skeleton?: ComponentStyleConfig
  spin?: SpinConfig
  segmented?: ComponentStyleConfig
  steps?: ComponentStyleConfig
  statistic?: ComponentStyleConfig
  // image?: ImageConfig;
  layout?: ComponentStyleConfig
  // list?: ListConfig;
  // mentions?: MentionsConfig;
  // modal?: ModalConfig;
  progress?: ComponentStyleConfig
  result?: ComponentStyleConfig
  // slider?: SliderConfig;
  breadcrumb?: ComponentStyleConfig
  // menu?: MenuConfig;
  checkbox?: ComponentStyleConfig
  descriptions?: DescriptionsConfig
  empty?: EmptyConfig
  badge?: BadgeConfig
  radio?: ComponentStyleConfig
  rate?: ComponentStyleConfig
  switch?: ComponentStyleConfig
  // transfer?: TransferConfig;
  avatar?: ComponentStyleConfig
  message?: ComponentStyleConfig
  tag?: TagConfig
  // table?: TableConfig;
  // card?: CardConfig;
  // tabs?: TabsConfig;
  timeline?: ComponentStyleConfig
  // timePicker?: TimePickerConfig;
  // tour?: TourConfig;
  // tooltip?: TooltipConfig;
  // popover?: PopoverConfig;
  // popconfirm?: PopconfirmConfig;
  // upload?: UploadConfig;
  // notification?: NotificationConfig;
  tree?: ComponentStyleConfig
  colorPicker?: ComponentStyleConfig
  // datePicker?: DatePickerConfig;
  // rangePicker?: RangePickerConfig;
  dropdown?: ComponentStyleConfig
  flex?: FlexConfig
  wave?: WaveConfig
}

export interface ConfigConsumerProps extends ConfigComponentProps {
  getTargetContainer?: () => HTMLElement
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement
  rootPrefixCls?: string
  iconPrefixCls: string
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string
  renderEmpty?: RenderEmptyHandler
  /**
   * @descCN 设置 [Content Security Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP) 配置。
   * @descEN Set the [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) config.
   */
  csp?: CSPConfig
  /** @deprecated Please use `{ button: { autoInsertSpace: boolean }}` instead */
  autoInsertSpaceInButton?: boolean
  // variant?: Variant
  virtual?: boolean
  locale?: Locale
  direction?: DirectionType
  popupMatchSelectWidth?: boolean
  // popupOverflow?: PopupOverflow
  theme?: ThemeConfig
  warning?: WarningContextProps
  wave?: WaveConfig
}

const ConfigConsumerKey: InjectionKey<Ref<ConfigConsumerProps>> = Symbol('ConfigConsumerContext')

export function useConfigProvider(props: Ref<ConfigConsumerProps>) {
  provide(ConfigConsumerKey, props)
}

function defaultGetPrefixCls(suffixCls?: string, customizePrefixCls?: string) {
  if (customizePrefixCls) {
    return customizePrefixCls
  }
  return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls
}

export function useConfig() {
  return inject(ConfigConsumerKey, ref({
    // We provide a default function for Context without provider
    getPrefixCls: defaultGetPrefixCls,
    iconPrefixCls: defaultIconPrefixCls,
  }) as Ref<ConfigConsumerProps>)
}

/**
 * Utility type to convert ConfigConsumerProps to a reactive refs structure.
 * Functions remain as-is, other values are wrapped in Ref.
 */
export type ConfigRefs<R extends ConfigConsumerProps = ConfigConsumerProps> = {
  [K in keyof R]?: R[K] extends (...args: any[]) => any
    ? R[K]
    : R[K] extends object | undefined
      ? Ref<R[K]>
      : Ref<R[K]>
}

export function useBaseConfig<K extends string>(suffixCls?: K, props?: ComponentBaseProps) {
  const config = useConfig()
  return {
    result: computed(() => config.value?.result),
    timeline: computed(() => config.value?.timeline),
    getPrefixCls: (suffixCls?: string, prefixCls?: string) => config.value?.getPrefixCls(suffixCls, prefixCls),
    prefixCls: computed(() => {
      return config.value?.getPrefixCls(suffixCls, props?.prefixCls)
    }),
    direction: computed(() => {
      return config.value?.direction
    }),
    getPopupContainer: config?.value.getPopupContainer,
  }
}

/**
 * Get ConfigProvider configured component props.
 * This help to reduce bundle size for saving `?.` operator.
 * Do not use as `useMemo` deps since we do not cache the object here.
 *
 * NOTE: not refactor this with `useMemo` since memo will cost another memory space,
 * which will waste both compare calculation & memory.
 */
export function useComponentConfig<T extends keyof ConfigComponentProps>(propName: T) {
  const context = useConfig()
  return computed(() => {
    const { getPrefixCls, direction, getPopupContainer } = context.value
    const propValue: ConfigConsumerProps[T] = context.value[propName]

    return {
      classes: EMPTY_OBJECT,
      styles: EMPTY_OBJECT,
      ...propValue,
      getPrefixCls,
      direction,
      getPopupContainer,
    } as ComponentReturnType<T>
  })
}
