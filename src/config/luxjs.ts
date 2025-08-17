import { Lux, BN, Buffer } from '@luxfi/luxjs'
import { 
  EVMAPI, 
  KeyChain as EVMKeyChain,
  UnsignedTx as EVMUnsignedTx,
  Tx as EVMTx 
} from '@luxfi/luxjs/dist/apis/evm'
import { 
  AVMAPI,
  KeyChain as AVMKeyChain,
  UnsignedTx as AVMUnsignedTx,
  Tx as AVMTx
} from '@luxfi/luxjs/dist/apis/avm'
import {
  PlatformVMAPI,
  KeyChain as PlatformKeyChain,
  UnsignedTx as PlatformUnsignedTx,
  Tx as PlatformTx
} from '@luxfi/luxjs/dist/apis/platformvm'

// Lux network configuration
const protocol = 'https'
const host = 'api.lux.network'
const port = 443
const networkID = 1
const chainID = 'X'

// Initialize LuxJS
export const lux = new Lux(host, port, protocol, networkID, chainID)

// X-Chain API for DEX operations
export const xchain = lux.XChain()
export const xKeychain = xchain.keyChain()

// C-Chain API for EVM operations
export const cchain = lux.CChain()
export const cKeychain = cchain.keyChain()

// P-Chain API for staking/validators
export const pchain = lux.PChain()
export const pKeychain = pchain.keyChain()

// Helper functions for DEX operations
export class LuxDEXClient {
  private xchain: AVMAPI
  private cchain: EVMAPI
  private xKeychain: AVMKeyChain
  private cKeychain: EVMKeyChain

  constructor() {
    this.xchain = xchain
    this.cchain = cchain
    this.xKeychain = xKeychain
    this.cKeychain = cKeychain
  }

  // Create a new DEX order on X-Chain
  async createOrder(
    symbol: string,
    side: 'buy' | 'sell',
    price: number,
    amount: number,
    userAddress: string
  ) {
    try {
      // Build transaction for X-Chain DEX order
      const utxos = await this.xchain.getUTXOs(userAddress)
      const utxoSet = utxos.utxos
      
      // Create order metadata
      const orderData = {
        symbol,
        side,
        price: new BN(price * 1e8), // Convert to 8 decimals
        amount: new BN(amount * 1e8),
        timestamp: Date.now(),
        userAddress,
      }

      // Build and sign transaction
      const unsignedTx = await this.buildOrderTx(orderData, utxoSet)
      const signedTx = unsignedTx.sign(this.xKeychain)
      
      // Submit to network
      const txID = await this.xchain.issueTx(signedTx)
      
      return {
        success: true,
        txID: txID,
        order: orderData,
      }
    } catch (error) {
      console.error('Error creating order:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Cancel an existing order
  async cancelOrder(orderID: string, userAddress: string) {
    try {
      const utxos = await this.xchain.getUTXOs(userAddress)
      const utxoSet = utxos.utxos
      
      // Build cancel transaction
      const unsignedTx = await this.buildCancelTx(orderID, utxoSet)
      const signedTx = unsignedTx.sign(this.xKeychain)
      
      // Submit to network
      const txID = await this.xchain.issueTx(signedTx)
      
      return {
        success: true,
        txID: txID,
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Bridge assets from C-Chain to X-Chain for trading
  async bridgeToXChain(
    assetID: string,
    amount: BN,
    fromAddress: string,
    toAddress: string
  ) {
    try {
      // Export from C-Chain
      const exportTx = await this.cchain.buildExportTx(
        amount,
        assetID,
        'X',
        fromAddress,
        toAddress
      )
      
      const signedExportTx = exportTx.sign(this.cKeychain)
      const exportTxID = await this.cchain.issueTx(signedExportTx)
      
      // Wait for confirmation
      await this.waitForConfirmation(exportTxID, 'C')
      
      // Import to X-Chain
      const importTx = await this.xchain.buildImportTx(
        'C',
        toAddress,
        toAddress
      )
      
      const signedImportTx = importTx.sign(this.xKeychain)
      const importTxID = await this.xchain.issueTx(signedImportTx)
      
      return {
        success: true,
        exportTxID,
        importTxID,
      }
    } catch (error) {
      console.error('Error bridging assets:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Bridge assets from X-Chain to C-Chain after trading
  async bridgeToCChain(
    assetID: string,
    amount: BN,
    fromAddress: string,
    toAddress: string
  ) {
    try {
      // Export from X-Chain
      const exportTx = await this.xchain.buildExportTx(
        amount,
        assetID,
        'C',
        fromAddress,
        toAddress
      )
      
      const signedExportTx = exportTx.sign(this.xKeychain)
      const exportTxID = await this.xchain.issueTx(signedExportTx)
      
      // Wait for confirmation
      await this.waitForConfirmation(exportTxID, 'X')
      
      // Import to C-Chain
      const importTx = await this.cchain.buildImportTx(
        'X',
        toAddress,
        toAddress
      )
      
      const signedImportTx = importTx.sign(this.cKeychain)
      const importTxID = await this.cchain.issueTx(signedImportTx)
      
      return {
        success: true,
        exportTxID,
        importTxID,
      }
    } catch (error) {
      console.error('Error bridging assets:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Get user's trading balances on X-Chain
  async getTradingBalances(userAddress: string) {
    try {
      const balances = await this.xchain.getAllBalances(userAddress)
      return {
        success: true,
        balances,
      }
    } catch (error) {
      console.error('Error getting balances:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Helper: Build order transaction
  private async buildOrderTx(orderData: any, utxoSet: any): Promise<AVMUnsignedTx> {
    // Implementation would interact with DEX smart contract on X-Chain
    // This is a placeholder for the actual transaction building logic
    const memo = Buffer.from(JSON.stringify(orderData))
    
    // Build transaction with order data in memo field
    const unsignedTx = await this.xchain.buildBaseTx(
      utxoSet,
      new BN(0), // No transfer, just order placement
      lux.getHRP() + orderData.userAddress,
      [orderData.userAddress],
      [orderData.userAddress],
      memo
    )
    
    return unsignedTx
  }

  // Helper: Build cancel transaction
  private async buildCancelTx(orderID: string, utxoSet: any): Promise<AVMUnsignedTx> {
    const memo = Buffer.from(JSON.stringify({ action: 'cancel', orderID }))
    
    const unsignedTx = await this.xchain.buildBaseTx(
      utxoSet,
      new BN(0),
      '', // No recipient for cancel
      [],
      [],
      memo
    )
    
    return unsignedTx
  }

  // Helper: Wait for transaction confirmation
  private async waitForConfirmation(txID: string, chain: 'X' | 'C' | 'P'): Promise<void> {
    let api: AVMAPI | EVMAPI | PlatformVMAPI
    
    switch (chain) {
      case 'X':
        api = this.xchain
        break
      case 'C':
        api = this.cchain
        break
      case 'P':
        api = pchain
        break
    }
    
    // Poll for transaction status
    let attempts = 0
    const maxAttempts = 30
    
    while (attempts < maxAttempts) {
      try {
        const status = await api.getTxStatus(txID)
        if (status === 'Accepted') {
          return
        } else if (status === 'Rejected' || status === 'Unknown') {
          throw new Error(`Transaction ${txID} was ${status}`)
        }
      } catch (error) {
        // Transaction might not be indexed yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      attempts++
    }
    
    throw new Error(`Transaction ${txID} confirmation timeout`)
  }
}

// Export singleton instance
export const luxDEXClient = new LuxDEXClient()