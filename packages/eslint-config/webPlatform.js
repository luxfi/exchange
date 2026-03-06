const { webPlatform: restrictedImports } = require('@lux/eslint-config/restrictedImports')

module.exports = {
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      excludedFiles: ['*.native.*', '*.ios.*', '*.android.*'],
      rules: {
        '@typescript-eslint/no-restricted-imports': ['error', restrictedImports],
      },
    },
  ],
}
