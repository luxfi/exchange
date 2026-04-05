import minimal from '@uniswap/eslint-config/minimal'

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      '.turbo',
      'build',
      'jest.config.js',
      'webpack.config.js',
      'webpack.dev.config.js',
      'webpack-plugins/**',
      'manifest.json',
      '.nx',
      '.output/**',
      '.wxt/**',
      'wxt.config.ts',
      'jest-setup.js',
    ],
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
