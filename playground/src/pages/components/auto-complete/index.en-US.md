---
category: Components
title: AutoComplete
description: Autocomplete function of input field.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*g8THS4NpV6sAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*WERTQ6qvgEYAAAAAAAAAAAAADrJ8AQ/original
group:
  title: Data Entry
  order: 4
demo:
  cols: 2
---

<DocHeading></DocHeading>

## When To Use {#when-to-use}

- When you need an input box instead of a selector.
- When you need input suggestions or helping text.

The differences with Select are:

- AutoComplete is an input box with text hints, and users can type freely. The keyword is aiding **input**.
- Select is selecting among given choices. The keyword is **select**.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic Usage</demo>
  <demo src="./demo/options.vue">Customized Options</demo>
  <demo src="./demo/custom.vue">Custom Input Component</demo>
  <demo src="./demo/non-case-sensitive.vue">Non-case-sensitive AutoComplete</demo>
  <demo src="./demo/certain-category.vue">Lookup-Patterns - Certain Category</demo>
  <demo src="./demo/uncertain-category.vue">Lookup-Patterns - Uncertain Category</demo>
  <demo src="./demo/status.vue">Status</demo>
  <demo src="./demo/variant.vue">Variants</demo>
  <demo src="./demo/allowClear.vue">Customize clear button</demo>
  <demo src="./demo/style-class.vue">Custom semantic dom styling</demo>
</demo-group>

## API

### Property {#property}

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Show clear button | boolean \| { clearIcon?: VueNode } | false | 5.8.0: Support object type |
| backfill | If backfill selected item the input when using keyboard | boolean | false | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | AutoCompleteClassNamesType | - | - |
| dataSource | Deprecated. Use `options` instead | DataSourceItemType[] | - | - |
| defaultActiveFirstOption | Whether active first option by default | boolean | true | - |
| defaultOpen | Initial open state of dropdown | boolean | - | - |
| defaultValue | Initial selected option | string | - | - |
| disabled | Whether disabled select | boolean | false | - |
| dropdownClassName | Deprecated. | string | - | - |
| dropdownMatchSelectWidth | Deprecated. | boolean \| number | - | - |
| dropdownRender | Customize dropdown content, use `popupRender` instead | (menu: VueNode) => any | - | - |
| dropdownStyle | The style of dropdown menu, use `styles.popup.root` instead | CSSProperties | - | - |
| getPopupContainer | Parent node of the dropdown. Default to body, if you encountered positioning problems during scroll, try changing to the scrollable area and position relative to it. | (triggerNode: HTMLElement) => HTMLElement | () => document.body | - |
| notFoundContent | Specify content to show when no result matches | VueNode | - | - |
| open | Controlled open state of dropdown | boolean | - | - |
| options | Select options. Will get better perf than jsx definition | SelectProps['options'] | - | - |
| placeholder | The placeholder of input | string | - | - |
| popupClassName | The className of dropdown menu, use `classes.popup.root` instead | string | - | 4.23.0 |
| popupMatchSelectWidth | Determine whether the dropdown menu and the select input are the same width. Default set `min-width` same as input. Will ignore when value less than select width. `false` will disable virtual scroll | boolean \| number | true | 5.5.0 |
| popupRender | Customize dropdown content | (menu: VueNode) => any | - | - |
| showSearch | Search configuration | boolean \| [SearchConfig](#showsearch) | true | - |
| size | The size of the input box | `large` \| `middle` \| `small` | - | - |
| status | Set validation status | InputStatus | - | 4.19.0 |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | AutoCompleteStylesType | - | - |
| value | Selected option | string | - | - |
| variant | Variants of input | `outlined` \| `borderless` \| `filled` \| `underlined` | `outlined` | 5.13.0 |
| virtual | Disable virtual scroll when set to false | boolean | true | 4.1.0 |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| openChange | Called when dropdown open | (open: boolean) => void | - |
| dropdownVisibleChange | Called when dropdown open, use `openChange` instead | (open: boolean) => void | - |
| select | Called when an option is selected, the params are option's value (or key) and option instance | NonNullable<VcSelectProps['onSelect']> | - |
| change | Called when selecting an option or changing input value | NonNullable<VcSelectProps['onChange']> | - |
| search | Called when searching items | NonNullable<VcSelectProps['onSearch']> | - |
| clear | Called when clear | NonNullable<VcSelectProps['onClear']> | 4.6.0 |
| inputKeydown | Called when key pressed | NonNullable<VcSelectProps['onInputKeyDown']> | - |
| popupScroll | Called when dropdown scrolls | NonNullable<VcSelectProps['onPopupScroll']> | - |
| focus | Called when focus | NonNullable<VcSelectProps['onFocus']> | - |
| blur | Called when blur | NonNullable<VcSelectProps['onBlur']> | - |
| update:value | - | (value: any) => void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| default | Customize input element | () => any | - |

### showSearch {#showsearch}

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| filterOption | If true, filter options by input, if function, filter options against it. The function will receive two arguments, `inputValue` and `option`, if the function returns true, the option will be included in the filtered set; Otherwise, it will be excluded | boolean \| (inputValue: string, option?: any) => boolean | true | - |
| onSearch | Called when searching items | (value: string) => void | - | - |

## Semantic DOM

## Design Token
