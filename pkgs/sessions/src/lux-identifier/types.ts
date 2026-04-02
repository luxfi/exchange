/**
 * Lx Identifier provider interface
 * Platform-specific implementations handle lx identifier persistence
 */
interface LXIdentifierService {
  getLXIdentifier(): Promise<string | null>
  setLXIdentifier(identifier: string): Promise<void>
  removeLXIdentifier(): Promise<void>
}

export type { LXIdentifierService }
