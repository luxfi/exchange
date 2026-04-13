const globals = require('./globals')
const path = require('path')

/** @type import('vitest/config').UserConfig */
module.exports = {
  test: {
    globals: true, // Enable Jest-like global APIs (describe, it, expect, etc.)
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        customExportConditions: ['react-native'],
      },
    },
    moduleNameMapper: {
      '\\.(css|less|sass|scss|png|jpg|jpeg|gif|ttf|woff|woff2|mp4)$': 'identity-obj-proxy',
      '^src/(.*)$': path.resolve(__dirname, './src/$1'),
    },
    moduleDirectories: ['node_modules', 'src'],
    include: ['**/*.(spec|test).[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    setupFiles: [path.resolve(__dirname, './setup.js')],
    coverage: {
      enabled: false, // only collect in CI
      reporter: ['json', 'lcov', 'html'],
      include: ['pkgs/**/src/**/*.ts'],
