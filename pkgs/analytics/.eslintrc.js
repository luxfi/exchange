module.exports = {
  extends: ['@luxfi/eslint-config/lib'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-relative-import-paths/no-relative-import-paths': 'off',
        // track(event, properties, serverContext) is a natural 3-param signature for analytics.
        'max-params': ['error', { max: 3 }],
      },
    },
  ],
}
