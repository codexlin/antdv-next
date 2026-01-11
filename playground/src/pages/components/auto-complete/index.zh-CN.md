---
category: Components
title: AutoComplete
subtitle: 自动完成
description: 输入框自动完成功能。
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*g8THS4NpV6sAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WERTQ6qvgEYAAAAAAAAAAAAADrJ8AQ/original
group:
  title: 数据录入
  order: 4
demo:
  cols: 2
---

<DocHeading></DocHeading>

## 何时使用 {#when-to-use}

- 需要一个输入框而不是选择器。
- 需要输入建议/辅助提示。

和 Select 的区别是：

- AutoComplete 是一个带提示的文本输入框，用户可以自由输入，关键词是辅助**输入**。
- Select 是在限定的可选项中进行选择，关键词是**选择**。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基本使用</demo>
  <demo src="./demo/options.vue">自定义选项</demo>
  <demo src="./demo/custom.vue">自定义输入组件</demo>
  <demo src="./demo/non-case-sensitive.vue">不区分大小写</demo>
  <demo src="./demo/certain-category.vue">查询模式 - 确定类目</demo>
  <demo src="./demo/uncertain-category.vue">查询模式 - 不确定类目</demo>
  <demo src="./demo/status.vue">自定义状态</demo>
  <demo src="./demo/variant.vue">多种形态</demo>
  <demo src="./demo/allowClear.vue">自定义清除按钮</demo>
  <demo src="./demo/style-class.vue">自定义语义结构的样式和类</demo>
</demo-group>

## API

### 属性 {#property}

通用属性参考：[通用属性](/docs/vue/common-props)

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 支持清除 | boolean \| { clearIcon?: VueNode } | false | 5.8.0: 支持对象形式 |
| backfill | 使用键盘选择选项的时候把选中项回填到输入框中 | boolean | false | - |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | AutoCompleteClassNamesType | - | - |
| dataSource | 已废弃。请使用 `options` | DataSourceItemType[] | - | - |
| defaultActiveFirstOption | 是否默认高亮第一个选项 | boolean | true | - |
| defaultOpen | 是否默认展开下拉菜单 | boolean | - | - |
| defaultValue | 指定默认选中的条目 | string | - | - |
| disabled | 是否禁用 | boolean | false | - |
| dropdownClassName | 已废弃 | string | - | - |
| dropdownMatchSelectWidth | 已废弃 | boolean \| number | - | - |
| dropdownRender | 自定义下拉框内容，使用 `popupRender` 替换 | (menu: VueNode) => any | - | - |
| dropdownStyle | 下拉菜单的 style 属性，使用 `styles.popup.root` 替换 | CSSProperties | - | - |
| getPopupContainer | 菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。 | (triggerNode: HTMLElement) => HTMLElement | () => document.body | - |
| notFoundContent | 当下拉列表为空时显示的内容 | VueNode | - | - |
| open | 是否展开下拉菜单 | boolean | - | - |
| options | 数据化配置选项内容，相比 jsx 定义会获得更好的渲染性能 | SelectProps['options'] | - | - |
| placeholder | 输入框提示 | string | - | - |
| popupClassName | 下拉菜单的 className 属性，使用 `classes.popup.root` 替换 | string | - | 4.23.0 |
| popupMatchSelectWidth | 下拉菜单和选择器同宽。默认将设置 `min-width`，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动 | boolean \| number | true | 5.5.0 |
| popupRender | 自定义下拉框内容 | (menu: VueNode) => any | - | - |
| showSearch | 搜索配置 | boolean \| [SearchConfig](#showsearch) | true | - |
| size | 控件大小 | `large` \| `middle` \| `small` | - | - |
| status | 设置校验状态 | InputStatus | - | 4.19.0 |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | AutoCompleteStylesType | - | - |
| value | 指定当前选中的条目 | string | - | - |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 5.13.0 |
| virtual | 设置 false 时关闭虚拟滚动 | boolean | true | 4.1.0 |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| openChange | 展开下拉菜单的回调 | (open: boolean) => void | - |
| dropdownVisibleChange | 展开下拉菜单的回调，使用 `openChange` 替换 | (open: boolean) => void | - |
| select | 被选中时调用，参数为选中项的 value 值 | NonNullable<VcSelectProps['onSelect']> | - |
| change | 选中 option，或 input 的 value 变化时，调用此函数 | NonNullable<VcSelectProps['onChange']> | - |
| search | 搜索补全项的时候调用 | NonNullable<VcSelectProps['onSearch']> | - |
| clear | 清除内容时的回调 | NonNullable<VcSelectProps['onClear']> | 4.6.0 |
| inputKeydown | 按键按下时回调 | NonNullable<VcSelectProps['onInputKeyDown']> | - |
| popupScroll | 下拉列表滚动时的回调 | NonNullable<VcSelectProps['onPopupScroll']> | - |
| focus | 获得焦点时的回调 | NonNullable<VcSelectProps['onFocus']> | - |
| blur | 失去焦点时的回调 | NonNullable<VcSelectProps['onBlur']> | - |
| update:value | - | (value: any) => void | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| default | 自定义输入框 | () => any | - |

### showSearch {#showsearch}

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| filterOption | 是否根据输入项进行筛选。当其为一个函数时，会接收 `inputValue` `option` 两个参数，当 `option` 符合筛选条件时，应返回 true，反之则返回 false | boolean \| (inputValue: string, option?: any) => boolean | true | - |
| onSearch | 搜索补全项的时候调用 | (value: string) => void | - | - |

## Semantic DOM

## 主题变量（Design Token）{#design-token}
