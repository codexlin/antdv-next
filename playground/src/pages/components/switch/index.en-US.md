---
category: Components
group: Data Entry
title: Switch
description: Used to toggle between two states.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*rtArRpBNDZcAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*al07RK8SGf4AAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

<DocHeading></DocHeading>

## When To Use {#when-to-use}

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/disabled.vue">Disabled</demo>
  <demo src="./demo/text.vue">Text & icon</demo>
  <demo src="./demo/size.vue">Two sizes</demo>
  <demo src="./demo/loading.vue">Loading</demo>
  <demo src="./demo/component-token.vue" debug>Custom component token</demo>
  <demo src="./demo/style-class.vue" version="6.0.0">Custom semantic dom styling</demo>
</demo-group>

## API

### Property {#property}

Common props ref：[Common props](/docs/vue/common-props)

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| size | The size of the Switch, options: `default` `small` | SwitchSize | `default` | - |
| checked | Determine whether the Switch is checked | boolean | false | - |
| defaultChecked | Whether to set the initial state | boolean | false | - |
| value | Alias for `checked` | boolean | - | 5.12.0 |
| defaultValue | Alias for `defaultChecked` | boolean | - | 5.12.0 |
| checkedChildren | The content to be shown when the state is checked | VueNode | - | - |
| unCheckedChildren | The content to be shown when the state is unchecked | VueNode | - | - |
| disabled | Disable switch | boolean | false | - |
| loading | Loading state of switch | boolean | false | - |
| autoFocus | - | boolean | - | - |
| title | - | string | - | - |
| tabIndex | - | number | - | - |
| id | - | string | - | - |
| classes | Customize class for each semantic structure inside the component. Supports object or function. | SwitchClassNamesType | - | - |
| styles | Customize inline style for each semantic structure inside the component. Supports object or function. | SwitchStylesType | - | - |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Trigger when the checked state is changing | SwitchChangeEventHandler | - |
| click | Trigger when clicked | SwitchClickEventHandler | - |
| update:checked | - | (checked: boolean) =&gt; void | - |
| update:value | - | (checked: boolean) =&gt; void | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| checkedChildren | The content to be shown when the state is checked | () =&gt; any | - |
| unCheckedChildren | The content to be shown when the state is unchecked | () =&gt; any | - |
