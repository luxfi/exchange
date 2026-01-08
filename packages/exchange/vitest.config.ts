import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    __DEV__: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 15000,
    reporters: ['verbose'],
    coverage: {
      include: ['src/**/*.ts*'],
      exclude: ['src/**/*.d.ts'],
    },
  },
  resolve: {
    extensions: ['.web.ts', '.web.tsx', '.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      'exchange/src': path.resolve(__dirname, './src'),
    },
  },
})
