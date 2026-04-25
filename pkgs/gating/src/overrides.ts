/**
 * Local feature-flag/experiment/config overrides — dev tool.
 * Persisted in localStorage; takes precedence over remote insights values.
 */

const OVERRIDES_KEY = 'l.x:gating:overrides'

type GateMap = Record<string, boolean>
type ConfigMap = Record<string, Record<string, unknown>>

export interface Overrides {
  gates: GateMap
  configs: ConfigMap
  experiments: ConfigMap
  layers: ConfigMap
}

function emptyOverrides(): Overrides {
  return { gates: {}, configs: {}, experiments: {}, layers: {} }
}

function read(): Overrides {
  if (typeof localStorage === 'undefined') return emptyOverrides()
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    if (!raw) return emptyOverrides()
    return { ...emptyOverrides(), ...JSON.parse(raw) }
  } catch {
    return emptyOverrides()
  }
}

function write(o: Overrides): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(o))
    window.dispatchEvent(new CustomEvent('l.x:gating:overrides:changed'))
  } catch {
    /* storage full or unavailable */
  }
}

export function getOverrides(): Overrides {
  return read()
}

export function getGateOverride(name: string): boolean | undefined {
  return read().gates[name]
}

export function getConfigOverride(name: string): Record<string, unknown> | undefined {
  return read().configs[name]
}

export function getExperimentOverride(name: string): Record<string, unknown> | undefined {
  return read().experiments[name]
}

export function setGateOverride(name: string, value: boolean): void {
  const o = read()
  o.gates[name] = value
  write(o)
}

export function removeGateOverride(name: string): void {
  const o = read()
  delete o.gates[name]
  write(o)
}

export function setConfigOverride(name: string, value: Record<string, unknown>): void {
  const o = read()
  o.configs[name] = value
  write(o)
}

export function removeConfigOverride(name: string): void {
  const o = read()
  delete o.configs[name]
  write(o)
}

export function setExperimentOverride(name: string, value: Record<string, unknown>): void {
  const o = read()
  o.experiments[name] = value
  write(o)
}

export function removeExperimentOverride(name: string): void {
  const o = read()
  delete o.experiments[name]
  write(o)
}

export function clearAllOverrides(): void {
  write(emptyOverrides())
}
