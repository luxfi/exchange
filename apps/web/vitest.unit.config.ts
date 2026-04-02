/**
 * Lightweight vitest config for pure unit tests (no React, no DOM, no setup).
 * Tests under lib/__tests__/ are self-contained and don't need the full SPA setup.
 */
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    include: ['lib/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.next'],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@luxexchange/exchange': path.resolve(__dirname, '../../pkgs/exchange/src'),
      '@luxexchange/config': path.resolve(__dirname, '../../pkgs/config/src'),
      '@luxexchange/config/src': path.resolve(__dirname, '../../pkgs/config/src'),
      'utilities/src': path.resolve(__dirname, '../../pkgs/utilities/src'),
    },
  },
})
