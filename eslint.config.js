import defineEslintConfig from '@kriszu/eslint-config'

export default defineEslintConfig({
  rules: {
    'ts/prefer-for-of': 'off',
    'no-restricted-globals': 'off',
    'ts/consistent-type-assertions': 'off',
    'jsdoc/no-multi-asterisks': 'off',
    'vue/attributes-order': 'off',
    'new-cap': 'off',
    'no-alert': 'off',
    'vue/custom-event-name-casing': 'off',
    'vue/no-ref-object-reactivity-loss': 'off',
    'vue/no-static-inline-styles': 'off',
    'style/no-tabs': 'off',
  },
})
