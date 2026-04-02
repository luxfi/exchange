import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    __DEV__: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
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
      'config/src': path.resolve(__dirname, './src'),
    },
  },
})
