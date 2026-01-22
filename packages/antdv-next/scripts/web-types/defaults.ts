import type { DefaultComponentDefinition } from './types'

export const defaultComponents: DefaultComponentDefinition[] = [
  // Example:
  // {
  //   componentName: 'Portal',
  //   tagName: 'a-portal',
  //   description: 'Render children into a DOM node.',
  //   lang: 'en',
  //   attributes: [
  //     { name: 'getContainer', description: 'Custom container', type: '() => HTMLElement' },
  //   ],
  // },
  {
    componentName: 'StyleProvider',
    tagName: 'a-style-provider',
    description: 'Provide CSS-in-JS context for styling configuration.',
    lang: 'both',
    attributes: [
      { name: 'autoClear', description: 'Clear style cache on unmount.', type: 'boolean' },
      {
        name: 'cache',
        description: 'Set when you need SSR to extract style on your own. If not provided, it auto creates <style /> on server side.',
        type: 'CacheEntity',
      },
      { name: 'defaultCache', description: 'Tell children this context is default generated context.', type: 'boolean' },
      { name: 'hashPriority', description: 'Use :where selector to reduce hashId selector priority.', type: 'HashPriority' },
      { name: 'container', description: 'Tell cssinjs where to inject style in.', type: 'Element | ShadowRoot' },
      { name: 'ssrInline', description: 'Render inline <style /> for SSR fallback. Not recommended.', type: 'boolean' },
      {
        name: 'transformers',
        description: 'Transform css before inject in document. Transformers do not support dynamic update.',
        type: 'Transformer[]',
      },
      {
        name: 'linters',
        description:
          'Linters to lint css before inject in document. Styles linted after transforming. Linters do not support dynamic update.',
        type: 'Linter[]',
      },
      { name: 'layer', description: 'Wrap css in a layer to avoid global style conflict.', type: 'boolean' },
      { name: 'autoPrefix', description: 'Hardcode here since transformer not support serialize effect.', type: 'boolean' },
    ],
  },
]
