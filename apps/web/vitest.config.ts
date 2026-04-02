import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    pool: 'threads',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts', './vite/mockAssets.tsx'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'lib/**/*.test.ts'],
    exclude: [
      'e2e',
      '**/*.e2e.test.ts',
      '**/*.e2e.test.tsx',
      '**/e2e/**',
      'node_modules',
      'dist',
      '.next',
      '.turbo',
      '.nx',
    ],
    testTimeout: 15000,
    deps: {
      inline: [/pkgs\/ui/, /pkgs\/utilities/, /pkgs\/lux/],
    },
    reporters: ['verbose'],
    coverage: {
      include: ['src/**/*.ts*'],
      exclude: [
        'src/**/*.d.ts',
        'src/abis/types/**',
        'src/constants/**/*.ts',
        'src/graphql/**/__generated__/**',
        'src/locales/**',
        'src/test-utils/**',
        'src/types/v3/**',
        'src/playwright/**',
        '**/*.snap',
      ],
    },
  },
  define: {
    __DEV__: true,
  },
  build: {
    sourcemap: false,
  },
  esbuild: {
    sourcemap: false,
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['ui/src', 'utilities/src', 'lux/src'],
    exclude: ['d3-array'],
  },
  resolve: {
    extensions: ['.web.ts', '.web.tsx', '.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: [
      // Tilde prefix for src directory
      { find: /^~\/(.*)$/, replacement: path.resolve(__dirname, 'src/$1') },
      // Use web app-specific i18n entry that doesn't import wallet's i18n-setup (must be before general lux/src alias)
      {
        find: /^lux\/src\/i18n$/,
        replacement: path.resolve(__dirname, '../../pkgs/lx/src/i18n/index.web-app.ts'),
      },
      { find: 'ui/src', replacement: path.resolve(__dirname, '../../pkgs/ui/src') },
      { find: 'utilities/src', replacement: path.resolve(__dirname, '../../pkgs/utilities/src') },
      { find: 'lux/src', replacement: path.resolve(__dirname, '../../pkgs/lx/src') },
      { find: 'd3-array', replacement: path.resolve(__dirname, '../../node_modules/d3-array/dist/d3-array.min.js') },
      { find: 'react-native', replacement: 'react-native-web' },
      { find: 'react-native-gesture-handler', replacement: require.resolve('react-native-gesture-handler') },
    ],
  },
})
