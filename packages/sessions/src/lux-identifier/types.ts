/**
 * Lux Identifier provider interface
 * Platform-specific implementations handle lux identifier persistence
 */
interface LuxIdentifierService {
  getLuxIdentifier(): Promise<string | null>
  setLuxIdentifier(identifier: string): Promise<void>
  removeLuxIdentifier(): Promise<void>
}

export type { LuxIdentifierService }
