module.exports = {
  extends: ['@luxfi/eslint-config/lib'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-relative-import-paths/no-relative-import-paths': [
          'error',
          {
            allowSameFolder: false,
            prefix: '@luxexchange/react-query',
          },
        ],
      },
    },
  ],
}
