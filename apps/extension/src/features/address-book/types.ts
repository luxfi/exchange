/**
 * Address Book Types
 * Ported from xwallet/Rabby contactBook service
 */

export interface Contact {
  address: string
  name: string
  note?: string
  createdAt: number
  updatedAt: number
  isAlias?: boolean // True if this is an account alias vs external contact
}

export interface AddressBookState {
  contacts: Record<string, Contact> // Keyed by lowercase address
  recentAddresses: string[] // Recently used addresses for quick access
  isLoading: boolean
  error: string | null
}

// Max recent addresses to track
export const MAX_RECENT_ADDRESSES = 10

// Validation
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function normalizeAddress(address: string): string {
  return address.toLowerCase()
}
