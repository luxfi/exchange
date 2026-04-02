/**
 * Chart theme tokens for the web app.
 * Canonical source: pkgs/ui/src/components/charts/theme.ts
 * Colors aligned with Gui sporeDark: statusSuccess=#21C95E, statusCritical=#FF593C
 */
export { chartColors } from '@l.x/ui/src/components/charts/theme'
export type { ChartTheme } from '@l.x/ui/src/components/charts/theme'

// Stub functions for compatibility — the canonical chart options are inline in the chart components
export function getChartOptions() { return {} }
export function getCandlestickOptions() { return {} }
export function getVolumeOptions() { return {} }
