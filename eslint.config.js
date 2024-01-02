import kriszu from '@kriszu/eslint-config'

export default kriszu({
  rules: {
    'ts/prefer-for-of': 'off',
    'no-restricted-globals': 'off',
    'ts/consistent-type-assertions': 'off',
    'jsdoc/no-multi-asterisks': 'off',
    'new-cap': 'off',
  },
})
