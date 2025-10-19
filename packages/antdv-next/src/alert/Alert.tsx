import type { AriaAttributes, SlotsType } from 'vue'
import type { ClosableType } from '../_util/hooks/useClosable'
import type { EmitsType, SlotsDefineType, VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context'
import { CheckCircleFilled, CloseCircleFilled, CloseOutlined, ExclamationCircleFilled, InfoCircleFilled } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, createVNode, defineComponent, shallowRef, Transition } from 'vue'
import { getSlotPropFn, getSlotPropsFnRun } from '../_util/tools.ts'
import { replaceElement } from '../_util/vueNode.ts'
import { useComponentConfig } from '../config-provider/context'
import useStyle from './style'

export interface AlertProps extends ComponentBaseProps {
  /** Type of Alert styles, options:`success`, `info`, `warning`, `error` */
  type?: 'success' | 'info' | 'warning' | 'error'
  /** Whether Alert can be closed */
  closable?: ClosableType
  /** Content of Alert */
  message?: VueNode
  /** Additional content of Alert */
  description?: VueNode
  /** Trigger when animation ending of Alert */
  afterClose?: () => void
  /** Whether to show icon */
  showIcon?: boolean
  /** https://www.w3.org/TR/2014/REC-html5-20141028/dom.html#aria-role-attribute */
  role?: string
  banner?: boolean
  icon?: VueNode
  closeIcon?: VueNode
  action?: VueNode

  id?: string
}

export type AlertSlots = SlotsDefineType<{
  message?: () => any
  description?: () => any
  icon?: () => any
  closeIcon?: () => any
  action?: () => any
}>

export type AlertEmits = EmitsType<{
  /** Callback when close Alert */
  close: (e: any) => any
  mouseenter: (e: any) => any
  mouseleave: (e: any) => any
  click: (e: any) => any
}>

const iconMapFilled = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
}

interface IconNodeProps {
  type: AlertProps['type']
  icon: AlertProps['icon']
  prefixCls: AlertProps['prefixCls']
  description: AlertProps['description']
}
const alertDefaultProps = {
  showIcon: undefined,
} as any

const IconNode = defineComponent<IconNodeProps>(
  (props) => {
    return () => {
      const { type, prefixCls, icon } = props
      const iconType = iconMapFilled[type!] || null
      // @ts-expect-error this
      const iconNode = filterEmpty(typeof icon === 'function' ? icon() : icon)[0]
      if (iconNode) {
        return replaceElement(iconNode, <span class={[`${prefixCls}-icon`]}>{iconNode}</span>, () => ({
          class: classNames(`${prefixCls}-icon`, iconNode?.props?.class),
        }))
      }
      return createVNode(
        iconType,
        { class: `${prefixCls}-icon` },
      )
    }
  },
)

interface CloseIconProps {
  isClosable: boolean
  prefixCls: AlertProps['prefixCls']
  closeIcon: AlertProps['closeIcon']
  handleClose: (e: MouseEvent) => void
  ariaProps: AriaAttributes
}

const CloseIconNode = defineComponent<CloseIconProps>(
  (props, { slots }) => {
    return () => {
      const { isClosable, prefixCls, handleClose, ariaProps } = props
      const closeIcon = getSlotPropsFnRun(slots, props, 'closeIcon')
      const mergedCloseIcon = !closeIcon ? <CloseOutlined /> : closeIcon
      return isClosable
        ? (
            <button
              type="button"
              onClick={handleClose}
              class={`${prefixCls}-close-icon`}
              tabindex={0}
              {...ariaProps}
            >
              {mergedCloseIcon}
            </button>
          )
        : null
    }
  },
)
const Alert = defineComponent<
  AlertProps,
  AlertEmits,
  string,
  SlotsType<AlertSlots>
>(
  (props = alertDefaultProps, { slots, emit, attrs }) => {
    const configContext = useComponentConfig('alert')
    const prefixCls = computed(() => configContext.value?.getPrefixCls('alert', props.prefixCls))
    const closed = shallowRef(false)
    const internalRef = shallowRef<HTMLDivElement>()
    const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls.value)
    const handleClose = (e?: MouseEvent) => {
      closed.value = true
      emit('close', e)
    }

    const type = computed(() => {
      if (props.type) {
        return props.type
      }
      // banner mode defaults to 'warning'
      return props?.banner ? 'warning' : 'info'
    })
    const handleBeforeLeave = (el: Element) => {
      if (el) {
        const _el = el as HTMLDivElement
        _el.style.maxHeight = `${_el.offsetHeight}px`
      }
    }
    return () => {
      const { closable, banner, showIcon, rootClass } = props
      // closeable when closeText or closeIcon is assigned
      const isClosableFn = () => {
        const closeIcon = getSlotPropFn(slots, props, 'closeIcon')
        if (typeof closable === 'object' && closable.closeIcon)
          return true
        if (typeof closable === 'boolean') {
          return closable
        }

        const closeIconNode = typeof closeIcon === 'function' ? filterEmpty(closeIcon()) : closeIcon
        if (Array.isArray(closeIconNode) && closeIconNode.length > 0) {
          return true
        }
        if (closeIconNode) {
          return true
        }
        // should be true when closeIcon is 0 or ''
        if (closeIcon !== false && closeIcon !== null && closeIcon !== undefined) {
          return true
        }
        return !!configContext.value?.closable
      }
      const isClosable = isClosableFn()
      const message = getSlotPropsFnRun(slots, props, 'message')
      const description = getSlotPropsFnRun(slots, props, 'description')
      const action = getSlotPropsFnRun(slots, props, 'action')
      // banner mode defaults to Icon
      const isShowIcon = banner && showIcon === undefined ? true : showIcon
      const alertCls = classNames(
        prefixCls.value,
        `${prefixCls.value}-${type.value}`,
        {
          [`${prefixCls.value}-with-description`]: !!description,
          [`${prefixCls.value}-no-icon`]: !isShowIcon,
          [`${prefixCls.value}-banner`]: !!banner,
          [`${prefixCls.value}-rtl`]: configContext.value?.direction === 'rtl',
        },
        configContext.value?.class,
        rootClass,
        cssVarCls,
        hashId,
      )
      const mergedCloseIconFn = () => {
        if (typeof closable === 'object' && closable.closeIcon) {
          return closable.closeIcon
        }
        const closeIcon = getSlotPropFn(slots, props, 'closeIcon')
        if (closeIcon) {
          return closeIcon
        }
        const contextClosable = configContext.value?.closable
        if (typeof contextClosable === 'object' && contextClosable.closeIcon) {
          return contextClosable.closeIcon
        }
        return configContext.value?.closeIcon
      }
      const mergedCloseIcon = mergedCloseIconFn()

      const mergedAriaPropsFn = () => {
        const merged = closable ?? configContext.value?.closable
        if (typeof merged === 'object') {
          const { closeIcon: _, ...ariaProps } = merged
          return ariaProps
        }
        return {}
      }
      const mergedAriaProps = mergedAriaPropsFn()
      return wrapCSSVar(
        <Transition
          name={`${prefixCls.value}-motion`}
          appear={false}
          leaveFromClass="ant-alert-motion-leave"
          leaveActiveClass="ant-alert-motion-leave ant-alert-motion-leave-active"
          leaveToClass="ant-alert-motion-leave ant-alert-motion-leave-active"
          onBeforeLeave={handleBeforeLeave}
          onAfterLeave={() => props?.afterClose?.()}
        >
          {!closed.value
            ? (
                <div
                  id={props.id}
                  ref={internalRef}
                  data-show={!closed.value}
                  role="alert"
                  class={[alertCls, attrs.class]}
                  style={[configContext.value?.style, (attrs as any).style]}
                  {...attrs}
                >
                  {isShowIcon
                    ? (
                        <IconNode
                          description={description}
                          icon={props.icon}
                          prefixCls={prefixCls.value}
                          type={type.value}
                        />
                      )
                    : null}
                  <div class={`${prefixCls.value}-content`}>
                    {message ? <div class={`${prefixCls.value}-message`}>{message}</div> : null}
                    {description ? <div class={`${prefixCls.value}-description`}>{description}</div> : null}
                  </div>
                  {action ? <div class={`${prefixCls.value}-action`}>{action}</div> : null}
                  <CloseIconNode
                    isClosable={isClosable}
                    prefixCls={prefixCls.value}
                    ariaProps={mergedAriaProps}
                    handleClose={handleClose}
                    closeIcon={mergedCloseIcon}
                  />
                </div>
              )
            : null }
        </Transition>,

      )
    }
  },
  {
    name: 'AAlert',
    inheritAttrs: false,
  },
)
;(Alert as any).install = (app: any) => {
  app.component(Alert.name, Alert)
}
export default Alert
