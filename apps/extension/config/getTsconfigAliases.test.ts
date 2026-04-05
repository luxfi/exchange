<<<<<<< HEAD
/* eslint-disable no-relative-import-paths/no-relative-import-paths */
=======
/* oxlint-disable universe-custom/no-relative-import-paths */
>>>>>>> upstream/main
import path from 'path'
import { getTsconfigAliases } from './getTsconfigAliases'

describe('getTsconfigAliases', () => {
  it('should throw error when tsconfig file does not exist', () => {
    const nonExistentPath = '/path/that/does/not/exist/tsconfig.json'

    expect(() => getTsconfigAliases(nonExistentPath)).toThrow(`tsconfig file not found at: ${nonExistentPath}`)
  })

  it('should successfully parse the real tsconfig.base.json', () => {
    const result = getTsconfigAliases()

    // Verify we got aliases for some known packages
<<<<<<< HEAD
    expect(result).toHaveProperty('lux')
    expect(result).toHaveProperty('@l.x/api')

    // Verify paths are absolute and point to the packages directory
    expect(result['lx']).toContain('pkgs/lx')
    expect(result['@l.x/api']).toContain('pkgs/api')
    expect(path.isAbsolute(result['lx']!)).toBe(true)
    expect(path.isAbsolute(result['@l.x/api']!)).toBe(true)
=======
    expect(result).toHaveProperty('uniswap')
    expect(result).toHaveProperty('@universe/api')

    // Verify paths are absolute and point to the packages directory
    expect(result['uniswap']).toContain('packages/uniswap')
    expect(result['@universe/api']).toContain('packages/api')
    expect(path.isAbsolute(result['uniswap']!)).toBe(true)
    expect(path.isAbsolute(result['@universe/api']!)).toBe(true)
>>>>>>> upstream/main
  })
})
