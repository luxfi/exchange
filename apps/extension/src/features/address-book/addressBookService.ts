/**
 * Address Book Service
 * Manages contacts and address aliases
 * Ported from xwallet/Rabby contactBook service
 */

import {
  Contact,
  isValidAddress,
  MAX_RECENT_ADDRESSES,
  normalizeAddress,
} from './types'

const STORAGE_KEY = 'lux_address_book'
const RECENT_KEY = 'lux_recent_addresses'

class AddressBookService {
  private contacts: Map<string, Contact> = new Map()
  private recentAddresses: string[] = []
  private initialized = false

  async init(): Promise<void> {
    if (this.initialized) return

    try {
      const stored = await chrome.storage.local.get([STORAGE_KEY, RECENT_KEY])

      if (stored[STORAGE_KEY]) {
        const contacts = JSON.parse(stored[STORAGE_KEY]) as Record<string, Contact>
        Object.entries(contacts).forEach(([address, contact]) => {
          this.contacts.set(address, contact)
        })
      }

      if (stored[RECENT_KEY]) {
        this.recentAddresses = JSON.parse(stored[RECENT_KEY])
      }

      this.initialized = true
    } catch (error) {
      console.error('Failed to load address book:', error)
      this.initialized = true
    }
  }

  private async persist(): Promise<void> {
    const contactsObj: Record<string, Contact> = {}
    this.contacts.forEach((contact, address) => {
      contactsObj[address] = contact
    })

    await chrome.storage.local.set({
      [STORAGE_KEY]: JSON.stringify(contactsObj),
      [RECENT_KEY]: JSON.stringify(this.recentAddresses),
    })
  }

  async addContact(
    address: string,
    name: string,
    options?: { note?: string; isAlias?: boolean }
  ): Promise<Contact> {
    await this.init()

    if (!isValidAddress(address)) {
      throw new Error(`Invalid address: ${address}`)
    }

    if (!name || name.trim().length === 0) {
      throw new Error('Name is required')
    }

    const normalizedAddress = normalizeAddress(address)
    const now = Date.now()

    const contact: Contact = {
      address: normalizedAddress,
      name: name.trim(),
      note: options?.note?.trim(),
      isAlias: options?.isAlias ?? false,
      createdAt: now,
      updatedAt: now,
    }

    this.contacts.set(normalizedAddress, contact)
    await this.persist()

    return contact
  }

  async updateContact(
    address: string,
    updates: Partial<Omit<Contact, 'address' | 'createdAt'>>
  ): Promise<Contact | undefined> {
    await this.init()

    const normalizedAddress = normalizeAddress(address)
    const existing = this.contacts.get(normalizedAddress)

    if (!existing) {
      return undefined
    }

    const updated: Contact = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    }

    if (updates.name !== undefined) {
      updated.name = updates.name.trim()
    }
    if (updates.note !== undefined) {
      updated.note = updates.note.trim() || undefined
    }

    this.contacts.set(normalizedAddress, updated)
    await this.persist()

    return updated
  }

  async removeContact(address: string): Promise<boolean> {
    await this.init()

    const normalizedAddress = normalizeAddress(address)
    if (!this.contacts.has(normalizedAddress)) {
      return false
    }

    this.contacts.delete(normalizedAddress)
    await this.persist()
    return true
  }

  async getContact(address: string): Promise<Contact | undefined> {
    await this.init()
    return this.contacts.get(normalizeAddress(address))
  }

  async getContactName(address: string): Promise<string | undefined> {
    const contact = await this.getContact(address)
    return contact?.name
  }

  async getAllContacts(): Promise<Contact[]> {
    await this.init()
    return Array.from(this.contacts.values())
  }

  async getAliases(): Promise<Contact[]> {
    await this.init()
    return Array.from(this.contacts.values()).filter((c) => c.isAlias)
  }

  async getExternalContacts(): Promise<Contact[]> {
    await this.init()
    return Array.from(this.contacts.values()).filter((c) => !c.isAlias)
  }

  async searchContacts(query: string): Promise<Contact[]> {
    await this.init()

    const lowerQuery = query.toLowerCase()
    return Array.from(this.contacts.values()).filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.address.includes(lowerQuery) ||
        contact.note?.toLowerCase().includes(lowerQuery)
    )
  }

  async hasContact(address: string): Promise<boolean> {
    await this.init()
    return this.contacts.has(normalizeAddress(address))
  }

  // Recent addresses management
  async addRecentAddress(address: string): Promise<void> {
    await this.init()

    if (!isValidAddress(address)) return

    const normalizedAddress = normalizeAddress(address)

    // Remove if already exists
    const index = this.recentAddresses.indexOf(normalizedAddress)
    if (index > -1) {
      this.recentAddresses.splice(index, 1)
    }

    // Add to front
    this.recentAddresses.unshift(normalizedAddress)

    // Trim to max
    if (this.recentAddresses.length > MAX_RECENT_ADDRESSES) {
      this.recentAddresses = this.recentAddresses.slice(0, MAX_RECENT_ADDRESSES)
    }

    await this.persist()
  }

  async getRecentAddresses(): Promise<string[]> {
    await this.init()
    return [...this.recentAddresses]
  }

  async clearRecentAddresses(): Promise<void> {
    await this.init()
    this.recentAddresses = []
    await this.persist()
  }

  // Bulk operations for import/export
  async importContacts(contacts: Contact[]): Promise<number> {
    await this.init()

    let imported = 0
    for (const contact of contacts) {
      if (!isValidAddress(contact.address)) continue

      const normalizedAddress = normalizeAddress(contact.address)
      if (!this.contacts.has(normalizedAddress)) {
        this.contacts.set(normalizedAddress, {
          ...contact,
          address: normalizedAddress,
        })
        imported++
      }
    }

    if (imported > 0) {
      await this.persist()
    }

    return imported
  }

  async exportContacts(): Promise<Contact[]> {
    return this.getAllContacts()
  }
}

export const addressBookService = new AddressBookService()
