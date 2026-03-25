import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'
import vitestPreset from 'vitest-presets/vitest/vitest-preset.js'

export default defineConfig({
  ...vitestPreset,
  plugins: [react()],
  test: {
    ...vitestPreset.test,
    pool: 'forks',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['node_modules', 'dist', 'src/**/*.stories.**'],
    testTimeout: 15000,
    server: {
      deps: {
        inline: [/ui\/src\/theme/],
        fallbackCJS: true,
      },
    },
    reporters: ['verbose'],
    coverage: {
      include: ['src/**/*.{js,ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/*.stories.**', '**/node_modules/**'],
    },
  },
  define: {
    __DEV__: true,
  },
  resolve: {
    ...vitestPreset.resolve,
    extensions: ['.web.ts', '.web.tsx', '.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      'ui/src': path.resolve(__dirname, './src'),
      'utilities/src': path.resolve(__dirname, '../utilities/src'),
      'lx/src': path.resolve(__dirname, '../lux/src'),

      // React Native aliases for testing
      'react-native': 'react-native-web',
      'react-native-gesture-handler': path.resolve(__dirname, '../../node_modules/react-native-gesture-handler'),
      '@hanzogui/core': path.resolve(__dirname, '../../node_modules/@hanzogui/core/dist/cjs/index.cjs'),
      '@hanzogui/web': path.resolve(__dirname, '../../node_modules/@hanzogui/web/dist/cjs/index.cjs'),
      '@hanzogui/use-direction': path.resolve(__dirname, '../../node_modules/@hanzogui/use-direction/dist/cjs/index.cjs'),
      '@hanzogui/use-callback-ref': path.resolve(
        __dirname,
        '../../node_modules/@hanzogui/use-callback-ref/dist/cjs/index.cjs'
      ),
      gui: path.resolve(__dirname, '../../node_modules/gui/dist/cjs/index.cjs'),
    },
  },
  optimizeDeps: {
    ...vitestPreset.optimizeDeps,
    include: ['react-native-web', '@testing-library/react-native'],
  },
})
