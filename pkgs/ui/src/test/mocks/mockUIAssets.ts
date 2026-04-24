import { vi } from 'vitest'

export function mockUIAssets(): void {
  vi.mock('@l.x/ui/src/assets', () => {
    const assets: Record<string, unknown> = {
      ...vi.importActual('@l.x/ui/src/assets'),
    }

    Object.keys(assets).map((key) => {
      assets[key] = `mock-asset-${key}.png`
    })

    return assets
  })
}
