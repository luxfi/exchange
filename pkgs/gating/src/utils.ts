import { getOverrides as getRaw } from '@l.x/gating/src/overrides'

type GateOverride = [string, boolean]
type ConfigOverride = [string, Record<string, unknown>]

export function getOverrides(): {
  configOverrides: ConfigOverride[]
  gateOverrides: GateOverride[]
} {
  const o = getRaw()
  const filterNumbers = (value: [string, unknown]): boolean => isNaN(parseInt(value[0], 10))
  const gateOverrides = Object.entries(o.gates).filter(filterNumbers)
  const configOverrides = Object.entries(o.configs).filter(filterNumbers)
  return { configOverrides, gateOverrides }
}
