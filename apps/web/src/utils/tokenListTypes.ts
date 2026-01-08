/**
 * Token list types
 * Replaces @uniswap/token-lists types
 */

export interface Version {
  major: number
  minor: number
  patch: number
}

export interface Tags {
  [tagId: string]: {
    name: string
    description: string
  }
}

export interface TokenInfo {
  readonly chainId: number
  readonly address: string
  readonly name: string
  readonly decimals: number
  readonly symbol: string
  readonly logoURI?: string
  readonly tags?: string[]
  readonly extensions?: {
    readonly [key: string]: string | number | boolean | null | undefined
  }
}

export interface TokenList {
  readonly name: string
  readonly timestamp: string
  readonly version: Version
  readonly tokens: TokenInfo[]
  readonly tokenMap?: {
    readonly [key: string]: TokenInfo
  }
  readonly keywords?: string[]
  readonly tags?: Tags
  readonly logoURI?: string
}

export enum VersionUpgrade {
  NONE = 'NONE',
  PATCH = 'PATCH',
  MINOR = 'MINOR',
  MAJOR = 'MAJOR',
}

/**
 * Compares two token list versions and returns the type of upgrade
 */
export function getVersionUpgrade(base: Version, update: Version): VersionUpgrade {
  if (update.major > base.major) {
    return VersionUpgrade.MAJOR
  }
  if (update.major < base.major) {
    return VersionUpgrade.NONE
  }
  if (update.minor > base.minor) {
    return VersionUpgrade.MINOR
  }
  if (update.minor < base.minor) {
    return VersionUpgrade.NONE
  }
  if (update.patch > base.patch) {
    return VersionUpgrade.PATCH
  }
  return VersionUpgrade.NONE
}
