/**
 * Ledger Hardware Wallet Bridge
 * Adapted from xwallet/Rabby for WXT/React architecture
 */

import {
  HardwareAccount,
  HardwareWalletBridge,
  HardwareWalletError,
  HardwareWalletErrorCodes,
  HardwareWalletType,
  LEDGER_HD_PATHS,
  LedgerHDPathType,
  SignMessageRequest,
  SignTransactionRequest,
  SignTypedDataRequest,
} from '../types'

// We'll dynamically import Ledger packages to handle WebHID requirements
let Transport: typeof import('@ledgerhq/hw-transport').default | null = null
let TransportWebHID: typeof import('@ledgerhq/hw-transport-webhid').default | null = null
let Eth: typeof import('@ledgerhq/hw-app-eth').default | null = null

async function loadLedgerDependencies() {
  if (!Transport) {
    const [transportModule, webHidModule, ethModule] = await Promise.all([
      import('@ledgerhq/hw-transport'),
      import('@ledgerhq/hw-transport-webhid'),
      import('@ledgerhq/hw-app-eth'),
    ])
    Transport = transportModule.default
    TransportWebHID = webHidModule.default
    Eth = ethModule.default
  }
}

export class LedgerBridge implements HardwareWalletBridge {
  private transport: InstanceType<typeof import('@ledgerhq/hw-transport').default> | null = null
  private eth: InstanceType<typeof import('@ledgerhq/hw-app-eth').default> | null = null
  private hdPathType: LedgerHDPathType = LedgerHDPathType.LedgerLive
  private _isConnected = false

  constructor(hdPathType?: LedgerHDPathType) {
    if (hdPathType) {
      this.hdPathType = hdPathType
    }
  }

  setHDPathType(type: LedgerHDPathType): void {
    this.hdPathType = type
  }

  getHDPathType(): LedgerHDPathType {
    return this.hdPathType
  }

  async connect(): Promise<void> {
    try {
      await loadLedgerDependencies()

      if (!TransportWebHID) {
        throw new HardwareWalletError(
          'Ledger transport not available',
          HardwareWalletErrorCodes.TRANSPORT_ERROR,
          HardwareWalletType.Ledger
        )
      }

      // Check if WebHID is available
      if (!navigator.hid) {
        throw new HardwareWalletError(
          'WebHID is not supported in this browser',
          HardwareWalletErrorCodes.TRANSPORT_ERROR,
          HardwareWalletType.Ledger
        )
      }

      this.transport = await TransportWebHID.create()
      this.eth = new Eth!(this.transport)
      this._isConnected = true
    } catch (error) {
      this._isConnected = false
      if (error instanceof HardwareWalletError) {
        throw error
      }
      throw new HardwareWalletError(
        `Failed to connect to Ledger: ${(error as Error).message}`,
        HardwareWalletErrorCodes.CONNECTION_FAILED,
        HardwareWalletType.Ledger
      )
    }
  }

  async disconnect(): Promise<void> {
    if (this.transport) {
      await this.transport.close()
      this.transport = null
      this.eth = null
    }
    this._isConnected = false
  }

  isConnected(): boolean {
    return this._isConnected && this.eth !== null
  }

  private getDerivationPath(index: number): string {
    const basePath = LEDGER_HD_PATHS[this.hdPathType].value

    switch (this.hdPathType) {
      case LedgerHDPathType.LedgerLive:
        // m/44'/60'/0'/0/0 -> m/44'/60'/index'/0/0
        return `m/44'/60'/${index}'/0/0`
      case LedgerHDPathType.BIP44:
        // m/44'/60'/0'/0 -> m/44'/60'/0'/0/index
        return `m/44'/60'/0'/0/${index}`
      case LedgerHDPathType.Legacy:
        // m/44'/60'/0' -> m/44'/60'/index'
        return `m/44'/60'/${index}'`
      default:
        return basePath.replace(/\/0$/, `/${index}`)
    }
  }

  async getAccounts(page = 0, perPage = 5): Promise<HardwareAccount[]> {
    if (!this.eth) {
      throw new HardwareWalletError(
        'Ledger not connected',
        HardwareWalletErrorCodes.NOT_CONNECTED,
        HardwareWalletType.Ledger
      )
    }

    const accounts: HardwareAccount[] = []
    const startIndex = page * perPage

    for (let i = 0; i < perPage; i++) {
      const index = startIndex + i
      const path = this.getDerivationPath(index)

      try {
        const result = await this.eth.getAddress(path)
        accounts.push({
          address: result.address,
          index,
          path,
        })
      } catch (error) {
        // Handle user rejection or device errors
        const errorMessage = (error as Error).message || ''
        if (
          errorMessage.includes('denied') ||
          errorMessage.includes('rejected') ||
          errorMessage.includes('0x6985')
        ) {
          throw new HardwareWalletError(
            'User rejected the request',
            HardwareWalletErrorCodes.USER_REJECTED,
            HardwareWalletType.Ledger
          )
        }
        if (errorMessage.includes('locked') || errorMessage.includes('0x6b0c')) {
          throw new HardwareWalletError(
            'Device is locked. Please unlock your Ledger.',
            HardwareWalletErrorCodes.DEVICE_LOCKED,
            HardwareWalletType.Ledger
          )
        }
        if (errorMessage.includes('0x6d00') || errorMessage.includes('CLA_NOT_SUPPORTED')) {
          throw new HardwareWalletError(
            'Please open the Ethereum app on your Ledger device',
            HardwareWalletErrorCodes.APP_NOT_OPEN,
            HardwareWalletType.Ledger
          )
        }
        throw new HardwareWalletError(
          `Failed to get account: ${errorMessage}`,
          HardwareWalletErrorCodes.UNKNOWN_ERROR,
          HardwareWalletType.Ledger
        )
      }
    }

    return accounts
  }

  async signTransaction(request: SignTransactionRequest): Promise<string> {
    if (!this.eth) {
      throw new HardwareWalletError(
        'Ledger not connected',
        HardwareWalletErrorCodes.NOT_CONNECTED,
        HardwareWalletType.Ledger
      )
    }

    // Build raw unsigned transaction
    // This requires ethers.js or similar for RLP encoding
    const { Transaction } = await import('ethers')

    const tx = Transaction.from({
      to: request.to,
      value: request.value,
      data: request.data,
      gasLimit: request.gasLimit,
      gasPrice: request.gasPrice,
      maxFeePerGas: request.maxFeePerGas,
      maxPriorityFeePerGas: request.maxPriorityFeePerGas,
      nonce: request.nonce,
      chainId: request.chainId,
    })

    const unsignedTx = tx.unsignedSerialized.slice(2) // Remove 0x prefix

    // For now, we need to get the path from context
    // In a full implementation, we'd track which account is being used
    const path = this.getDerivationPath(0)

    try {
      const signature = await this.eth.signTransaction(path, unsignedTx)

      // Combine signature with transaction
      const signedTx = Transaction.from({
        ...tx.toJSON(),
        signature: {
          r: '0x' + signature.r,
          s: '0x' + signature.s,
          v: parseInt(signature.v, 16),
        },
      })

      return signedTx.serialized
    } catch (error) {
      const errorMessage = (error as Error).message || ''
      if (errorMessage.includes('denied') || errorMessage.includes('rejected')) {
        throw new HardwareWalletError(
          'User rejected the transaction',
          HardwareWalletErrorCodes.USER_REJECTED,
          HardwareWalletType.Ledger
        )
      }
      throw new HardwareWalletError(
        `Failed to sign transaction: ${errorMessage}`,
        HardwareWalletErrorCodes.UNKNOWN_ERROR,
        HardwareWalletType.Ledger
      )
    }
  }

  async signMessage(request: SignMessageRequest): Promise<string> {
    if (!this.eth) {
      throw new HardwareWalletError(
        'Ledger not connected',
        HardwareWalletErrorCodes.NOT_CONNECTED,
        HardwareWalletType.Ledger
      )
    }

    const path = this.getDerivationPath(0)

    try {
      // Remove 0x prefix if present and convert to buffer
      const messageHex = request.message.startsWith('0x')
        ? request.message.slice(2)
        : Buffer.from(request.message).toString('hex')

      const signature = await this.eth.signPersonalMessage(path, messageHex)

      // Combine r, s, v into signature
      const v = parseInt(signature.v.toString(), 10)
      return '0x' + signature.r + signature.s + (v < 27 ? v + 27 : v).toString(16)
    } catch (error) {
      const errorMessage = (error as Error).message || ''
      if (errorMessage.includes('denied') || errorMessage.includes('rejected')) {
        throw new HardwareWalletError(
          'User rejected the message signing',
          HardwareWalletErrorCodes.USER_REJECTED,
          HardwareWalletType.Ledger
        )
      }
      throw new HardwareWalletError(
        `Failed to sign message: ${errorMessage}`,
        HardwareWalletErrorCodes.UNKNOWN_ERROR,
        HardwareWalletType.Ledger
      )
    }
  }

  async signTypedData(request: SignTypedDataRequest): Promise<string> {
    if (!this.eth) {
      throw new HardwareWalletError(
        'Ledger not connected',
        HardwareWalletErrorCodes.NOT_CONNECTED,
        HardwareWalletType.Ledger
      )
    }

    const path = this.getDerivationPath(0)
    const typedData = JSON.parse(request.data)

    try {
      // Use EIP-712 signing
      const signature = await this.eth.signEIP712Message(path, typedData)

      const v = parseInt(signature.v.toString(), 10)
      return '0x' + signature.r + signature.s + (v < 27 ? v + 27 : v).toString(16)
    } catch (error) {
      const errorMessage = (error as Error).message || ''
      if (errorMessage.includes('denied') || errorMessage.includes('rejected')) {
        throw new HardwareWalletError(
          'User rejected typed data signing',
          HardwareWalletErrorCodes.USER_REJECTED,
          HardwareWalletType.Ledger
        )
      }
      throw new HardwareWalletError(
        `Failed to sign typed data: ${errorMessage}`,
        HardwareWalletErrorCodes.UNKNOWN_ERROR,
        HardwareWalletType.Ledger
      )
    }
  }
}

export const ledgerBridge = new LedgerBridge()
