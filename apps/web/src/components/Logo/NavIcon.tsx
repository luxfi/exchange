import { brand } from '@l.x/config'

// Brand-neutral nav icon. Renders whatever logo the active brand config
// declares (logoUrl) at runtime. No hardcoded Lux/Uniswap/Zoo SVG —
// downstream white-labels just supply their own logoUrl via brand.json
// or build-time COPY into /public/logo.svg.
export function NavIcon({ onClick }: { onClick?: () => void }) {
  const src = brand.logoUrl || '/logo.svg'
  const alt = brand.name || 'Logo'
  return (
    <img
      src={src}
      alt={alt}
      width={40}
      height={40}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined, display: 'block' }}
    />
  )
}
