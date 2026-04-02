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
        // Logger interface defines error(msg, error?, context?) — 3 params is inherent to the contract.
        // Factory functions take (transport, service, parentContext, minLevel) to match the child() pattern.
        // Restructuring these into options objects would make the API awkward for a logging library.
        'max-params': ['error', { max: 6 }],
      },
    },
  ],
}
