/**
 * Unified chart theme tokens
 * Colors aligned with Tamagui sporeDark theme tokens:
 *   statusSuccess = '#21C95E', statusCritical = '#FF593C'
 *
 * Use getChartOptions() / getCandlestickOptions() / getVolumeOptions() to
 * configure standalone lightweight-charts instances (e.g., Trade page).
 * For the standard ChartModel class, colors come from useSporeColors() directly.
 */

export const chartColors = {
  up: '#21C95E',
  upMuted: 'rgba(33, 201, 94, 0.12)',
  down: '#FF593C',
  downMuted: 'rgba(255, 89, 60, 0.12)',
  line: '#fff',
  grid: 'rgba(255, 255, 255, 0.03)',
  crosshair: 'rgba(255, 255, 255, 0.1)',
  volume: 'rgba(255, 255, 255, 0.06)',
  text: 'rgba(255, 255, 255, 0.3)',
  border: 'rgba(255, 255, 255, 0.06)',
  bg: 'transparent',
} as const

/**
 * Returns lightweight-charts compatible options using our unified theme.
 * Use this wherever you call `createChart()` to get consistent styling.
 */
export function getChartOptions(overrides?: Partial<typeof chartColors>) {
  const c = { ...chartColors, ...overrides }
  return {
    layout: {
      background: { type: 'solid' as const, color: c.bg },
      textColor: c.text,
      fontFamily: "'Inter', -apple-system, sans-serif",
      fontSize: 11,
    },
    grid: {
      vertLines: { color: c.grid },
      horzLines: { color: c.grid },
    },
    timeScale: {
      borderColor: c.border,
      timeVisible: false,
    },
    rightPriceScale: {
      borderColor: c.border,
    },
    crosshair: {
      vertLine: { color: c.crosshair, width: 1 as const, style: 2 as const },
      horzLine: { color: c.crosshair, width: 1 as const, style: 2 as const },
    },
  }
}

/**
 * Returns candlestick series options using our unified theme.
 */
export function getCandlestickOptions(overrides?: Partial<typeof chartColors>) {
  const c = { ...chartColors, ...overrides }
  return {
    upColor: c.up,
    downColor: c.down,
    borderDownColor: c.down,
    borderUpColor: c.up,
    wickDownColor: `${c.down}66`,
    wickUpColor: `${c.up}66`,
  }
}

/**
 * Returns volume histogram options using our unified theme.
 */
export function getVolumeOptions(overrides?: Partial<typeof chartColors>) {
  const c = { ...chartColors, ...overrides }
  return {
    color: c.volume,
    priceFormat: { type: 'volume' as const },
    priceScaleId: 'vol',
  }
}
