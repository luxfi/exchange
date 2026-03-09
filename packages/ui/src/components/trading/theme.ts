/**
 * Trading UI theme tokens
 * Colors aligned with Tamagui sporeDark theme tokens:
 *   statusSuccess = '#21C95E', statusCritical = '#FF593C'
 *
 * Override these via Tamagui theme to white-label.
 */

export const tradingColors = {
  buy: '#21C95E',
  buyMuted: 'rgba(33, 201, 94, 0.12)',
  sell: '#FF593C',
  sellMuted: 'rgba(255, 89, 60, 0.12)',
  textPrimary: '#fff',
  textSecondary: 'rgba(255, 255, 255, 0.5)',
  textTertiary: 'rgba(255, 255, 255, 0.25)',
  textMuted: 'rgba(255, 255, 255, 0.08)',
  bgPrimary: '#000',
  bgSecondary: 'rgba(255, 255, 255, 0.03)',
  bgHover: 'rgba(255, 255, 255, 0.04)',
  border: 'rgba(255, 255, 255, 0.06)',
  borderFocus: 'rgba(255, 255, 255, 0.12)',
} as const

export type TradingSide = 'buy' | 'sell'
