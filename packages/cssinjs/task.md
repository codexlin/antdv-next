# 我期望实现的cssinjs的功能

1. 要兼容现有的ant-design的cssinjs功能;
2. 支持动态生成样式，但是我不需要保留传统的生成带有hash的方式，而是希望生成全局的可被复用的样式;
3. 支持vue中的响应式配置，比如当我改变某个token的值时，相关的样式会自动更新;
4. 对于自动更新，我只需要更新样式，而不需要重新渲染组件;
5. 我只需要实现cssvar的模式，其他的模式我不需要实现;

## 配合 https://github.com/ant-design/cssinjs-utils 这个库

我最终想实现的是通过`genStyleUtils`这个方法生成的`genStyleHooks, genComponentStyleHook, genSubStyleComponent ` 这三个方法来生成样式;

### genStyleHooks

实现应该都在 cssinjs/src/utils中实现

这里我给出一个例子

```ts
// affix/style/index.ts
import type { CSSObject } from '@ant-design/cssinjs'

import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/internal'
import { genStyleHooks } from '../../theme/internal'

export interface ComponentToken {
  /**
   * @desc 弹出层的 z-index
   * @descEN z-index of popup
   */
  zIndexPopup: number
}

interface AffixToken extends FullToken<'Affix'> {
  //
}

// ============================== Shared ==============================
const genSharedAffixStyle: GenerateStyle<AffixToken> = (token): CSSObject => {
  const { componentCls } = token
  return {
    [componentCls]: {
      position: 'fixed',
      zIndex: token.zIndexPopup,
    },
  }
}

export const prepareComponentToken: GetDefaultToken<'Affix'> = token => ({
  zIndexPopup: token.zIndexBase + 10,
})

// ============================== Export ==============================
export default genStyleHooks('Affix', genSharedAffixStyle, prepareComponentToken)
```

```vue
<script lang="ts" setup>
import useStyle from './style'

const { cssVarCls } = useStyle()
// 这里的cssVarCls生成的就是几个计算属性的类名 其中包含 ant-affix-css-var 和一个专属于当前组件的类名 ant-affix-css-var-hash
// 这么做的目的，当一个组件被多次使用的时候，但是其中一个出现了变体，但是其他的没有变体，那么就可以借用hash的类名只覆盖当前这个组件的样式，而不会影响其他组件
// 或者我们还有更好的方案，就是添加一个cssVarStyle属性（计算属性，保证响应式），直接把样式的cssvar变量放到style标签中，你记住这里面只有cssvar变量，不会存在任何其他的样式信息
</script>

<template>
  <div :class="cssVarCls" />
</template>
```
