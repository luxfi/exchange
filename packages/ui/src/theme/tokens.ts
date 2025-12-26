import { createTokens } from '@tamagui/core'

/**
 * Design tokens for Lux Exchange
 * Based on Tailwind/shadcn design system
 */
export const tokens = createTokens({
  color: {
    // Brand colors
    luxPrimary: '#FF6B00',
    luxSecondary: '#FF8C00',

    // Base colors
    white: '#FFFFFF',
    black: '#000000',

    // Gray scale
    gray50: '#FAFAFA',
    gray100: '#F4F4F5',
    gray200: '#E4E4E7',
    gray300: '#D4D4D8',
    gray400: '#A1A1AA',
    gray500: '#71717A',
    gray600: '#52525B',
    gray700: '#3F3F46',
    gray800: '#27272A',
    gray900: '#18181B',
    gray950: '#09090B',

    // Semantic colors
    success: '#22C55E',
    successDark: '#16A34A',
    warning: '#F59E0B',
    warningDark: '#D97706',
    error: '#EF4444',
    errorDark: '#DC2626',
    info: '#3B82F6',
    infoDark: '#2563EB',

    // Transparent
    transparent: 'transparent',
  },

  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
    true: 16,
  },

  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    true: 16,
  },

  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    round: 9999,
    true: 8,
  },

  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    modal: 1000,
    popover: 1100,
    tooltip: 1200,
  },
})

export type AppTokens = typeof tokens
