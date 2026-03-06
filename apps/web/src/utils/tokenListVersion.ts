/**
 * Token list version utilities
 * Replaces @uniswap/token-lists functions
 */

export interface Version {
  major: number
  minor: number
  patch: number
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
