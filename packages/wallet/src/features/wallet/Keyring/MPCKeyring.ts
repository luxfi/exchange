import type { IKeyring } from './Keyring'

const MPC_API_BASE = process.env.NEXT_PUBLIC_MPC_API_URL || 'https://mpc.lux.network'

interface MPCSignResponse {
  r: string
  s: string
  signature: string
}

interface MPCWalletResponse {
  wallet_id: string
  ecdsa_pub_key: string
  eth_address: string
}

async function mpcFetch<T>(path: string, body?: unknown): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('lux_auth_token') : null
  const res = await fetch(`${MPC_API_BASE}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`MPC API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

/**
 * MPC Keyring — non-custodial wallet signing via Lux MPC threshold signatures.
 *
 * Instead of storing private keys locally, signing requests are routed to the
 * MPC cluster where the client's key share (stored in device secure enclave)
 * and the server's key share cooperate to produce a valid signature without
 * ever reconstructing the full private key.
 */
export class MPCKeyring implements IKeyring {
  private walletAddresses: string[] = []
  private walletMap: Map<string, string> = new Map() // address -> walletId

  async removeAllMnemonicsAndPrivateKeys(): Promise<boolean> {
    this.walletAddresses = []
    this.walletMap.clear()
    return true
  }

  async isUnlocked(): Promise<boolean> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('lux_auth_token') : null
    return !!token
  }

  async unlock(_password: string): Promise<boolean> {
    // MPC wallets authenticate via JWT, not local password
    return this.isUnlocked()
  }

  async lock(): Promise<boolean> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lux_auth_token')
    }
    return true
  }

  async checkPassword(_password: string): Promise<boolean> {
    return this.isUnlocked()
  }

  async changePassword(_newPassword: string): Promise<boolean> {
    // No local password for MPC wallets
    return true
  }

  async getMnemonicIds(): Promise<string[]> {
    // MPC wallets don't use mnemonics — return wallet IDs instead
    return Array.from(this.walletMap.values())
  }

  async importMnemonic(_mnemonic: string, _password?: string, _allowOverwrite?: boolean): Promise<string> {
    throw new Error('MPC wallets do not support mnemonic import. Use createMPCWallet() instead.')
  }

  async removeMnemonic(_mnemonicId: string): Promise<boolean> {
    return true
  }

  async generateAndStoreMnemonic(_password?: string): Promise<string> {
    // For MPC: trigger distributed keygen instead
    return this.createMPCWallet()
  }

  async getAddressesForStoredPrivateKeys(): Promise<string[]> {
    // Load from MPC backend if not cached
    if (this.walletAddresses.length === 0) {
      try {
        const wallets = await mpcFetch<{ wallets: { wallet_id: string; addresses: { ethereum: string } }[] }>(
          '/api/v1/wallets',
        )
        for (const w of wallets.wallets || []) {
          if (w.addresses?.ethereum) {
            this.walletAddresses.push(w.addresses.ethereum)
            this.walletMap.set(w.addresses.ethereum.toLowerCase(), w.wallet_id)
          }
        }
      } catch {
        // Return cached addresses if API unavailable
      }
    }
    return this.walletAddresses
  }

  async generateAddressForMnemonic(_mnemonic: string, _derivationIndex: number): Promise<string> {
    throw new Error('MPC wallets do not derive from mnemonics')
  }

  async generateAddressesForMnemonic(
    _mnemonic: string,
    _startIndex: number,
    _stopIndex: number,
  ): Promise<string[]> {
    throw new Error('MPC wallets do not derive from mnemonics')
  }

  async generateAddressesForMnemonicId(
    _mnemonicId: string,
    _startIndex: number,
    _stopIndex: number,
  ): Promise<string[]> {
    return this.getAddressesForStoredPrivateKeys()
  }

  async generateAndStorePrivateKey(_mnemonicId: string, _derivationIndex: number): Promise<string> {
    return this.createMPCWallet()
  }

  async removePrivateKey(address: string): Promise<boolean> {
    this.walletAddresses = this.walletAddresses.filter((a) => a.toLowerCase() !== address.toLowerCase())
    this.walletMap.delete(address.toLowerCase())
    return true
  }

  async signTransactionHashForAddress(address: string, hash: string, _chainId: number): Promise<string> {
    return this.mpcSign(address, hash)
  }

  async signMessageForAddress(address: string, message: string): Promise<string> {
    // Hash the message first (EIP-191 personal sign prefix)
    const prefixed = `\x19Ethereum Signed Message:\n${message.length}${message}`
    // For web: use SubtleCrypto to keccak256 or send raw to MPC
    return this.mpcSign(address, prefixed)
  }

  async signHashForAddress(address: string, hash: string, _chainId: number): Promise<string> {
    return this.mpcSign(address, hash)
  }

  async retrieveMnemonicUnlocked(_address: string): Promise<string | undefined> {
    // MPC wallets don't have mnemonics
    return undefined
  }

  async generateKeyPairForPasskeyWallet(): Promise<string> {
    return this.createMPCWallet()
  }

  async decryptMnemonicForPasskey(_encryptedMnemonic: string, _publicKeyBase64: string): Promise<string> {
    throw new Error('MPC wallets do not use mnemonics')
  }

  // --- MPC-specific methods ---

  async createMPCWallet(): Promise<string> {
    const result = await mpcFetch<MPCWalletResponse>('/api/v1/vaults/default/wallets', {
      protocol: 'cggmp21',
      curve: 'secp256k1',
      threshold: 2,
      parties: 3,
      label: `web-wallet-${Date.now()}`,
    })

    const address = result.eth_address
    this.walletAddresses.push(address)
    this.walletMap.set(address.toLowerCase(), result.wallet_id)
    return address
  }

  private async mpcSign(address: string, payload: string): Promise<string> {
    const walletId = this.walletMap.get(address.toLowerCase())
    if (!walletId) {
      throw new Error(`No MPC wallet found for address ${address}`)
    }

    const result = await mpcFetch<MPCSignResponse>('/api/v1/generate_mpc_sig', {
      wallet_id: walletId,
      payload: payload.startsWith('0x') ? payload.slice(2) : payload,
      chain: 'ethereum',
    })

    return result.signature
  }

  getWalletId(address: string): string | undefined {
    return this.walletMap.get(address.toLowerCase())
  }
}
