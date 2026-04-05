import minimal from '@uniswap/eslint-config/minimal'

export default [
  {
    ignores: ['node_modules', 'lib', 'react-native.config.js'],
  },
  ...minimal,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]
