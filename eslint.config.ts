import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'jsdoc/empty-tags': 0,
    'node/prefer-global/process': 0,
    'regexp/no-unused-capturing-group': 0,
  },
})
