---
category: Components
group: 通用
title: FloatButton
subtitle: 悬浮按钮
description: 悬浮于页面上方的按钮。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*tXAoQqyr-ioAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*hSAwR7cnabwAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

<DocHeading></DocHeading>

## 何时使用 {#when-to-use}

- 用于网站上的全局功能；
- 无论浏览到何处都可以看见的按钮。


## 示例 {#examples}

<demo-group>
  <demo src="./demo/basic.vue" iframe="360">基本</demo>
  <demo src="./demo/shape.vue" iframe="360">形状</demo>
  <demo src="./demo/group-menu.vue" iframe="360">菜单模式</demo>
  <demo src="./demo/back-top.vue" iframe="360">回到顶部</demo>
  <demo src="./demo/badge.vue" iframe="360">徽标数</demo>
</demo-group>

## API

### 属性 {#property}

通用属性参考：[通用属性](/docs/vue/common-props)

#### FloatButtonGroup

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | FloatButtonGroupClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | FloatButtonGroupStylesType | - | - |
| trigger | - | FloatButtonGroupTrigger | - | - |
| open | - | boolean | - | - |
| defaultOpen | - | boolean | - | - |
| closeIcon | - | VueNode | - | - |
| placement | - | 'top' \| 'left' \| 'right' \| 'bottom' | - | - |
| style | - | CSSProperties | - | - |

#### FloatButton

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| icon | 自定义图标 | VueNode | - | - |
| description | 请使用 `content` 代替 | VueNode | - | - |
| content | 文字及其它内容 | VueNode | - | - |
| type | 设置按钮类型 | FloatButtonType | `default` | - |
| shape | 设置按钮形状 | FloatButtonShape | `circle` | - |
| tooltip | 气泡卡片的内容 | VueNode \| TooltipProps | - | TooltipProps: 5.25.0 |
| href | 点击跳转的地址，指定此属性 button 的行为和 a 链接一致 | string | - | - |
| target | 相当于 a 标签的 target 属性，href 存在时生效 | '_self' \| '_blank' \| '_parent' \| '_top' \| string | - | - |
| badge | 带徽标数字的悬浮按钮（不支持 `status` 以及相关属性） | FloatButtonBadgeProps & \{ class?: string \} | - | 5.4.0 |
| htmlType | 设置 `button` 原生的 `type` 值，可选值请参考 [HTML 标准](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/button#type) | ButtonHTMLType | `button` | 5.21.0 |
| ariaLabel | - | string | - | - |
| style | - | CSSProperties | - | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | FloatButtonClassNamesType | - | - |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | FloatButtonStylesType | - | - |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| click | 点击按钮时的回调 | (e: MouseEvent) =&gt; void | - |
| mouseenter | - | (e: MouseEvent) =&gt; void | - |
| mouseleave | - | (e: MouseEvent) =&gt; void | - |
| focus | - | (e: FocusEvent) =&gt; void | - |
| blur | - | (e: FocusEvent) =&gt; void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| icon | 自定义图标 | () =&gt; any | - |
| tooltip | 气泡卡片的内容 | () =&gt; any | TooltipProps: 5.25.0 |

### 方法 {#methods}

| 方法 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| nativeElement | - | FloatButtonElement \| null | - |
