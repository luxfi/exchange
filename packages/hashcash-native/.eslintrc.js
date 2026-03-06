const biomeSupportedRules = require('@lux/eslint-config/biome-supported')

module.exports = {
  root: true,
  extends: ['@lux/eslint-config/native'],
  ignorePatterns: ['node_modules', 'lib', '.eslintrc.js'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**'],
      rules: {
        ...biomeSupportedRules,
      },
    },
    {
      files: ['src/index.ts'],
      rules: {
        'check-file/no-index': 'off',
      },
    },
  ],
  rules: {},
}
